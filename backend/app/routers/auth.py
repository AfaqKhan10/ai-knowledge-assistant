from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from ..schemas.user import UserCreate, User
from ..models.user import User as UserModel
from ..database import get_db
from ..config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(scheme_name="BearerAuth")

class SimpleLogin(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)

def get_current_user(auth: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> UserModel:
    token = auth.credentials
    # In case user pasted "Bearer <token>" into Swagger manually
    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "")
        
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token payload is missing user identity")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token or token expired")
    
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User associated with this token no longer exists")
    return user

@router.post("/signup", response_model=User)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    new_user = UserModel(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
@router.post("/login")
def login(login_data: SimpleLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})

    # Yeh 4 line add kar do (user info bhej do)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {  # ← yeh object add karo
            "name": user.name,  # user table mein name column se aa raha hai
            "email": user.email
        }
    }



@router.post("/login")
def login(login_data: SimpleLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
