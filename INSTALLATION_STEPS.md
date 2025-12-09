# Installation Steps - Connexxion Agro-Herders Identity, Verification and Security

## Important: Follow These Steps in Order

### Step 1: Install Backend Dependencies

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Note:** This will install all required packages and resolve the TypeScript errors you're seeing. The 400+ errors are simply because the npm packages (react, next, axios, etc.) haven't been installed yet.

### Step 3: Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
API_HOST=0.0.0.0
API_PORT=8000
```

#### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Setup Supabase Database

1. Go to https://supabase.com and create a project
2. Go to SQL Editor
3. Copy the contents of `backend/database/schema.sql`
4. Paste and run in SQL Editor
5. Get your connection string from Settings > Database > Connection string (URI)

### Step 5: Start the Backend

```bash
cd backend
# Make sure virtual environment is activated
python -m uvicorn main:app --reload
```

Backend will run at: http://localhost:8000

### Step 6: Start the Frontend

Open a NEW terminal window:

```bash
cd frontend
npm run dev
```

Frontend will run at: http://localhost:3000

### Step 7: Test the Application

1. Open http://localhost:3000
2. Login with:
   - Email: `officer@connexxion.gov`
   - Password: `SecurePass123`

## Troubleshooting

### "400+ TypeScript errors in frontend"
**Solution:** Run `npm install` in the frontend directory. These errors occur because the npm packages haven't been installed yet.

### "Cannot find module 'react'"
**Solution:** Run `npm install` in the frontend directory.

### "Module not found: Can't resolve 'axios'"
**Solution:** Run `npm install` in the frontend directory.

### Backend won't start
**Solution:** 
- Verify virtual environment is activated
- Check DATABASE_URL in .env
- Run `pip install -r requirements.txt` again

### Frontend won't start
**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again
- Run `npm run dev`

### Database connection errors
**Solution:**
- Verify your Supabase connection string is correct
- Check your database password
- Ensure schema.sql has been run in Supabase

## Quick Command Reference

### Backend
```bash
# Install
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Run
python -m uvicorn main:app --reload
```

### Frontend
```bash
# Install
cd frontend
npm install

# Run
npm run dev

# Build for production
npm run build
npm start
```

## What Gets Installed

### Backend Packages
- fastapi - Web framework
- uvicorn - ASGI server
- python-jose - JWT handling
- psycopg2-binary - PostgreSQL driver
- pydantic - Data validation
- shapely - GIS operations
- hashlib (built-in) - Password hashing

### Frontend Packages
- next - React framework
- react & react-dom - UI library
- typescript - Type safety
- axios - HTTP client
- leaflet & react-leaflet - Maps
- js-cookie - Cookie management
- lucide-react - Icons
- tailwindcss - Styling

## File Sizes (Approximate)

- Backend `venv/` folder: ~100-200 MB
- Frontend `node_modules/` folder: ~400-600 MB
- Total project size after installation: ~500-800 MB

## Installation Time

- Backend: 1-2 minutes
- Frontend: 3-5 minutes (depending on internet speed)
- Total: 5-7 minutes

## System Requirements

- Python 3.8 or higher
- Node.js 18 or higher
- npm 9 or higher
- 1 GB free disk space
- Internet connection for package downloads
