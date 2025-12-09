-- Connexxion Agro-Herders Identity, Verification and Security - Database Schema for Supabase

-- Users table (Security Officers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'officer',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Herders table
CREATE TABLE IF NOT EXISTS herders (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    age INTEGER,
    state_of_origin VARCHAR(100),
    photo_url TEXT,
    phone_number VARCHAR(20),
    national_id VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Biometrics table (Mock data)
CREATE TABLE IF NOT EXISTS biometrics (
    id SERIAL PRIMARY KEY,
    herder_id INTEGER REFERENCES herders(id) ON DELETE CASCADE,
    face_vector TEXT, -- Mock facial recognition vector
    fingerprint_hash VARCHAR(255), -- Mock fingerprint hash
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(herder_id)
);

-- Livestock table
CREATE TABLE IF NOT EXISTS livestock (
    id SERIAL PRIMARY KEY,
    herder_id INTEGER REFERENCES herders(id) ON DELETE CASCADE,
    rfid_code VARCHAR(50) UNIQUE NOT NULL,
    animal_type VARCHAR(50) DEFAULT 'cattle',
    breed VARCHAR(100),
    age_years INTEGER,
    health_status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Grazing Routes table
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    route_name VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    geojson_data JSONB NOT NULL, -- GeoJSON polygon/linestring
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Verification Logs table
CREATE TABLE IF NOT EXISTS verifications (
    id SERIAL PRIMARY KEY,
    herder_id INTEGER REFERENCES herders(id),
    officer_id UUID REFERENCES users(id),
    verification_type VARCHAR(50), -- 'face', 'fingerprint', 'rfid', 'full'
    result VARCHAR(50), -- 'verified', 'failed', 'suspicious'
    risk_level VARCHAR(20), -- 'low', 'medium', 'high'
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default security officer
-- Password: SecurePass123 (SHA-256 hash)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES (
    'officer@connexxion.gov',
    '3afeed04eeca02f36260571b19deb0898adfabcf3d0283aacdc9cafb81e0b0e1',
    'Security Officer',
    'officer'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample grazing routes
INSERT INTO routes (route_name, state, geojson_data, status) VALUES
('Kaduna North Corridor', 'Kaduna', '{
  "type": "Polygon",
  "coordinates": [[
    [7.4379, 10.5265],
    [7.7379, 10.5265],
    [7.7379, 10.8265],
    [7.4379, 10.8265],
    [7.4379, 10.5265]
  ]]
}', 'active'),
('Plateau Central Route', 'Plateau', '{
  "type": "Polygon",
  "coordinates": [[
    [8.8900, 9.2182],
    [9.2900, 9.2182],
    [9.2900, 9.5182],
    [8.8900, 9.5182],
    [8.8900, 9.2182]
  ]]
}', 'active');
