# Connexxion Agro-Herders Identity, Verification and Security - Complete Setup Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 18+ and npm installed
- Supabase account (free tier works)
- Git (optional)

## Step-by-Step Setup

### Part 1: Supabase Database Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose organization and set project name
   - Set a strong database password
   - Wait for project to be created (~2 minutes)

2. **Run Database Schema**
   - In Supabase dashboard, go to SQL Editor
   - Click "New Query"
   - Copy entire contents of `backend/database/schema.sql`
   - Paste and click "Run"
   - Verify tables are created in Table Editor

3. **Get Database Connection String**
   - Go to Project Settings > Database
   - Scroll to "Connection string" section
   - Select "URI" tab
   - Copy the connection string (looks like: postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres)
   - Replace [YOUR-PASSWORD] with your actual database password
   - Keep this for backend configuration

### Part 2: Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   # Windows
   copy .env.example .env

   # Linux/Mac
   cp .env.example .env
   ```

5. **Edit .env File**
   Open `.env` in a text editor and update:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   SECRET_KEY=your-generated-secret-key
   ```

   Generate a secret key:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

6. **Start Backend Server**
   ```bash
   python -m uvicorn main:app --reload
   ```

   You should see:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   ```

7. **Test Backend**
   Open browser to: http://localhost:8000/docs
   You should see the Swagger API documentation

### Part 3: Frontend Setup

1. **Open New Terminal** (keep backend running)

2. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   ```bash
   # Windows
   copy .env.example .env.local

   # Linux/Mac
   cp .env.example .env.local
   ```

5. **Edit .env.local File**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

6. **Start Frontend Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   ```

7. **Open Application**
   Open browser to: http://localhost:3000

### Part 4: First Login

1. You'll be redirected to login page
2. Use default credentials:
   - Email: `officer@connexxion.gov`
   - Password: `SecurePass123`
3. Click "Login"
4. You should be redirected to the dashboard

## Testing the System

### 1. Register a Herder

1. Click "Register Herder" in navigation
2. Fill in the form:
   - Full Name: John Doe
   - Age: 35
   - State of Origin: Kaduna
   - Phone: +234123456789
   - National ID: NIN123456
3. Click "Register Herder"
4. Note the success message

### 2. Add Livestock

Currently, livestock must be added via API. Use the Swagger UI:

1. Go to http://localhost:8000/docs
2. Click on `POST /herders/livestock`
3. Click "Try it out"
4. Enter JSON:
   ```json
   {
     "herder_id": 1,
     "rfid_code": "RFID_CATTLE_001",
     "animal_type": "cattle",
     "breed": "Fulani White",
     "age_years": 3
   }
   ```
5. Click "Execute"

### 3. Test Verification

1. Go to "Verify Identity" page
2. To get the correct biometric data:
   - Open browser console (F12)
   - Go back to Dashboard
   - In Supabase dashboard, go to Table Editor > biometrics
   - Copy the `face_vector` and `fingerprint_hash` for herder ID 1
3. Enter in verification form:
   - Face Vector: (paste from database)
   - Fingerprint Hash: (paste from database)
   - RFID Code: RFID_CATTLE_001
   - Latitude: 10.5265
   - Longitude: 7.4379
4. Click "Run Full Verification"
5. Should show "Verified" with low risk

### 4. Check Grazing Routes

1. Go to "Routes Map" page
2. You should see 2 pre-loaded routes on the map
3. Test location checker:
   - Latitude: 10.6
   - Longitude: 7.5
   - Click "Check Authorization"
   - Should show "Authorized" (within Kaduna North Corridor)

## Troubleshooting

### Backend Issues

**Error: "Could not connect to database"**
- Check DATABASE_URL in .env is correct
- Verify your database password is correct
- Verify Supabase project is active
- Check internet connection
- Ensure you're using the correct connection string format

**Error: "Module not found"**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Port 8000 already in use**
- Change port in .env: `API_PORT=8001`
- Update frontend .env.local: `NEXT_PUBLIC_API_URL=http://localhost:8001`

### Frontend Issues

**Error: "Cannot connect to API"**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

**Map not displaying**
- Clear browser cache
- Check browser console for errors
- Ensure leaflet CSS is loaded

**Login fails**
- Verify database schema was run correctly
- Check users table in Supabase has the default officer
- Try resetting password hash in database

### Database Issues

**Tables not created**
- Re-run schema.sql in Supabase SQL Editor
- Check for SQL errors in Supabase logs
- Verify you have permissions

**Default user not working**
- The password hash in schema.sql is for "SecurePass123"
- If you need to reset, generate new hash:
  ```python
  import hashlib
  password = "SecurePass123"
  hash_value = hashlib.sha256(password.encode()).hexdigest()
  print(hash_value)
  ```

## Production Deployment Notes

This is a development MVP. For production:

1. **Security**
   - Use environment-specific secrets
   - Enable HTTPS/TLS
   - Implement rate limiting
   - Add input validation and sanitization
   - Use real biometric SDKs

2. **Database**
   - Enable Row Level Security (RLS) in Supabase
   - Set up database backups
   - Optimize indexes

3. **Frontend**
   - Build optimized production bundle: `npm run build`
   - Deploy to Vercel, Netlify, or similar
   - Use secure cookie settings

4. **Backend**
   - Deploy to cloud (AWS, GCP, Azure)
   - Use production ASGI server (Gunicorn + Uvicorn)
   - Set up monitoring and logging
   - Implement proper error handling

## Next Steps

1. Add more herders and livestock
2. Test different verification scenarios
3. Add more grazing routes
4. Customize the UI/UX
5. Integrate real biometric hardware
6. Add mobile app support
7. Implement real-time notifications
8. Add reporting and analytics

## Support

For issues or questions:
- Check the README files in backend/ and frontend/
- Review API documentation at http://localhost:8000/docs
- Check Supabase logs for database errors
