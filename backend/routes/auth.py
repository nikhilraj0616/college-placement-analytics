from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import get_db
from models.user import User
from schemas.auth import UserCreate, UserRead, Token
from auth.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    user = User(
        username=user_in.username,
        hashed_password=hash_password(user_in.password),
        role=user_in.role,
        roll_number=user_in.roll_number,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user.username, "role": user.role})
    return Token(access_token=token, token_type="bearer", role=user.role, username=user.username)


@router.get("/me", response_model=UserRead)
def get_me(db: Session = Depends(get_db), token: str = ""):
    # Handled via dependency in protected routes; exposed for frontend "whoami"
    from auth.dependencies import get_current_user
    from fastapi import Request
    raise HTTPException(status_code=501, detail="Use Authorization header")
