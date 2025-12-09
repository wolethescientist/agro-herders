/**
 * TypeScript interfaces for Connexxion Agro-Herders Identity, Verification and Security
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Herder {
  id: number;
  full_name: string;
  age: number;
  state_of_origin: string;
  phone_number?: string;
  national_id?: string;
  photo_url?: string;
  status: string;
  created_at: string;
}

export interface Livestock {
  id: number;
  herder_id: number;
  rfid_code: string;
  animal_type: string;
  breed?: string;
  age_years?: number;
  health_status: string;
}

export interface Route {
  id: number;
  route_name: string;
  state: string;
  geojson_data: any;
  status: string;
}

export interface VerificationResult {
  status: string;
  risk_level: string;
  herder?: Herder;
  livestock?: Livestock[];
  message: string;
}

export interface DashboardStats {
  total_herders: number;
  total_livestock: number;
  recent_verifications: any[];
  active_routes: number;
}

export interface HerderRegistration {
  full_name: string;
  age: number;
  state_of_origin: string;
  phone_number?: string;
  national_id?: string;
  photo_url?: string;
  fingerprint_hash: string;
  face_vector: string;
}
