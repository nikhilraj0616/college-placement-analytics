from sqlalchemy.orm import Session
from models.student import Student
from models.placement import Placement
from typing import Optional
import math


def _pearson(x_list, y_list) -> float:
    n = len(x_list)
    if n < 2:
        return 0.0
    mx = sum(x_list) / n
    my = sum(y_list) / n
    num = sum((x - mx) * (y - my) for x, y in zip(x_list, y_list))
    den = math.sqrt(sum((x - mx) ** 2 for x in x_list) * sum((y - my) ** 2 for y in y_list))
    return round(num / den, 4) if den else 0.0


def get_cgpa_correlation(db: Session, year: Optional[int] = None) -> dict:
    q = (
        db.query(Student.cgpa, Placement.package_lpa, Student.name, Student.roll_number, Student.branch)
        .join(Placement, Placement.student_id == Student.id)
        .filter(Placement.status == "Placed")
    )
    if year:
        q = q.filter(Student.graduation_year == year)

    rows = q.all()
    if not rows:
        return {"error": "No data"}

    scatter = [{"cgpa": r[0], "package": r[1], "branch": r[4]} for r in rows]
    cgpa_vals = [r[0] for r in rows]
    pkg_vals = [r[1] for r in rows]
    pearson_r = _pearson(cgpa_vals, pkg_vals)

    # CGPA band analysis
    bands = [
        {"band": "<6", "min": 0, "max": 6},
        {"band": "6-7", "min": 6, "max": 7},
        {"band": "7-8", "min": 7, "max": 8},
        {"band": "8-9", "min": 8, "max": 9},
        {"band": "9-10", "min": 9, "max": 10.01},
    ]
    band_data = []
    for b in bands:
        band_rows = [r for r in rows if b["min"] <= r[0] < b["max"]]
        pkgs = [r[1] for r in band_rows]
        band_data.append({
            "band": b["band"],
            "count": len(band_rows),
            "avg_package": round(sum(pkgs) / len(pkgs), 2) if pkgs else 0,
        })

    return {
        "scatter_data": scatter,
        "pearson_r": pearson_r,
        "interpretation": _interpret_pearson(pearson_r),
        "band_analysis": band_data,
    }


def _interpret_pearson(r: float) -> str:
    abs_r = abs(r)
    if abs_r >= 0.7:
        return "Strong positive correlation"
    elif abs_r >= 0.4:
        return "Moderate positive correlation"
    elif abs_r >= 0.2:
        return "Weak positive correlation"
    else:
        return "Little to no linear correlation"
