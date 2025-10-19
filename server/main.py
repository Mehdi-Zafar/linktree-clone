from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router,users_router,profiles_router,links_router
from database import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Linktree Clone API",
    description="A Linktree clone with authentication and link management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(profiles_router)
app.include_router(links_router)

@app.get("/")
def read_root():
    return {
        "message": "Linktree Clone API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}