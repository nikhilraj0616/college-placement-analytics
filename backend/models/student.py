from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    roll_number = Column(String, unique=True, index=True, nullable=False)
    branch = Column(String, nullable=False)
    cgpa = Column(Float, nullable=False)
    graduation_year = Column(Integer, nullable=False)

    placements = relationship("Placement", back_populates="student")
