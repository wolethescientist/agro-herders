"""Mock biometric verification service"""
import hashlib
from typing import Optional, Tuple

class BiometricVerificationService:
    """Simulates biometric verification without real biometric processing"""
    
    @staticmethod
    def verify_face(input_vector: str, stored_vector: str) -> Tuple[bool, float]:
        """
        Mock face verification using simple string comparison
        In production, this would use actual facial recognition ML models
        
        Returns: (match: bool, confidence: float)
        """
        # Simple mock: check if vectors are similar (first 10 chars match)
        if len(input_vector) >= 10 and len(stored_vector) >= 10:
            match = input_vector[:10] == stored_vector[:10]
            confidence = 0.95 if match else 0.32
            return match, confidence
        return False, 0.0
    
    @staticmethod
    def verify_fingerprint(input_hash: str, stored_hash: str) -> Tuple[bool, float]:
        """
        Mock fingerprint verification using hash comparison
        In production, this would use minutiae matching algorithms
        
        Returns: (match: bool, confidence: float)
        """
        match = input_hash == stored_hash
        confidence = 0.98 if match else 0.15
        return match, confidence
    
    @staticmethod
    def calculate_risk_level(face_match: bool, fingerprint_match: bool, 
                            rfid_match: bool) -> str:
        """
        Calculate overall risk level based on verification results
        
        Returns: 'low', 'medium', or 'high'
        """
        matches = sum([face_match, fingerprint_match, rfid_match])
        
        if matches == 3:
            return "low"
        elif matches == 2:
            return "medium"
        else:
            return "high"
    
    @staticmethod
    def generate_mock_face_vector(seed: str) -> str:
        """Generate a mock face vector for testing"""
        return hashlib.sha256(f"face_{seed}".encode()).hexdigest()
    
    @staticmethod
    def generate_mock_fingerprint(seed: str) -> str:
        """Generate a mock fingerprint hash for testing"""
        return hashlib.sha256(f"finger_{seed}".encode()).hexdigest()
