from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User, Profile, Link
from sqlalchemy.exc import IntegrityError
from auth import get_password_hash


def seed_data():
    print("🌱 Starting database seeding...")

    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).first():
            print("✅ Database already seeded. Skipping...")
            db.close()
            return

        # ---- USERS ----
        user1 = User(
            email="john@sharklasers.com",
            username="john_doe",
            hashed_password=get_password_hash("Password@123"),
            full_name="John Doe",
            bio="Tech enthusiast and content creator.",
            avatar_url="",
            is_active=True,
            is_verified=True,
        )

        user2 = User(
            email="jane@sharklasers.com",
            username="jane_smith",
            hashed_password=get_password_hash("Password@123"),
            full_name="Jane Smith",
            bio="Digital marketer with a love for design.",
            avatar_url="",
            is_active=True,
            is_verified=False,
        )

        db.add_all([user1, user2])
        db.commit()

        # Refresh to get IDs
        db.refresh(user1)
        db.refresh(user2)

        # ---- PROFILES ----
        profile1 = Profile(
            user_id=user1.id,
            page_title="John's Links",
            theme="dark",
            background_color="#0F172A",
            text_color="#FFFFFF",
            button_style="rounded",
            meta_description="Welcome to my digital profile!",
            custom_domain="johnlinks.me",
            is_public=True,
        )

        profile2 = Profile(
            user_id=user2.id,
            page_title="Jane's World",
            theme="light",
            background_color="#FFFFFF",
            text_color="#000000",
            button_style="pill",
            meta_description="Check out my favorite resources!",
            custom_domain=None,
            is_public=True,
        )

        db.add_all([profile1, profile2])
        db.commit()

        # ---- LINKS ----
        links = [
            Link(
                user_id=user1.id,
                title="My Portfolio",
                url="https://johnportfolio.com",
                description="My personal web development projects",
                icon="globe",
                position=1,
            ),
            Link(
                user_id=user1.id,
                title="GitHub",
                url="https://github.com/johndoe",
                icon="github",
                position=2,
            ),
            Link(
                user_id=user2.id,
                title="LinkedIn",
                url="https://linkedin.com/in/janesmith",
                icon="linkedin",
                position=1,
            ),
        ]

        db.add_all(links)
        db.commit()

        print("✅ Database seeded successfully!")

    except IntegrityError as e:
        db.rollback()
        print("❌ Integrity error:", e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
