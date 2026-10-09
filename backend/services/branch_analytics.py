from sqlalchemy.orm import Session
from sqlalchemy import func
from models.student import Student
from models.placement import Placement
from models.company import Company
from typing import Optional


def get_branch_analytics(db: Session, year: Optional[int] = None) -> dict:
    branches = [r[0] for r in db.query(Student.branch).distinct().all()]
    data = []

    for branch in sorted(branches):
        student_q = db.query(Student).filter(Student.branch == branch)
        if year:
            student_q = student_q.filter(Student.graduation_year == year)
        total = student_q.count()

        placed_q = (
            db.query(Placement)
            .join(Student, Student.id == Placement.student_id)
            .filter(Student.branch == branch, Placement.status == "Placed")
        )
        if year:
            placed_q = placed_q.filter(Student.graduation_year == year)

        placed_count = placed_q.distinct(Placement.student_id).count()
        pkgs = [p.package_lpa for p in placed_q.all()]
        avg_pkg = round(sum(pkgs) / len(pkgs), 2) if pkgs else 0

        # Distinct companies visiting this branch
        company_count = (
            db.query(func.count(func.distinct(Placement.company_id)))
            .join(Student, Student.id == Placement.student_id)
            .filter(Student.branch == branch)
            .scalar()
        )

        data.append({
            "branch": branch,
            "total_students": total,
            "placed": placed_count,
            "unplaced": total - placed_count,
            "placement_rate": round((placed_count / total * 100), 2) if total else 0,
            "avg_package": avg_pkg,
            "companies_visited": company_count or 0,
        })

    return {"branch_data": data}
