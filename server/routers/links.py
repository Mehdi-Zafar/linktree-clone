from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter(prefix="/links", tags=["Links"])

@router.get("/", response_model=List[schemas.LinkResponse])
def get_my_links(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    links = db.query(models.Link).filter(
        models.Link.user_id == current_user.id
    ).order_by(models.Link.position).all()
    return links

@router.get("/{link_id}", response_model=schemas.LinkResponse)
def get_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    link = db.query(models.Link).filter(
        models.Link.id == link_id,
        models.Link.user_id == current_user.id
    ).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    return link

@router.post("/", response_model=schemas.LinkResponse, status_code=status.HTTP_201_CREATED)
def create_link(
    link: schemas.LinkCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not verified"
        )
    
    db_link = models.Link(
        user_id=current_user.id,
        **link.model_dump()
    )
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.put("/{link_id}", response_model=schemas.LinkResponse)
def update_link(
    link_id: int,
    link_update: schemas.LinkUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    link = db.query(models.Link).filter(
        models.Link.id == link_id,
        models.Link.user_id == current_user.id
    ).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    # Update fields
    for field, value in link_update.model_dump(exclude_unset=True).items():
        setattr(link, field, value)
    
    db.commit()
    db.refresh(link)
    return link

@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    link = db.query(models.Link).filter(
        models.Link.id == link_id,
        models.Link.user_id == current_user.id
    ).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    db.delete(link)
    db.commit()
    return None

@router.post("/reorder", response_model=List[schemas.LinkResponse])
def reorder_links(
    reorder_data: List[schemas.LinkReorder],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Reorder multiple links at once"""
    for item in reorder_data:
        link = db.query(models.Link).filter(
            models.Link.id == item.link_id,
            models.Link.user_id == current_user.id
        ).first()
        if link:
            link.position = item.new_position
    
    db.commit()
    
    # Return updated list
    links = db.query(models.Link).filter(
        models.Link.user_id == current_user.id
    ).order_by(models.Link.position).all()
    return links

@router.post("/{link_id}/click", response_model=schemas.LinkResponse)
def increment_click_count(
    link_id: int,
    db: Session = Depends(get_db)
):
    """Public endpoint to track clicks - no authentication required"""
    link = db.query(models.Link).filter(models.Link.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    link.click_count += 1
    db.commit()
    db.refresh(link)
    return link

@router.get("/user/{username}", response_model=List[schemas.LinkResponse])
def get_user_links(
    username: str,
    db: Session = Depends(get_db)
):
    """Public endpoint to get user's active links"""
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get only active links
    links = db.query(models.Link).filter(
        models.Link.user_id == user.id,
        models.Link.is_active == True
    ).order_by(models.Link.position).all()
    
    return links