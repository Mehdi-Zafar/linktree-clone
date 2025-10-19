from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter(prefix="/profiles", tags=["Profiles"])

@router.get("/me", response_model=schemas.ProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/me", response_model=schemas.ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_my_profile(
    profile: schemas.ProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Check if profile already exists
    existing = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    # Check if custom domain is already taken
    if profile.custom_domain:
        existing = db.query(models.Profile).filter(
            models.Profile.custom_domain == profile.custom_domain
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Custom domain already taken")
    
    db_profile = models.Profile(
        user_id=current_user.id,
        **profile.model_dump()
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.put("/me", response_model=schemas.ProfileResponse)
def update_my_profile(
    profile_update: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Check if custom domain is being changed and if it's already taken
    if profile_update.custom_domain and profile_update.custom_domain != profile.custom_domain:
        existing = db.query(models.Profile).filter(
            models.Profile.custom_domain == profile_update.custom_domain
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Custom domain already taken")
    
    # Update fields
    for field, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db.delete(profile)
    db.commit()
    return None

@router.get("/{user_id}", response_model=schemas.ProfileResponse)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile