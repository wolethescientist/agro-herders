"""
Test script for Connexxion Agro-Herders Identity, Verification and Security API
Run this after starting the backend to verify all endpoints work
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_health():
    """Test health check endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print_response("Health Check", response)
    return response.status_code == 200

def test_login():
    """Test login and return token"""
    data = {
        "email": "officer@connexxion.gov",
        "password": "SecurePass123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print_response("Login", response)
    
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def test_register_herder(token):
    """Test herder registration"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "full_name": "Test Herder",
        "age": 40,
        "state_of_origin": "Plateau",
        "phone_number": "+2348012345678",
        "national_id": "NIN_TEST_001",
        "photo_url": "https://example.com/photo.jpg",
        "face_vector": "FACE_TEST_HERDER_12345",
        "fingerprint_hash": "FINGER_TEST_HERDER_12345"
    }
    response = requests.post(f"{BASE_URL}/herders/register", json=data, headers=headers)
    print_response("Register Herder", response)
    
    if response.status_code == 200:
        return response.json()["herder_id"]
    return None

def test_add_livestock(token, herder_id):
    """Test adding livestock"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "herder_id": herder_id,
        "rfid_code": f"RFID_TEST_{herder_id}_001",
        "animal_type": "cattle",
        "breed": "Fulani White",
        "age_years": 3
    }
    response = requests.post(f"{BASE_URL}/herders/livestock", json=data, headers=headers)
    print_response("Add Livestock", response)
    return response.status_code == 200

def test_get_herders(token):
    """Test getting all herders"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/herders/", headers=headers)
    print_response("Get All Herders", response)
    return response.status_code == 200

def test_verify_face(token):
    """Test face verification"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "face_vector": "FACE_TEST_HERDER_12345"
    }
    response = requests.post(f"{BASE_URL}/verify/face", json=data, headers=headers)
    print_response("Verify Face", response)
    return response.status_code == 200

def test_verify_fingerprint(token):
    """Test fingerprint verification"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "fingerprint_hash": "FINGER_TEST_HERDER_12345"
    }
    response = requests.post(f"{BASE_URL}/verify/fingerprint", json=data, headers=headers)
    print_response("Verify Fingerprint", response)
    return response.status_code == 200

def test_verify_rfid(token, herder_id):
    """Test RFID verification"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "rfid_code": f"RFID_TEST_{herder_id}_001"
    }
    response = requests.post(f"{BASE_URL}/verify/rfid", json=data, headers=headers)
    print_response("Verify RFID", response)
    return response.status_code == 200

def test_full_verification(token, herder_id):
    """Test full verification"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "face_vector": "FACE_TEST_HERDER_12345",
        "fingerprint_hash": "FINGER_TEST_HERDER_12345",
        "rfid_code": f"RFID_TEST_{herder_id}_001",
        "location_lat": 9.3,
        "location_lng": 9.0
    }
    response = requests.post(f"{BASE_URL}/verify/full", json=data, headers=headers)
    print_response("Full Verification", response)
    return response.status_code == 200

def test_get_routes(token):
    """Test getting routes"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/routes/", headers=headers)
    print_response("Get Routes", response)
    return response.status_code == 200

def test_check_location(token):
    """Test location authorization check"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test authorized location (within Kaduna North Corridor)
    data = {
        "latitude": 10.6,
        "longitude": 7.5
    }
    response = requests.post(f"{BASE_URL}/routes/check-location", json=data, headers=headers)
    print_response("Check Location (Authorized)", response)
    
    # Test unauthorized location
    data = {
        "latitude": 6.5,
        "longitude": 3.3
    }
    response = requests.post(f"{BASE_URL}/routes/check-location", json=data, headers=headers)
    print_response("Check Location (Unauthorized)", response)
    
    return response.status_code == 200

def test_dashboard_stats(token):
    """Test dashboard statistics"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    print_response("Dashboard Stats", response)
    return response.status_code == 200

def run_all_tests():
    """Run all API tests"""
    print("\n" + "="*60)
    print("Connexxion Agro-Herders API Test Suite")
    print("="*60)
    
    results = {}
    
    # Test 1: Health Check
    results["Health Check"] = test_health()
    
    # Test 2: Login
    token = test_login()
    results["Login"] = token is not None
    
    if not token:
        print("\n❌ Login failed. Cannot continue with other tests.")
        return
    
    # Test 3: Register Herder
    herder_id = test_register_herder(token)
    results["Register Herder"] = herder_id is not None
    
    if herder_id:
        # Test 4: Add Livestock
        results["Add Livestock"] = test_add_livestock(token, herder_id)
        
        # Test 5: Get Herders
        results["Get Herders"] = test_get_herders(token)
        
        # Test 6: Verify Face
        results["Verify Face"] = test_verify_face(token)
        
        # Test 7: Verify Fingerprint
        results["Verify Fingerprint"] = test_verify_fingerprint(token)
        
        # Test 8: Verify RFID
        results["Verify RFID"] = test_verify_rfid(token, herder_id)
        
        # Test 9: Full Verification
        results["Full Verification"] = test_full_verification(token, herder_id)
    
    # Test 10: Get Routes
    results["Get Routes"] = test_get_routes(token)
    
    # Test 11: Check Location
    results["Check Location"] = test_check_location(token)
    
    # Test 12: Dashboard Stats
    results["Dashboard Stats"] = test_dashboard_stats(token)
    
    # Print Summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✅ PASS" if passed_test else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! API is working correctly.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the output above for details.")

if __name__ == "__main__":
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API at", BASE_URL)
        print("Make sure the backend server is running:")
        print("  cd backend")
        print("  python -m uvicorn main:app --reload")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
