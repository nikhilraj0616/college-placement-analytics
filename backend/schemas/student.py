from pydantic import BaseModel, Field
from typing import Optional


class StudentCreate(BaseModel):
    name: str
    roll_number: str
    branch: str
    cgpa: float = Field(ge=0.0, le=10.0)
    graduation_year: int


class StudentRead(BaseModel):
    id: int
    name: str
    roll_number: str
    branch: str
    cgpa: float
    graduation_year: int

    model_config = {"from_attributes": True}


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    branch: Optional[str] = None
    cgpa: Optional[float] = None
    graduation_year: Optional[int] = None
