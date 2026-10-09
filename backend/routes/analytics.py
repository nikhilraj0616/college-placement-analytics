from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from auth.dependencies import require_any_role, require_management_or_above
from services import placement_rate, salary_analytics, branch_analytics, cgpa_correlation, recruitment_trends

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/placement-rate")
def analytics_placement_rate(
    year: Optional[int] = Query(None, description="Filter by graduation year"),
    db: Session = Depends(get_db),
    _=Depends(require_any_role),
):
    return placement_rate.get_placement_rate(db, year)


@router.get("/salary")
def analytics_salary(
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_any_role),
):
    return salary_analytics.get_salary_analytics(db, year)


@router.get("/branch")
def analytics_branch(
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_any_role),
):
    return branch_analytics.get_branch_analytics(db, year)


@router.get("/cgpa")
def analytics_cgpa(
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_any_role),
):
    return cgpa_correlation.get_cgpa_correlation(db, year)


@router.get("/trends")
def analytics_trends(
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(require_any_role),
):
    return recruitment_trends.get_recruitment_trends(db, year)


@router.get("/summary")
def analytics_summary(
    db: Session = Depends(get_db),
    _=Depends(require_any_role),
):
    """KPI summary for the dashboard home."""
    pr = placement_rate.get_placement_rate(db)
    sal = salary_analytics.get_salary_analytics(db)
    br = branch_analytics.get_branch_analytics(db)
    tr = recruitment_trends.get_recruitment_trends(db)

    top_branch = max(br["branch_data"], key=lambda x: x["placed"], default=None)
    top_company = tr["top_companies"][0]["company"] if tr.get("top_companies") else "N/A"

    return {
        "total_students": pr["total_students"],
        "placed_students": pr["placed_students"],
        "overall_placement_rate": pr["overall_rate"],
        "avg_package_lpa": sal.get("overall", {}).get("avg", 0),
        "max_package_lpa": sal.get("overall", {}).get("max", 0),
        "top_branch": top_branch["branch"] if top_branch else "N/A",
        "top_company": top_company,
    }
