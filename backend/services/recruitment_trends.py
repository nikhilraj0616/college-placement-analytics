from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from models.placement import Placement
from models.company import Company
from models.student import Student
from typing import Optional
from collections import defaultdict


def get_recruitment_trends(db: Session, year: Optional[int] = None) -> dict:
    q = db.query(Placement).filter(Placement.status == "Placed")
    if year:
        q = q.filter(
            Placement.student_id.in_(
                db.query(Student.id).filter(Student.graduation_year == year)
            )
        )
    placements = q.all()

    # Monthly timeline
    monthly = defaultdict(int)
    for p in placements:
        key = f"{p.placement_date.year}-{p.placement_date.month:02d}"
        monthly[key] += 1
    monthly_timeline = [{"month": k, "offers": v} for k, v in sorted(monthly.items())]

    # Sector split
    sector_counts = defaultdict(int)
    for p in placements:
        company = db.query(Company).filter(Company.id == p.company_id).first()
        if company:
            sector_counts[company.sector] += 1
    sector_split = [{"sector": k, "count": v} for k, v in sector_counts.items()]

    # Top recurring companies
    company_hire_counts = defaultdict(int)
    for p in placements:
        company = db.query(Company).filter(Company.id == p.company_id).first()
        if company:
            company_hire_counts[company.name] += 1
    top_companies = sorted(company_hire_counts.items(), key=lambda x: x[1], reverse=True)[:10]

    # YoY company participation
    years = [r[0] for r in db.query(Student.graduation_year).distinct().order_by(Student.graduation_year).all()]
    yoy_companies = []
    for y in years:
        count = (
            db.query(func.count(func.distinct(Placement.company_id)))
            .join(Student, Student.id == Placement.student_id)
            .filter(Student.graduation_year == y, Placement.status == "Placed")
            .scalar()
        )
        yoy_companies.append({"year": y, "companies": count or 0})

    return {
        "monthly_timeline": monthly_timeline,
        "sector_split": sector_split,
        "top_companies": [{"company": k, "hires": v} for k, v in top_companies],
        "yoy_company_participation": yoy_companies,
    }
