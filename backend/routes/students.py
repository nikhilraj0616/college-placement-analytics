from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.student import Student
from schemas.student import StudentCreate, StudentRead, StudentUpdate
from auth.dependencies import require_admin, require_any_role

router = APIRouter(prefix="/students", tags=["Students"])


@router.post("/", response_model=StudentRead, status_code=201)
def create_student(student_in: StudentCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    existing = db.query(Student).filter(Student.roll_number == student_in.roll_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Roll number already exists")
    student = Student(**student_in.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/", response_model=List[StudentRead])
def list_students(db: Session = Depends(get_db), _=Depends(require_any_role)):
    return db.query(Student).all()


@router.get("/{student_id}", response_model=StudentRead)
def get_student(student_id: int, db: Session = Depends(get_db), _=Depends(require_any_role)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.put("/{student_id}", response_model=StudentRead)
def update_student(student_id: int, update: StudentUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for field, value in update.model_dump(exclude_none=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
