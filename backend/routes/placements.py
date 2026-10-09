from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.placement import Placement
from models.student import Student
from models.company import Company
from schemas.placement import PlacementCreate, PlacementRead, CompanyCreate, CompanyRead
from auth.dependencies import require_admin, require_any_role, get_current_user
from models.user import User

router = APIRouter(tags=["Placements & Companies"])


# ─── Company endpoints ──────────────────────────────────────────────────────

@router.post("/companies", response_model=CompanyRead, status_code=201)
def create_company(company_in: CompanyCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    existing = db.query(Company).filter(Company.name == company_in.name).first()
    if existing:
        return existing
    company = Company(**company_in.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


@router.get("/companies", response_model=List[CompanyRead])
def list_companies(db: Session = Depends(get_db), _=Depends(require_any_role)):
    return db.query(Company).all()


# ─── Placement endpoints ─────────────────────────────────────────────────────

@router.post("/placements", response_model=PlacementRead, status_code=201)
def create_placement(placement_in: PlacementCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    placement = Placement(**placement_in.model_dump())
    db.add(placement)
    db.commit()
    db.refresh(placement)
    return _enrich(placement, db)


@router.get("/placements", response_model=List[PlacementRead])
def list_placements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Placement)
    # Students see only their own record
    if current_user.role == "student" and current_user.roll_number:
        student = db.query(Student).filter(Student.roll_number == current_user.roll_number).first()
        if student:
            q = q.filter(Placement.student_id == student.id)
        else:
            return []
    placements = q.all()
    return [_enrich(p, db) for p in placements]


@router.get("/placements/{placement_id}", response_model=PlacementRead)
def get_placement(placement_id: int, db: Session = Depends(get_db), _=Depends(require_any_role)):
    placement = db.query(Placement).filter(Placement.id == placement_id).first()
    if not placement:
        raise HTTPException(status_code=404, detail="Placement not found")
    return _enrich(placement, db)


@router.delete("/placements/{placement_id}", status_code=204)
def delete_placement(placement_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    placement = db.query(Placement).filter(Placement.id == placement_id).first()
    if not placement:
        raise HTTPException(status_code=404, detail="Placement not found")
    db.delete(placement)
    db.commit()


def _enrich(placement: Placement, db: Session) -> PlacementRead:
    """Attach student and company details to a PlacementRead."""
    student = db.query(Student).filter(Student.id == placement.student_id).first()
    company = db.query(Company).filter(Company.id == placement.company_id).first()
    return PlacementRead(
        id=placement.id,
        student_id=placement.student_id,
        company_id=placement.company_id,
        job_role=placement.job_role,
        package_lpa=placement.package_lpa,
        offer_type=placement.offer_type,
        placement_date=placement.placement_date,
        status=placement.status,
        student_name=student.name if student else None,
        roll_number=student.roll_number if student else None,
        branch=student.branch if student else None,
        cgpa=student.cgpa if student else None,
        company_name=company.name if company else None,
        company_sector=company.sector if company else None,
    )
