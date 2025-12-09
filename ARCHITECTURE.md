# Connexxion Agro-Herders Identity, Verification and Security - System Architecture

## Overview

Connexxion Agro-Herders Identity, Verification and Security is a full-stack web application designed to manage herder identities, verify them using biometric data, track livestock via RFID, and monitor grazing routes.

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Pydantic
- **GIS**: Shapely (for geospatial operations)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Maps**: Leaflet.js + React Leaflet
- **Icons**: Lucide React
- **State Management**: React Hooks

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                      (Next.js 14)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │ Register │  │  Verify  │   │
│  │  Page    │  │   Page   │  │   Page   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Service Layer (Axios)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST + JWT
                            │
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                       (FastAPI)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   API Routers                         │  │
│  │  • Auth Router      • Herders Router                 │  │
│  │  • Verification     • Routes Router                  │  │
│  │  • Dashboard Router                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Service Layer                         │  │
│  │  • BiometricVerificationService                      │  │
│  │  • RouteService                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database Client (Supabase)               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ PostgreSQL Protocol
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ herders  │  │livestock │  │  routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────────────────────────────────┐   │
│  │biometrics│  │      verifications                    │   │
│  └──────────┘  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow
```
User → Login Page → POST /auth/login → Validate Credentials
                                      → Generate JWT Token
                                      → Store in Cookie
                                      → Redirect to Dashboard
```

### 2. Herder Registration Flow
```
Officer → Register Form → POST /herders/register
                        → Insert herder record
                        → Insert biometric data
                        → Return herder_id
                        → Show success message
```

### 3. Verification Flow
```
Officer → Verification Form → POST /verify/full
                            → Verify Face (mock comparison)
                            → Verify Fingerprint (hash match)
                            → Verify RFID (database lookup)
                            → Calculate Risk Level
                            → Log verification
                            → Return result
```

### 4. Route Checking Flow
```
Officer → Enter GPS Coords → POST /routes/check-location
                           → Load all active routes
                           → Point-in-polygon check (Shapely)
                           → Return authorized routes
                           → Display on map
```

## Database Schema

### users
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (VARCHAR)
- created_at (TIMESTAMP)

### herders
- id (SERIAL, PK)
- full_name (VARCHAR)
- age (INTEGER)
- state_of_origin (VARCHAR)
- photo_url (TEXT)
- phone_number (VARCHAR)
- national_id (VARCHAR, UNIQUE)
- status (VARCHAR)
- created_at (TIMESTAMP)

### biometrics
- id (SERIAL, PK)
- herder_id (INTEGER, FK → herders.id)
- face_vector (TEXT) - Mock facial recognition data
- fingerprint_hash (VARCHAR) - Mock fingerprint data
- created_at (TIMESTAMP)

### livestock
- id (SERIAL, PK)
- herder_id (INTEGER, FK → herders.id)
- rfid_code (VARCHAR, UNIQUE)
- animal_type (VARCHAR)
- breed (VARCHAR)
- age_years (INTEGER)
- health_status (VARCHAR)
- created_at (TIMESTAMP)

### routes
- id (SERIAL, PK)
- route_name (VARCHAR)
- state (VARCHAR)
- geojson_data (JSONB) - GeoJSON polygon
- status (VARCHAR)
- created_at (TIMESTAMP)

### verifications
- id (SERIAL, PK)
- herder_id (INTEGER, FK → herders.id)
- officer_id (UUID, FK → users.id)
- verification_type (VARCHAR)
- result (VARCHAR)
- risk_level (VARCHAR)
- location_lat (DECIMAL)
- location_lng (DECIMAL)
- notes (TEXT)
- created_at (TIMESTAMP)

## API Endpoints

### Authentication
- `POST /auth/login` - Authenticate and get JWT

### Herders Management
- `POST /herders/register` - Register new herder
- `GET /herders/` - List all herders
- `GET /herders/{id}` - Get herder details
- `POST /herders/livestock` - Add livestock

### Verification
- `POST /verify/face` - Verify face (mock)
- `POST /verify/fingerprint` - Verify fingerprint (mock)
- `POST /verify/rfid` - Verify RFID tag
- `POST /verify/full` - Full verification

### Routes
- `GET /routes/` - List all routes
- `GET /routes/{id}` - Get route details
- `POST /routes/check-location` - Check GPS authorization

### Dashboard
- `GET /dashboard/stats` - Get statistics

## Security Features

### Authentication
- JWT-based authentication
- Tokens expire after 24 hours
- Passwords hashed with SHA-256
- HTTP-only cookies for token storage

### Authorization
- All protected endpoints require valid JWT
- Token validation on every request
- User context extracted from token

### Data Protection
- Environment variables for sensitive config
- CORS configured for frontend origin only
- Input validation with Pydantic models

## Mock Biometric Implementation

This MVP uses simulated biometric verification:

### Face Recognition (Mock)
```python
def verify_face(input_vector, stored_vector):
    # Simple string comparison of first 10 characters
    match = input_vector[:10] == stored_vector[:10]
    confidence = 0.95 if match else 0.32
    return match, confidence
```

### Fingerprint Verification (Mock)
```python
def verify_fingerprint(input_hash, stored_hash):
    # Direct hash comparison
    match = input_hash == stored_hash
    confidence = 0.98 if match else 0.15
    return match, confidence
```

### Risk Calculation
```python
def calculate_risk_level(face_match, fingerprint_match, rfid_match):
    matches = sum([face_match, fingerprint_match, rfid_match])
    if matches == 3: return "low"
    elif matches == 2: return "medium"
    else: return "high"
```

**Production Note**: Replace with actual biometric SDKs like:
- Face: OpenCV + face_recognition, AWS Rekognition, Azure Face API
- Fingerprint: DigitalPersona, Neurotechnology, Suprema

## GIS Implementation

### Route Storage
Routes stored as GeoJSON polygons in PostgreSQL JSONB column:
```json
{
  "type": "Polygon",
  "coordinates": [[[lng, lat], [lng, lat], ...]]
}
```

### Location Checking
Uses Shapely library for point-in-polygon tests:
```python
from shapely.geometry import Point, shape

point = Point(longitude, latitude)
polygon = shape(geojson_data)
is_authorized = polygon.contains(point)
```

## Frontend Architecture

### Page Structure
```
app/
├── layout.tsx          # Root layout with metadata
├── page.tsx            # Home (redirects based on auth)
├── login/
│   └── page.tsx        # Login page
├── dashboard/
│   └── page.tsx        # Dashboard with stats
├── register/
│   └── page.tsx        # Herder registration
├── verify/
│   └── page.tsx        # Verification workflow
└── routes/
    └── page.tsx        # Map with routes
```

### Component Structure
```
components/
├── Navbar.tsx          # Navigation bar (used on all protected pages)
└── MapComponent.tsx    # Leaflet map wrapper
```

### Service Layer
```
lib/
├── api.ts              # Axios-based API client
└── types.ts            # TypeScript interfaces
```

## Deployment Considerations

### Development
- Backend: `uvicorn main:app --reload`
- Frontend: `npm run dev`
- Database: Supabase cloud

### Production

#### Backend
- Use Gunicorn + Uvicorn workers
- Deploy to AWS EC2, GCP Compute, or Azure VM
- Set up HTTPS with Let's Encrypt
- Use environment-specific secrets
- Enable logging and monitoring

#### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or AWS Amplify
- Configure environment variables
- Enable CDN for static assets

#### Database
- Enable Row Level Security (RLS)
- Set up automated backups
- Configure connection pooling
- Add database indexes for performance

## Scalability Considerations

### Current Limitations (MVP)
- Single server deployment
- No caching layer
- Synchronous processing
- No load balancing

### Production Enhancements
1. **Caching**: Add Redis for session management and API caching
2. **Queue System**: Use Celery/RabbitMQ for async verification processing
3. **Load Balancing**: Deploy multiple backend instances behind load balancer
4. **CDN**: Use CloudFront/Cloudflare for static assets
5. **Database**: Read replicas for query scaling
6. **Monitoring**: Add Prometheus, Grafana, Sentry
7. **API Gateway**: Add rate limiting and throttling

## Future Enhancements

### Phase 2
- Real biometric hardware integration
- Mobile app (React Native)
- Offline mode with sync
- SMS/Email notifications
- Advanced reporting and analytics

### Phase 3
- Real-time tracking with GPS devices
- AI-powered anomaly detection
- Blockchain for immutable records
- Integration with national ID systems
- Multi-language support

### Phase 4
- Satellite imagery integration
- Predictive analytics for route planning
- Integration with weather services
- Automated conflict resolution
- Public API for third-party integrations
