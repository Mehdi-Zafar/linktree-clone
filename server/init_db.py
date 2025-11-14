# init_db.py
"""
Run this script ONCE to create all database tables.
Usage: python init_db.py
"""
from database import engine, Base
import models  # This imports all your models

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

if __name__ == "__main__":
    init_db()