# Connexxion Agro-Herders Identity, Verification and Security - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites Check
```bash
python --version  # Should be 3.8+
node --version    # Should be 18+
npm --version
```

### 1. Supabase Setup (2 minutes)

1. Go to https://supabase.com and create account
2. Create new project (wait ~2 min for setup)
3. Go to SQL Editor → New Query
4. Copy/paste contents of `backend/database/schema.sql`
5. Click "Run"
6. Go to Settings → Database → Connection string → URI tab
   - Copy the connection string
   - Note your database password

### 2. Backend Setup (1 minute)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` - paste your database connection string:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
SECRET_KEY=any-random-string-here
```

Start backend:
```bash
python -m uvicorn main:app --reload
```

### 3. Frontend Setup (1 minute)

Open NEW terminal:
```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start frontend:
```bash
npm run dev
```

### 4. Login (30 seconds)

1. Open http://localhost:3000
2. Login with:
   - Email: `officer@connexxion.gov`
   - Password: `SecurePass123`

### 5. Test the System

#### Register a Herder
1. Click "Register Herder"
2. Fill form and submit
3. Note: Biometric data is auto-generated

#### Add Livestock (via API)
1. Go to http://localhost:8000/docs
2. Click `POST /herders/livestock` → "Try it out"
3. Use this JSON (change herder_id to match your herder):
```json
{
  "herder_id": 1,
  "rfid_code": "RFID_001",
  "animal_type": "cattle",
  "breed": "Fulani White",
  "age_years": 3
}
```

#### Verify Identity
1. Go to Supabase → Table Editor → biometrics
2. Copy `face_vector` and `fingerprint_hash` for your herder
3. In app, go to "Verify Identity"
4. Paste the biometric data
5. Enter RFID: `RFID_001`
6. Click "Run Full Verification"
7. Should show ✅ Verified with Low Risk

#### Check Routes
1. Go to "Routes Map"
2. See pre-loaded grazing routes
3. Test location:
   - Lat: `10.6`
   - Lng: `7.5`
4. Click "Check Authorization"
5. Should show ✅ Authorized

## 🎯 What You Built

- ✅ JWT Authentication
- ✅ Herder Registration with Mock Biometrics
- ✅ RFID Livestock Tracking
- ✅ Identity Verification System
- ✅ Grazing Route Visualization
- ✅ Location Authorization Checker
- ✅ Security Dashboard

## 📚 Next Steps

- Read `SETUP_GUIDE.md` for detailed documentation
- Check `backend/README.md` for API details
- Check `frontend/README.md` for UI details
- Run `python backend/test_api.py` to test all endpoints

## ⚠️ Troubleshooting

**Backend won't start:**
- Check DATABASE_URL in `.env` is correct
- Verify your database password in the connection string
- Ensure virtual environment is activated
- Try: `pip install -r requirements.txt` again

**Frontend won't start:**
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Can't login:**
- Verify schema.sql was run in Supabase
- Check users table exists with default officer
- Password is: `SecurePass123`

**Map not showing:**
- Clear browser cache
- Check browser console for errors
- Ensure you're on the `/routes` page

## 🆘 Need Help?

1. Check the error message in terminal
2. Look at browser console (F12)
3. Review Supabase logs
4. Read the detailed `SETUP_GUIDE.md`
