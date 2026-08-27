from fastapi import APIRouter
from app.schemas.user import UserCreate, UserResponse
from app.services import auth_service
from app.services.fake_db import db
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse)
async def create_user(user_in: UserCreate):
    return auth_service.register_user(user_in)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    user = db.get_user(user_id)
    if not user:
        raise NotFoundError(f"User {user_id} not found")
    return user
