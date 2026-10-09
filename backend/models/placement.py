from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Placement(Base):
    __tablename__ = "placements"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    job_role = Column(String, nullable=False)
    package_lpa = Column(Float, nullable=False)
    offer_type = Column(String, nullable=False, default="Full-Time")  # Full-Time | Intern | PPO
    placement_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="Placed")  # Placed | Unplaced | Offer-Withdrawn

    student = relationship("Student", back_populates="placements")
    company = relationship("Company", back_populates="placements")
