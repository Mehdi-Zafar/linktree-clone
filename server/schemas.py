from enum import Enum
from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Optional, List
from datetime import datetime

# ============ AUTH SCHEMAS ============
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None  # Add this for consistency with token payload

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmailValidationResponse(BaseModel):
    email: str
    available: bool
    message: str

class UsernameValidationResponse(BaseModel):
    username: str
    available: bool
    message: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ForgotPasswordResponse(BaseModel):
    message: str

# Request to actually reset
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ResetPasswordResponse(BaseModel):
    message: str

# ============ USER SCHEMAS ============
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: str = Field(None, max_length=100)
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class UserWithProfile(UserResponse):
    profile: Optional['ProfileResponse'] = None
    
    class Config:
        from_attributes = True

# ============ PROFILE SCHEMAS ============
class ProfileBase(BaseModel):
    page_title: Optional[str] = Field(None, max_length=100)
    theme: Optional[str] = Field(default="light", max_length=50)
    background_color: Optional[str] = Field(default="#FFFFFF", pattern="^#[0-9A-Fa-f]{6}$")
    text_color: Optional[str] = Field(default="#000000", pattern="^#[0-9A-Fa-f]{6}$")
    button_style: Optional[str] = Field(default="rounded", max_length=50)
    meta_description: Optional[str] = Field(None, max_length=255)
    custom_domain: Optional[str] = Field(None, max_length=255)
    is_public: Optional[bool] = True

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# ============ LINK SCHEMAS ============
class LinkType(str, Enum):
    BUTTON = "button"
    LINK = "link"

class SocialPlatform(str, Enum):
    INSTAGRAM = "instagram"
    TWITTER = "twitter"
    FACEBOOK = "facebook"
    LINKEDIN = "linkedin"
    YOUTUBE = "youtube"
    TIKTOK = "tiktok"
    GITHUB = "github"
    DISCORD = "discord"
    TWITCH = "twitch"
    SPOTIFY = "spotify"
    PINTEREST = "pinterest"
    SNAPCHAT = "snapchat"
    REDDIT = "reddit"
    TELEGRAM = "telegram"
    WHATSAPP = "whatsapp"
    OTHER = "other"


class LinkBase(BaseModel):
    link_type: LinkType = LinkType.LINK
    social_platform: Optional[SocialPlatform] = None
    title: str = Field(..., max_length=200)
    url: str = Field(..., max_length=2000)
    description: Optional[str] = None
    thumbnail_url: Optional[str] = Field(None, max_length=500)
    position: Optional[int] = 0
    is_active: Optional[bool] = True

class LinkCreate(LinkBase):
    pass

class LinkUpdate(BaseModel):
    link_type: Optional[LinkType] = None
    social_platform: Optional[SocialPlatform] = None
    title: Optional[str] = Field(None, max_length=200)
    url: Optional[str] = Field(None, max_length=2000)
    description: Optional[str] = None
    thumbnail_url: Optional[str] = Field(None, max_length=500)
    position: Optional[int] = None
    is_active: Optional[bool] = None

class LinkResponse(LinkBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class LinkReorder(BaseModel):
    link_id: int
    new_position: int

# ============ PUBLIC PROFILE SCHEMAS ============
class PublicUserProfile(BaseModel):
    username: str
    full_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    profile: Optional[ProfileResponse]
    links: List[LinkResponse]
    
    class Config:
        from_attributes = True