from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime,Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class LinkType(str, enum.Enum):
    BUTTON = "button"
    LINK = "link"

class SocialPlatform(str, enum.Enum):
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

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    bio = Column(Text)
    avatar_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_password_reset_sent_at = Column(DateTime(timezone=True), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    links = relationship("Link", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    page_title = Column(String(100))
    theme = Column(String(50), default="light")
    background_color = Column(String(7), default="#FFFFFF")  # Hex color
    text_color = Column(String(7), default="#000000")
    button_style = Column(String(50), default="rounded")
    meta_description = Column(String(255))
    custom_domain = Column(String(255), unique=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="profile")


class Link(Base):
    __tablename__ = "links"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Link type: button or link
    link_type = Column(Enum(LinkType), default=LinkType.LINK, nullable=False)
    
    # For social links: platform identifier
    social_platform = Column(Enum(SocialPlatform), nullable=True)
    
    title = Column(String(200), nullable=False)
    url = Column(String(2000), nullable=False)
    description = Column(Text)
    
    # For custom links: uploaded thumbnail
    thumbnail_url = Column(String(500))
    
    # Display settings
    position = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="links")

class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    token = Column(String(255), unique=True, nullable=False, index=True)

    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User")

class EmailPasswordResetToken(Base):
    __tablename__ = "email_password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)

    user = relationship("User")