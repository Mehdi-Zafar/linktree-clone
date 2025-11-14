from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import get_settings

settings = get_settings()

# Create engine with proper connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,        # Verify connections before using
    pool_size=5,                # Number of connections to keep
    max_overflow=10,            # Extra connections when needed
    pool_recycle=3600,          # Recycle connections after 1 hour
    echo=False,                 # Set to True for SQL debugging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()