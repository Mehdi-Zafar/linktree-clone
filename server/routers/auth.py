from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from config import get_settings
import models
import schemas
from auth import (
    get_password_hash, 
    authenticate_user, 
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    get_current_active_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
        bio=user.bio
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default profile
    db_profile = models.Profile(user_id=db_user.id)
    db.add(db_profile)
    db.commit()
    
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login.
    Returns access token in response body and sets refresh token in HTTP-only cookie.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    # Create refresh token
    refresh_token = create_refresh_token(
        data={"sub": user.email, "user_id": user.id}
    )
    
    # Set refresh token in HTTP-only cookie
    cookie_secure = getattr(settings, 'COOKIE_SECURE', False)
    cookie_samesite = getattr(settings, 'COOKIE_SAMESITE', 'lax')
    cookie_domain = getattr(settings, 'COOKIE_DOMAIN', None)
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=cookie_secure,  # Set to True in production with HTTPS
        samesite=cookie_samesite,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # seconds
        domain=cookie_domain,
        path="/auth"  # Only send cookie to auth endpoints
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh", response_model=schemas.Token)
def refresh_token(request: Request, response: Response):
    """
    Refresh access token using refresh token from HTTP-only cookie.
    Also rotates the refresh token for enhanced security.
    """
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found"
        )
    
    # Decode and verify refresh token
    try:
        payload = decode_refresh_token(refresh_token)
    except HTTPException:
        # Clear invalid cookie
        response.delete_cookie(key="refresh_token", path="/auth")
        raise
    
    email = payload.get("sub")
    user_id = payload.get("user_id")
    
    if not email or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload"
        )
    
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": email, "user_id": user_id},
        expires_delta=access_token_expires
    )
    
    # Refresh token rotation: create new refresh token
    new_refresh_token = create_refresh_token(
        data={"sub": email, "user_id": user_id}
    )
    
    # Update refresh token cookie
    cookie_secure = getattr(settings, 'COOKIE_SECURE', False)
    cookie_samesite = getattr(settings, 'COOKIE_SAMESITE', 'lax')
    cookie_domain = getattr(settings, 'COOKIE_DOMAIN', None)
    
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=cookie_secure,
        samesite=cookie_samesite,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        domain=cookie_domain,
        path="/auth"
    )
    
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(
    response: Response,
):
    """
    Logout endpoint - clears refresh token cookie.
    Requires valid access token to ensure only authenticated users can logout.
    """
    cookie_domain = getattr(settings, 'COOKIE_DOMAIN', None)
    
    response.delete_cookie(
        key="refresh_token",
        path="/auth",
        domain=cookie_domain
    )
    
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

@router.get("/validate/email/{email}", response_model=schemas.EmailValidationResponse)
def validate_email(email: str, db: Session = Depends(get_db)):
    """
    Check if an email is already registered.
    Returns available: true if email is available, false if already taken.
    """
    db_user = db.query(models.User).filter(models.User.email == email).first()
    return {
        "email": email,
        "available": db_user is None,
        "message": "Email is available" if db_user is None else "Email already registered"
    }

@router.get("/validate/username/{username}", response_model=schemas.UsernameValidationResponse)
def validate_username(username: str, db: Session = Depends(get_db)):
    """
    Check if a username is already taken.
    Returns available: true if username is available, false if already taken.
    """
    db_user = db.query(models.User).filter(models.User.username == username).first()
    return {
        "username": username,
        "available": db_user is None,
        "message": "Username is available" if db_user is None else "Username already taken"
    }