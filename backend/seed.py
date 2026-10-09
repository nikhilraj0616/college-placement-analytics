"""
Seed script: creates 3 demo users and loads sample_placement_data.csv.
Run once after first-time setup:
    cd backend
    python seed.py
"""
import sys
import os

# Make sure we can import from the backend root
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
import models.user       # noqa
import models.student    # noqa
import models.company    # noqa
import models.placement  # noqa

from passlib.context import CryptContext
from models.user import User
import pandas as pd
from models.student import Student
from models.company import Company
from models.placement import Placement
from datetime import datetime

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db = SessionLocal()

# ── Create demo users ────────────────────────────────────────────────────────
DEMO_USERS = [
    {"username": "admin",   "password": "admin123",   "role": "admin",      "roll_number": None},
    {"username": "mgmt",    "password": "mgmt123",    "role": "management", "roll_number": None},
    {"username": "student", "password": "student123", "role": "student",    "roll_number": "CS001"},
]

for u in DEMO_USERS:
    existing = db.query(User).filter(User.username == u["username"]).first()
    if not existing:
        user = User(
            username=u["username"],
            hashed_password=pwd_context.hash(u["password"]),
            role=u["role"],
            roll_number=u["roll_number"],
        )
        db.add(user)
        print(f"  Created user: {u['username']} ({u['role']})")
    else:
        print(f"  User already exists: {u['username']}")

db.commit()

# ── Load sample CSV ──────────────────────────────────────────────────────────
csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_placement_data.csv")
if not os.path.exists(csv_path):
    print("sample_placement_data.csv not found — skipping data load")
    db.close()
    sys.exit(0)

df = pd.read_csv(csv_path)
df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

inserted = 0
skipped = 0
for _, row in df.iterrows():
    try:
        roll_no = str(row["roll_no"]).strip()
        student = db.query(Student).filter(Student.roll_number == roll_no).first()
        if not student:
            student = Student(
                name=str(row["name"]).strip(),
                roll_number=roll_no,
                branch=str(row["branch"]).strip(),
                cgpa=float(row["cgpa"]),
                graduation_year=int(row["graduation_year"]),
            )
            db.add(student)
            db.flush()

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

        placement = Placement(
            student_id=student.id,
            company_id=company.id,
            job_role=str(row["job_role"]).strip(),
            package_lpa=float(row["package_lpa"]),
            offer_type=str(row.get("offer_type", "Full-Time")).strip(),
            placement_date=pd.to_datetime(row["placement_date"]).date(),
            status=str(row.get("status", "Placed")).strip(),
        )
        db.add(placement)
        inserted += 1
    except Exception as exc:
        skipped += 1
        db.rollback()
        print(f"  Skipped row: {exc}")
        continue

db.commit()
db.close()
print(f"\n✅ Seed complete — {inserted} placements inserted, {skipped} skipped.")
print("Demo accounts: admin/admin123 | mgmt/mgmt123 | student/student123")
