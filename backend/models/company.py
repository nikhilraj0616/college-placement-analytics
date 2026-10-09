from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    sector = Column(String, nullable=False, default="IT")  # IT | Core | Finance | Consulting | PSU
    type = Column(String, nullable=False, default="MNC")   # MNC | Startup | Government

    placements = relationship("Placement", back_populates="company")
