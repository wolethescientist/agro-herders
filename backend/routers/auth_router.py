"""Authentication endpoints"""
from fastapi import APIRouter, HTTPException, status
from models import LoginRequest, TokenResponse
from auth import verify_password, create_access_token
from database import execute_one

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """
    Authenticate security officer and return JWT token
    """
    # Query user from database
    query = "SELECT * FROM users WHERE email = %s"
    user = execute_one(query, (credentials.email,))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user["id"]), "email": user["email"], "role": user["role"]}
    )
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": str(user["id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    )
