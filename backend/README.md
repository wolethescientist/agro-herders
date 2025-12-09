# Connexxion Agro-Herders Identity, Verification and Security - Backend (FastAPI)

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings > Database
3. Copy your connection string (URI format)
4. Run the SQL schema in `database/schema.sql` in the Supabase SQL Editor

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
SECRET_KEY=generate-a-random-secret-key
```

To generate a secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Run the Server

```bash
python -m uvicorn main:app --reload
```

The API will be available at: http://localhost:8000

### 5. API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token

### Herders
- `POST /herders/register` - Register new herder with biometrics
- `GET /herders/` - Get all herders
- `GET /herders/{id}` - Get herder details
- `POST /herders/livestock` - Add livestock with RFID

### Verification
- `POST /verify/face` - Verify face (mock)
- `POST /verify/fingerprint` - Verify fingerprint (mock)
- `POST /verify/rfid` - Verify RFID tag
- `POST /verify/full` - Full verification (all methods)

### Routes
- `GET /routes/` - Get all grazing routes
- `GET /routes/{id}` - Get specific route
- `POST /routes/check-location` - Check if location is authorized

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## Default Login

```
Email: officer@connexxion.gov
Password: SecurePass123
```

## Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── config.py              # Configuration management
├── database.py            # Supabase client
├── auth.py                # JWT authentication
├── models.py              # Pydantic models
├── routers/               # API route handlers
│   ├── auth_router.py
│   ├── herders_router.py
│   ├── verification_router.py
│   ├── routes_router.py
│   └── dashboard_router.py
├── services/              # Business logic
│   ├── verification_service.py
│   └── route_service.py
└── database/
    └── schema.sql         # Database schema
```

## Mock Biometrics

This MVP uses simulated biometric verification:

- **Face Recognition**: Simple string comparison of first 10 characters
- **Fingerprint**: Hash comparison
- **RFID**: Database lookup

In production, replace with actual biometric SDKs.
