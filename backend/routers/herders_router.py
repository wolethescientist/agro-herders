"""Herder management endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import HerderCreate, HerderResponse, LivestockCreate, LivestockResponse
from auth import get_current_user
from database import execute_query, execute_one

router = APIRouter(prefix="/herders", tags=["Herders"])

@router.post("/register", response_model=dict)
async def register_herder(
    herder: HerderCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Register a new herder with biometric data and optional livestock
    """
    try:
        # Insert herder
        herder_query = """
            INSERT INTO herders (full_name, age, state_of_origin, phone_number, national_id, photo_url, status)
            VALUES (%s, %s, %s, %s, %s, %s, 'active')
            RETURNING *
        """
        herder_result = execute_one(
            herder_query,
            (herder.full_name, herder.age, herder.state_of_origin, 
             herder.phone_number, herder.national_id, herder.photo_url)
        )
        
        if not herder_result:
            raise HTTPException(status_code=500, detail="Failed to create herder")
        
        herder_id = herder_result["id"]
        
        # Insert biometric data
        bio_query = """
            INSERT INTO biometrics (herder_id, face_vector, fingerprint_hash)
            VALUES (%s, %s, %s)
        """
        execute_query(bio_query, (herder_id, herder.face_vector, herder.fingerprint_hash), fetch=False)
        
        return {
            "message": "Herder registered successfully",
            "herder_id": herder_id,
            "herder": dict(herder_result)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/", response_model=List[HerderResponse])
async def get_herders(current_user: dict = Depends(get_current_user)):
    """Get all registered herders"""
    query = "SELECT * FROM herders ORDER BY created_at DESC"
    result = execute_query(query)
    return [dict(row) for row in result]

@router.get("/{herder_id}", response_model=dict)
async def get_herder(herder_id: int, current_user: dict = Depends(get_current_user)):
    """Get herder details with biometrics and livestock"""
    
    # Get herder
    herder_query = "SELECT * FROM herders WHERE id = %s"
    herder = execute_one(herder_query, (herder_id,))
    
    if not herder:
        raise HTTPException(status_code=404, detail="Herder not found")
    
    # Get livestock
    livestock_query = "SELECT * FROM livestock WHERE herder_id = %s"
    livestock = execute_query(livestock_query, (herder_id,))
    
    return {
        "herder": dict(herder),
        "livestock": [dict(row) for row in livestock]
    }

@router.post("/livestock", response_model=LivestockResponse)
async def add_livestock(
    livestock: LivestockCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add livestock with RFID to a herder"""
    try:
        query = """
            INSERT INTO livestock (herder_id, rfid_code, animal_type, breed, age_years, health_status)
            VALUES (%s, %s, %s, %s, %s, 'healthy')
            RETURNING *
        """
        result = execute_one(
            query,
            (livestock.herder_id, livestock.rfid_code, livestock.animal_type, 
             livestock.breed, livestock.age_years)
        )
        
        return dict(result)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add livestock: {str(e)}"
        )
