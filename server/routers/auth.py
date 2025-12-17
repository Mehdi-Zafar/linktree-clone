from datetime import datetime,timedelta, timezone
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
import secrets
from fastapi import BackgroundTasks
from fastapi_mail import MessageSchema, FastMail

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()
RATE_LIMIT_MINUTES = 5

async def send_verification_email(email: str, token: str):
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    message = MessageSchema(
        subject="Verify your email",
        recipients=[email],
        body=f"""
        Welcome 👋

        Please verify your email by clicking the link below:

        {verify_url}

        This link expires in 24 hours.
        """,
        subtype="plain",
    )

    fm = FastMail(settings.MAIL_CONFIG)
    await fm.send_message(message)


@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user: schemas.UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check if email exists
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if username exists
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create user (NOT verified)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=get_password_hash(user.password),
        full_name=user.full_name,
        bio=user.bio,
        is_verified=False
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create default profile
    db.add(models.Profile(user_id=db_user.id))
    db.commit()

    # Create verification token
    token = secrets.token_urlsafe(32)

    verification = models.EmailVerificationToken(
        user_id=db_user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=24),
        used=False
    )

    db.add(verification)
    db.commit()

    # Send email in background
    background_tasks.add_task(
        send_verification_email,
        db_user.email,
        token
    )

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

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    verification = (
        db.query(models.EmailVerificationToken)
        .filter(
            models.EmailVerificationToken.token == token,
            models.EmailVerificationToken.used == False,
            models.EmailVerificationToken.expires_at > datetime.utcnow()
        )
        .first()
    )

    if not verification:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(models.User).filter(models.User.id == verification.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_verified = True
    user.verified_at = datetime.utcnow()
    verification.used = True

    db.commit()

    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
def resend_verification_email(
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.is_verified:
        raise HTTPException(status_code=400, detail="Email already verified")

    # Invalidate previous tokens
    db.query(models.EmailVerificationToken).filter(
        models.EmailVerificationToken.user_id == current_user.id,
        models.EmailVerificationToken.used == False
    ).update({"used": True})

    token = secrets.token_urlsafe(32)

    verification = models.EmailVerificationToken(
        user_id=current_user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=24),
        used=False
    )

    db.add(verification)
    db.commit()

    background_tasks.add_task(
        send_verification_email,
        current_user.email,
        token
    )

    return {"message": "Verification email sent"}

async def send_forgot_password_email(email: str, token: str):
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    message = MessageSchema(
        subject="Reset Your Password",
        recipients=[email],
        body=f"""
        You requested a password reset.

        Click the link below to reset your password:

        {reset_link}

        If you did not request this, just ignore this email.
        """,
        subtype="plain"
    )

    fm = FastMail(settings.MAIL_CONFIG)
    await fm.send_message(message)


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED,response_model=schemas.ForgotPasswordResponse)
async def forgot_password(
    request: schemas.ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == request.email).first()

    # Always return this generic message
    response = {
        "message": "If that email exists, you’ll receive a password reset link"
    }

    if not user:
        return response

    now = datetime.now(timezone.utc)

    # 1) Find existing unused & not expired reset token
    existing_token_record = (
        db.query(models.EmailPasswordResetToken)
          .filter(
              models.EmailPasswordResetToken.user_id == user.id,
              models.EmailPasswordResetToken.used == False,
              models.EmailPasswordResetToken.expires_at > now
          )
          .order_by(models.EmailPasswordResetToken.expires_at.desc())
          .first()
    )

    # If there is a valid token
    if existing_token_record:
        # Check last email sent time
        last_sent = user.last_password_reset_sent_at
        if last_sent:
            wait_until = last_sent + timedelta(minutes=RATE_LIMIT_MINUTES)
            # If it’s too soon, do nothing
            if now < wait_until:
                return response

        # If rate limit passed, *resend* the *same* token
        user.last_password_reset_sent_at = now
        db.commit()
        background_tasks.add_task(
            send_forgot_password_email,
            user.email,
            existing_token_record.token
        )
        return response

    # If no valid token exists, issue a new one
    # Invalidate *any* old unused tokens for this user
    db.query(models.EmailPasswordResetToken).filter(
        models.EmailPasswordResetToken.user_id == user.id,
        models.EmailPasswordResetToken.used == False
    ).update({"used": True})

    token = secrets.token_urlsafe(32)
    reset_token = models.EmailPasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=now + timedelta(hours=1),
        used=False
    )

    db.add(reset_token)

    # Update last send time
    user.last_password_reset_sent_at = now

    db.commit()

    # Send the reset email
    background_tasks.add_task(send_forgot_password_email, user.email, token)

    return response

@router.post("/reset-password", response_model=schemas.ResetPasswordResponse)
def reset_password(
    request: schemas.ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    reset_token = db.query(models.EmailPasswordResetToken).filter(
        models.EmailPasswordResetToken.token == request.token,
        models.EmailPasswordResetToken.expires_at > datetime.utcnow(),
        models.EmailPasswordResetToken.used == False
    ).first()

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    user = db.query(models.User).filter(models.User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Update password
    user.hashed_password = get_password_hash(request.new_password)

    # Invalidate token
    reset_token.used = True

    db.commit()

    return {"message": "Password reset successful"}
