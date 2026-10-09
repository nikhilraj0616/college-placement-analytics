from sqlalchemy.orm import Session
from sqlalchemy import func
from models.student import Student
from models.placement import Placement
from typing import Optional


def get_placement_rate(db: Session, year: Optional[int] = None) -> dict:
    """Overall and branch-wise placement rate, plus YoY comparison."""
    student_q = db.query(Student)
    placement_q = db.query(Placement).filter(Placement.status == "Placed")

    if year:
        student_q = student_q.filter(Student.graduation_year == year)
        placement_q = placement_q.filter(
            Placement.student_id.in_(
                db.query(Student.id).filter(Student.graduation_year == year)
            )
        )

    total_students = student_q.count()
    placed_students = placement_q.distinct(Placement.student_id).count()
    overall_rate = round((placed_students / total_students * 100), 2) if total_students else 0

    # Branch-wise
    branches = [r[0] for r in db.query(Student.branch).distinct().all()]
    branch_data = []
    for branch in branches:
        b_total = db.query(Student).filter(Student.branch == branch)
        b_placed = db.query(Placement).filter(
            Placement.status == "Placed",
            Placement.student_id.in_(db.query(Student.id).filter(Student.branch == branch))
        )
        if year:
            b_total = b_total.filter(Student.graduation_year == year)
            b_placed = b_placed.filter(
                Placement.student_id.in_(
                    db.query(Student.id).filter(Student.graduation_year == year, Student.branch == branch)
                )
            )
        bt = b_total.count()
        bp = b_placed.distinct(Placement.student_id).count()
        branch_data.append({
            "branch": branch,
            "total": bt,
            "placed": bp,
            "rate": round((bp / bt * 100), 2) if bt else 0,
        })

    # YoY: last 4 years
    years = [r[0] for r in db.query(Student.graduation_year).distinct().order_by(Student.graduation_year).all()]
    yoy = []
    for y in years:
        yt = db.query(Student).filter(Student.graduation_year == y).count()
        yp = db.query(Placement).filter(
            Placement.status == "Placed",
            Placement.student_id.in_(db.query(Student.id).filter(Student.graduation_year == y))
        ).distinct(Placement.student_id).count()
        yoy.append({"year": y, "total": yt, "placed": yp, "rate": round((yp / yt * 100), 2) if yt else 0})

    return {
        "overall_rate": overall_rate,
        "total_students": total_students,
        "placed_students": placed_students,
        "unplaced_students": total_students - placed_students,
        "branch_breakdown": branch_data,
        "yoy_trend": yoy,
    }
