"""Identity verification endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from models import (
    FaceVerifyRequest, FingerprintVerifyRequest, RFIDVerifyRequest,
    FullVerificationRequest, VerificationResponse
)
from auth import get_current_user
from database import execute_query, execute_one
from services.verification_service import BiometricVerificationService

router = APIRouter(prefix="/verify", tags=["Verification"])
bio_service = BiometricVerificationService()

@router.post("/face", response_model=dict)
async def verify_face(
    request: FaceVerifyRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Verify herder identity using face recognition (mocked)
    """
    # Get all biometric records with herder info
    query = """
        SELECT b.*, h.id as herder_id, h.full_name, h.age, h.state_of_origin, 
               h.phone_number, h.national_id, h.photo_url, h.status, h.created_at
        FROM biometrics b
        JOIN herders h ON b.herder_id = h.id
    """
    biometrics = execute_query(query)
    
    for bio in biometrics:
        match, confidence = bio_service.verify_face(
            request.face_vector,
            bio["face_vector"]
        )
        
        if match:
            return {
                "match": True,
                "confidence": confidence,
                "herder_id": bio["herder_id"],
                "herder": {
                    "id": bio["herder_id"],
                    "full_name": bio["full_name"],
                    "age": bio["age"],
                    "state_of_origin": bio["state_of_origin"],
                    "phone_number": bio["phone_number"],
                    "national_id": bio["national_id"],
                    "photo_url": bio["photo_url"],
                    "status": bio["status"]
                }
            }
    
    return {
        "match": False,
        "confidence": 0.0,
        "herder_id": None,
        "herder": None
    }

@router.post("/fingerprint", response_model=dict)
async def verify_fingerprint(
    request: FingerprintVerifyRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Verify herder identity using fingerprint (mocked)
    """
    # Get all biometric records with herder info
    query = """
        SELECT b.*, h.id as herder_id, h.full_name, h.age, h.state_of_origin, 
               h.phone_number, h.national_id, h.photo_url, h.status, h.created_at
        FROM biometrics b
        JOIN herders h ON b.herder_id = h.id
    """
    biometrics = execute_query(query)
    
    for bio in biometrics:
        match, confidence = bio_service.verify_fingerprint(
            request.fingerprint_hash,
            bio["fingerprint_hash"]
        )
        
        if match:
            return {
                "match": True,
                "confidence": confidence,
                "herder_id": bio["herder_id"],
                "herder": {
                    "id": bio["herder_id"],
                    "full_name": bio["full_name"],
                    "age": bio["age"],
                    "state_of_origin": bio["state_of_origin"],
                    "phone_number": bio["phone_number"],
                    "national_id": bio["national_id"],
                    "photo_url": bio["photo_url"],
                    "status": bio["status"]
                }
            }
    
    return {
        "match": False,
        "confidence": 0.0,
        "herder_id": None,
        "herder": None
    }

@router.post("/rfid", response_model=dict)
async def verify_rfid(
    request: RFIDVerifyRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Verify livestock and associated herder using RFID code
    """
    # Query livestock by RFID with herder info
    query = """
        SELECT l.*, h.id as herder_id, h.full_name, h.age, h.state_of_origin,
               h.phone_number, h.national_id, h.photo_url, h.status
        FROM livestock l
        JOIN herders h ON l.herder_id = h.id
        WHERE l.rfid_code = %s
    """
    result = execute_one(query, (request.rfid_code,))
    
    if not result:
        return {
            "match": False,
            "livestock": None,
            "herder": None
        }
    
    return {
        "match": True,
        "livestock": {
            "id": result["id"],
            "rfid_code": result["rfid_code"],
            "animal_type": result["animal_type"],
            "breed": result["breed"]
        },
        "herder": {
            "id": result["herder_id"],
            "full_name": result["full_name"],
            "age": result["age"],
            "state_of_origin": result["state_of_origin"],
            "phone_number": result["phone_number"],
            "national_id": result["national_id"],
            "photo_url": result["photo_url"],
            "status": result["status"]
        }
    }

@router.post("/full", response_model=VerificationResponse)
async def full_verification(
    request: FullVerificationRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Perform complete verification: face + fingerprint + RFID
    Returns comprehensive verification result with risk assessment
    """
    face_match = False
    fingerprint_match = False
    rfid_match = False
    herder_data = None
    livestock_data = []
    herder_id = None
    
    # 1. Face verification
    query = """
        SELECT b.*, h.id as herder_id, h.full_name, h.age, h.state_of_origin, 
               h.phone_number, h.national_id, h.photo_url, h.status
        FROM biometrics b
        JOIN herders h ON b.herder_id = h.id
    """
    biometrics = execute_query(query)
    
    for bio in biometrics:
        match, _ = bio_service.verify_face(request.face_vector, bio["face_vector"])
        if match:
            face_match = True
            herder_id = bio["herder_id"]
            herder_data = {
                "id": bio["herder_id"],
                "full_name": bio["full_name"],
                "age": bio["age"],
                "state_of_origin": bio["state_of_origin"],
                "phone_number": bio["phone_number"],
                "national_id": bio["national_id"],
                "photo_url": bio["photo_url"],
                "status": bio["status"]
            }
            break
    
    # 2. Fingerprint verification
    if herder_data:
        for bio in biometrics:
            if bio["herder_id"] == herder_id:
                match, _ = bio_service.verify_fingerprint(
                    request.fingerprint_hash,
                    bio["fingerprint_hash"]
                )
                fingerprint_match = match
                break
    
    # 3. RFID verification
    rfid_query = "SELECT * FROM livestock WHERE rfid_code = %s"
    rfid_result = execute_one(rfid_query, (request.rfid_code,))
    
    if rfid_result:
        livestock_data = [dict(rfid_result)]
        if herder_data and rfid_result["herder_id"] == herder_id:
            rfid_match = True
    
    # Calculate risk level
    risk_level = bio_service.calculate_risk_level(face_match, fingerprint_match, rfid_match)
    
    # Determine status
    if face_match and fingerprint_match and rfid_match:
        status = "verified"
        message = "All verification checks passed"
    elif face_match or fingerprint_match:
        status = "suspicious"
        message = "Partial verification - some checks failed"
    else:
        status = "failed"
        message = "Verification failed - identity could not be confirmed"
    
    # Log verification
    if herder_data:
        log_query = """
            INSERT INTO verifications 
            (herder_id, officer_id, verification_type, result, risk_level, location_lat, location_lng)
            VALUES (%s, %s, 'full', %s, %s, %s, %s)
        """
        execute_query(
            log_query,
            (herder_id, current_user["id"], status, risk_level, 
             request.location_lat, request.location_lng),
            fetch=False
        )
    
    return VerificationResponse(
        status=status,
        risk_level=risk_level,
        herder=herder_data,
        livestock=livestock_data,
        message=message
    )
