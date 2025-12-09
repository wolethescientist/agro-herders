# Connexxion Agro-Herders Identity, Verification and Security - Frontend (Next.js 14)

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

## Features

### Pages

1. **Login** (`/login`)
   - Security officer authentication
   - JWT token management

2. **Dashboard** (`/dashboard`)
   - Statistics overview
   - Recent verifications
   - System metrics

3. **Register Herder** (`/register`)
   - Herder registration form
   - Mock biometric capture
   - Personal information collection

4. **Verify Identity** (`/verify`)
   - Full verification workflow
   - Face, fingerprint, and RFID checks
   - Risk assessment display

5. **Routes Map** (`/routes`)
   - Interactive map with Leaflet
   - Approved grazing routes visualization
   - Location authorization checker

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirects)
│   ├── globals.css        # Global styles
│   ├── login/
│   │   └── page.tsx       # Login page
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard
│   ├── register/
│   │   └── page.tsx       # Herder registration
│   ├── verify/
│   │   └── page.tsx       # Verification workflow
│   └── routes/
│       └── page.tsx       # Routes map
├── components/
│   ├── Navbar.tsx         # Navigation bar
│   └── MapComponent.tsx   # Leaflet map
├── lib/
│   ├── api.ts             # API service layer
│   └── types.ts           # TypeScript interfaces
└── package.json
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Maps**: Leaflet + React Leaflet
- **Icons**: Lucide React
- **Auth**: JWT stored in cookies

## Default Login

```
Email: officer@connexxion.gov
Password: SecurePass123
```

## Development Notes

### Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in HTTP-only cookie
4. All API requests include token in Authorization header
5. Protected routes check for token

### Mock Data

The verification page uses mock biometric data:
- Face vectors are generated as `FACE_{name}_{timestamp}`
- Fingerprints are generated as `FINGER_{name}_{timestamp}`
- RFID codes can be any string

To test verification:
1. Register a herder (note the generated biometric data in console)
2. Add livestock with RFID code
3. Use the same biometric data in verification page

### Map Integration

The routes map uses Leaflet.js to display GeoJSON polygons. Routes are loaded from the backend and displayed as colored polygons on the map.

## Troubleshooting

### Map not loading
- Ensure Leaflet CSS is imported
- Check that component is dynamically imported with `ssr: false`

### API connection errors
- Verify backend is running on port 8000
- Check CORS settings in backend
- Confirm `NEXT_PUBLIC_API_URL` is set correctly

### Authentication issues
- Clear cookies and try logging in again
- Check JWT token expiration (24 hours by default)
- Verify backend SECRET_KEY is set
