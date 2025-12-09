# Connexxion Agro-Herders Identity, Verification and Security

## MVP Overview
A proof-of-concept system for herder identity verification using simulated biometrics, RFID tracking, and grazing route management.

## Tech Stack
- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Authentication**: JWT
- **Maps**: Leaflet.js

## Project Structure
```
connexxion-agro-herders/
├── backend/          # FastAPI application
├── frontend/         # Next.js application
└── README.md
```

## Quick Start

⚠️ **Important:** If you see TypeScript errors in the frontend, run `npm install` first. The errors occur because packages haven't been installed yet.

### 1. Setup Supabase
1. Create a Supabase project at https://supabase.com
2. Run the SQL scripts in `backend/database/schema.sql`
3. Get your database connection string from Settings > Database

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows (or source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database connection string
python -m uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### 3. Frontend Setup
```bash
cd frontend
npm install  # This will fix all TypeScript errors
cp .env.example .env.local
# Edit .env.local with backend URL
npm run dev
```

Frontend runs at: http://localhost:3000

📖 **For detailed step-by-step instructions, see [INSTALLATION_STEPS.md](INSTALLATION_STEPS.md)**

## Default Login
- Email: officer@connexxion.gov
- Password: SecurePass123

## Features
- ✅ JWT Authentication
- ✅ Herder Registration
- ✅ Mock Biometric Verification (Face + Fingerprint)
- ✅ RFID Livestock Tracking
- ✅ Grazing Route Visualization
- ✅ Security Dashboard
- ✅ Field Verification Workflow
