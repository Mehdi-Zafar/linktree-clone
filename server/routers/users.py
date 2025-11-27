from fastapi import APIRouter, Depends, HTTPException, status,UploadFile,File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_active_user
from supabase import create_client, Client
from config import get_settings
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])
settings = get_settings()

# Initialize Supabase client with service role key
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY  # Service role key
)

@router.get("/", response_model=List[schemas.UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.UserWithProfile)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/username/{username}", response_model=schemas.PublicUserProfile)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    """Public endpoint to view user's linktree page"""
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if profile is public
    if user.profile and not user.profile.is_public:
        raise HTTPException(status_code=403, detail="This profile is private")
    
    # Get only active links, sorted by position
    active_links = [link for link in user.links if link.is_active]
    active_links.sort(key=lambda x: x.position)
    
    return {
        "username": user.username,
        "full_name": user.full_name,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "profile": user.profile,
        "links": active_links
    }

@router.put("/me", response_model=schemas.UserResponse)
def update_current_user(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Check if email is being changed and if it's already taken
    if user_update.email and user_update.email != current_user.email:
        existing = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username is being changed and if it's already taken
    if user_update.username and user_update.username != current_user.username:
        existing = db.query(models.User).filter(models.User.username == user_update.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
    
    # Update fields
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_user(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db.delete(current_user)
    db.commit()
    return None

@router.post("/me/avatar/upload", response_model=schemas.UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Upload avatar to Supabase Storage and update user's avatar_url
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp","image/avif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, WebP and Avif images are allowed"
        )
    
    # Validate file size (5MB)
    file_size = 0
    max_size = 5 * 1024 * 1024  # 5MB
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must be less than 5MB"
        )
    
    try:
        # Delete old avatar if exists
        if current_user.avatar_url:
            try:
                # Extract path from URL
                old_path = current_user.avatar_url.split('/linktree-files/')[-1]
                supabase.storage.from_('linktree-files').remove([old_path])
            except Exception as e:
                print(f"Error deleting old avatar: {e}")
        
        # Generate unique filename
        file_ext = file.filename.split('.')[-1]
        filename = f"{current_user.id}/{int(datetime.now().timestamp())}.{file_ext}"
        
        # Upload to Supabase Storage
        response = supabase.storage.from_('linktree-files').upload(
            filename,
            contents,
            {"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_('linktree-files').get_public_url(filename)
        
        # Update user in database
        current_user.avatar_url = public_url
        db.commit()
        db.refresh(current_user)
        
        return current_user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload avatar: {str(e)}"
        )

@router.delete("/me/avatar", response_model=schemas.UserResponse)
def remove_avatar(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Remove user's avatar"""
    if current_user.avatar_url:
        try:
            # Extract path and delete from storage
            path = current_user.avatar_url.split('/linktree-files/')[-1]
            supabase.storage.from_('linktree-files').remove([path])
        except Exception as e:
            print(f"Error deleting avatar: {e}")
    
    current_user.avatar_url = None
    db.commit()
    db.refresh(current_user)
    
    return current_user