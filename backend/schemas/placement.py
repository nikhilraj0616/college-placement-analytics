from pydantic import BaseModel
from typing import Optional
from datetime import date


class CompanyCreate(BaseModel):
    name: str
    sector: str = "IT"
    type: str = "MNC"


class CompanyRead(BaseModel):
    id: int
    name: str
    sector: str
    type: str

    model_config = {"from_attributes": True}


class PlacementCreate(BaseModel):
    student_id: int
    company_id: int
    job_role: str
    package_lpa: float
    offer_type: str = "Full-Time"
    placement_date: date
    status: str = "Placed"


class PlacementRead(BaseModel):
    id: int
    student_id: int
    company_id: int
    job_role: str
    package_lpa: float
    offer_type: str
    placement_date: date
    status: str
    student_name: Optional[str] = None
    roll_number: Optional[str] = None
    branch: Optional[str] = None
    cgpa: Optional[float] = None
    company_name: Optional[str] = None
    company_sector: Optional[str] = None

    model_config = {"from_attributes": True}
