from sqlalchemy.orm import Session
from sqlalchemy import func
from models.student import Student
from models.placement import Placement
from models.company import Company
from typing import Optional
import statistics


def get_salary_analytics(db: Session, year: Optional[int] = None) -> dict:
    q = db.query(Placement).filter(Placement.status == "Placed")
    if year:
        q = q.filter(
            Placement.student_id.in_(
                db.query(Student.id).filter(Student.graduation_year == year)
            )
        )

    packages = [p.package_lpa for p in q.all()]
    if not packages:
        return {"error": "No placement data found"}

    avg = round(sum(packages) / len(packages), 2)
    median = round(statistics.median(packages), 2)

    # Package bands
    bands = {
        "lt_4": sum(1 for p in packages if p < 4),
        "4_to_8": sum(1 for p in packages if 4 <= p < 8),
        "8_to_15": sum(1 for p in packages if 8 <= p < 15),
        "gt_15": sum(1 for p in packages if p >= 15),
    }

    # Top 10 companies by avg package
    company_avgs = (
        db.query(Company.name, func.avg(Placement.package_lpa).label("avg_pkg"))
        .join(Placement, Placement.company_id == Company.id)
        .filter(Placement.status == "Placed")
        .group_by(Company.name)
        .order_by(func.avg(Placement.package_lpa).desc())
        .limit(10)
        .all()
    )

    # Per-branch salary
    branches = [r[0] for r in db.query(Student.branch).distinct().all()]
    branch_salary = []
    for branch in branches:
        pkgs = [
            p.package_lpa for p in
            db.query(Placement)
            .join(Student, Student.id == Placement.student_id)
            .filter(Student.branch == branch, Placement.status == "Placed")
            .all()
        ]
        if pkgs:
            branch_salary.append({
                "branch": branch,
                "avg": round(sum(pkgs) / len(pkgs), 2),
                "min": round(min(pkgs), 2),
                "max": round(max(pkgs), 2),
                "count": len(pkgs),
            })

    return {
        "overall": {
            "min": round(min(packages), 2),
            "max": round(max(packages), 2),
            "avg": avg,
            "median": median,
            "total_offers": len(packages),
        },
        "package_bands": bands,
        "top_companies": [{"company": r[0], "avg_package": round(r[1], 2)} for r in company_avgs],
        "branch_salary": branch_salary,
    }
