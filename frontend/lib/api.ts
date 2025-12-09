/**
 * API service for communicating with FastAPI backend
 */
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Herders API
export const herdersAPI = {
  register: async (herderData: any) => {
    const response = await api.post('/herders/register', herderData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/herders/');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/herders/${id}`);
    return response.data;
  },
  
  addLivestock: async (livestockData: any) => {
    const response = await api.post('/herders/livestock', livestockData);
    return response.data;
  },
};

// Verification API
export const verificationAPI = {
  verifyFace: async (faceVector: string) => {
    const response = await api.post('/verify/face', { face_vector: faceVector });
    return response.data;
  },
  
  verifyFingerprint: async (fingerprintHash: string) => {
    const response = await api.post('/verify/fingerprint', { fingerprint_hash: fingerprintHash });
    return response.data;
  },
  
  verifyRFID: async (rfidCode: string) => {
    const response = await api.post('/verify/rfid', { rfid_code: rfidCode });
    return response.data;
  },
  
  fullVerification: async (data: {
    face_vector: string;
    fingerprint_hash: string;
    rfid_code: string;
    location_lat?: number;
    location_lng?: number;
  }) => {
    const response = await api.post('/verify/full', data);
    return response.data;
  },
};

// Routes API
export const routesAPI = {
  getAll: async () => {
    const response = await api.get('/routes/');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },
  
  checkLocation: async (latitude: number, longitude: number) => {
    const response = await api.post('/routes/check-location', { latitude, longitude });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default api;
