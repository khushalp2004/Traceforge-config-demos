from app.services.fake_db import db
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate
from app.core.exceptions import AuthError, ValidationError

def register_user(user_in: UserCreate) -> User:
    if db.get_user_by_email(user_in.email):
        raise ValidationError("Email already registered")
    if db.get_user_by_username(user_in.username):
        raise ValidationError("Username already registered")
        
    hashed_password = get_password_hash(user_in.password)
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password,
        is_active=True
    )
    return db.add_user(user)

def authenticate_user(username: str, password: str) -> User:
    user = db.get_user_by_username(username)
    if not user:
        raise AuthError("Incorrect username or password")
    if not verify_password(password, user.hashed_password):
        raise AuthError("Incorrect username or password")
    return user
