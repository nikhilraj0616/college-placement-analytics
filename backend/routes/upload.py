from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import io
from datetime import datetime

from database import get_db
from models.student import Student
from models.company import Company
from models.placement import Placement
from auth.dependencies import require_admin

router = APIRouter(prefix="/upload", tags=["Data Upload"])

REQUIRED_COLUMNS = {"roll_no", "name", "branch", "cgpa", "graduation_year",
                    "company", "sector", "company_type", "job_role",
                    "package_lpa", "offer_type", "placement_date", "status"}


@router.post("/csv")
def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db), _=Depends(require_admin)):
    """
    Accept a .csv or .xlsx file and bulk-insert placement records.
    Returns counts of inserted and skipped rows.
    """
    filename = file.filename or ""
    if not (filename.endswith(".csv") or filename.endswith(".xlsx")):
        raise HTTPException(status_code=400, detail="Only .csv and .xlsx files are accepted")

    content = file.file.read()
    try:
        if filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.BytesIO(content))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not parse file: {exc}")

    # Normalise column names
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required columns: {missing}")

    inserted = 0
    skipped = []

    for idx, row in df.iterrows():
        try:
            roll_no = str(row["roll_no"]).strip()
            cgpa = float(row["cgpa"])
            grad_year = int(row["graduation_year"])
            package = float(row["package_lpa"])
            placement_date = pd.to_datetime(row["placement_date"]).date()

            # Upsert student
            student = db.query(Student).filter(Student.roll_number == roll_no).first()
            if not student:
                student = Student(
                    name=str(row["name"]).strip(),
                    roll_number=roll_no,
                    branch=str(row["branch"]).strip(),
                    cgpa=cgpa,
                    graduation_year=grad_year,
                )
                db.add(student)
                db.flush()

            # Upsert company
            company_name = str(row["company"]).strip()
            company = db.query(Company).filter(Company.name == company_name).first()
            if not company:
                company = Company(
                    name=company_name,
                    sector=str(row.get("sector", "IT")).strip(),
                    type=str(row.get("company_type", "MNC")).strip(),
                )
                db.add(company)
                db.flush()

            # Insert placement
            placement = Placement(
                student_id=student.id,
                company_id=company.id,
                job_role=str(row["job_role"]).strip(),
                package_lpa=package,
                offer_type=str(row.get("offer_type", "Full-Time")).strip(),
                placement_date=placement_date,
                status=str(row.get("status", "Placed")).strip(),
            )
            db.add(placement)
            inserted += 1

        except Exception as exc:
            skipped.append({"row": int(idx) + 2, "reason": str(exc)})
            db.rollback()
            continue

    db.commit()
    return {
        "message": "Upload complete",
        "inserted": inserted,
        "skipped_count": len(skipped),
        "skipped_rows": skipped[:20],  # cap for readability
    }
