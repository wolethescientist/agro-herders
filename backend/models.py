"""Pydantic models for request/response validation"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Herder Models
class HerderCreate(BaseModel):
    full_name: str
    age: int
    state_of_origin: str
    phone_number: Optional[str] = None
    national_id: Optional[str] = None
    photo_url: Optional[str] = None
    fingerprint_hash: str
    face_vector: str

class HerderResponse(BaseModel):
    id: int
    full_name: str
    age: int
    state_of_origin: str
    phone_number: Optional[str]
    national_id: Optional[str]
    photo_url: Optional[str]
    status: str
    created_at: datetime

# Livestock Models
class LivestockCreate(BaseModel):
    herder_id: int
    rfid_code: str
    animal_type: str = "cattle"
    breed: Optional[str] = None
    age_years: Optional[int] = None

class LivestockResponse(BaseModel):
    id: int
    herder_id: int
    rfid_code: str
    animal_type: str
    breed: Optional[str]
    age_years: Optional[int]
    health_status: str

# Verification Models
class FaceVerifyRequest(BaseModel):
    face_vector: str  # Mock base64 or vector string

class FingerprintVerifyRequest(BaseModel):
    fingerprint_hash: str

class RFIDVerifyRequest(BaseModel):
    rfid_code: str

class FullVerificationRequest(BaseModel):
    face_vector: str
    fingerprint_hash: str
    rfid_code: str
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class VerificationResponse(BaseModel):
    status: str  # 'verified', 'failed', 'suspicious'
    risk_level: str  # 'low', 'medium', 'high'
    herder: Optional[dict] = None
    livestock: Optional[List[dict]] = None
    message: str

# Route Models
class RouteResponse(BaseModel):
    id: int
    route_name: str
    state: str
    geojson_data: dict
    status: str

class LocationCheckRequest(BaseModel):
    latitude: float
    longitude: float
    route_id: Optional[int] = None

# Dashboard Models
class DashboardStats(BaseModel):
    total_herders: int
    total_livestock: int
    recent_verifications: List[dict]
    active_routes: int
