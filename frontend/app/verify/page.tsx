'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import { verificationAPI } from '@/lib/api';
import { VerificationResult } from '@/lib/types';
import { Fingerprint, Scan, Radio, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  
  const [formData, setFormData] = useState({
    face_vector: '',
    fingerprint_hash: '',
    rfid_code: '',
    location_lat: '',
    location_lng: '',
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data = {
        face_vector: formData.face_vector,
        fingerprint_hash: formData.fingerprint_hash,
        rfid_code: formData.rfid_code,
        location_lat: formData.location_lat ? parseFloat(formData.location_lat) : undefined,
        location_lng: formData.location_lng ? parseFloat(formData.location_lng) : undefined,
      };

      const response = await verificationAPI.fullVerification(data);
      setResult(response);
    } catch (err: any) {
      console.error('Verification failed:', err);
      setResult({
        status: 'failed',
        risk_level: 'high',
        message: 'Verification request failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'suspicious': return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case 'failed': return <XCircle className="w-16 h-16 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Identity Verification
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Verification Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Enter Verification Data
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Scan className="w-4 h-4 inline mr-1" />
                    Face Vector *
                  </label>
                  <input
                    type="text"
                    name="face_vector"
                    value={formData.face_vector}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="FACE_..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mock face recognition vector
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Fingerprint className="w-4 h-4 inline mr-1" />
                    Fingerprint Hash *
                  </label>
                  <input
                    type="text"
                    name="fingerprint_hash"
                    value={formData.fingerprint_hash}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="FINGER_..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mock fingerprint hash
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Radio className="w-4 h-4 inline mr-1" />
                    RFID Code *
                  </label>
                  <input
                    type="text"
                    name="rfid_code"
                    value={formData.rfid_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="RFID_..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Livestock RFID tag
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="location_lat"
                      value={formData.location_lat}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="10.5265"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="location_lng"
                      value={formData.location_lng}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="7.4379"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 font-medium"
                >
                  {loading ? 'Verifying...' : 'Run Full Verification'}
                </button>
              </form>
            </div>

            {/* Verification Result */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Verification Result
              </h2>

              {!result ? (
                <div className="text-center py-12 text-gray-400">
                  <Scan className="w-16 h-16 mx-auto mb-4" />
                  <p>Enter verification data and click verify</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    {getStatusIcon(result.status)}
                    <h3 className="text-2xl font-bold mt-4 capitalize">
                      {result.status}
                    </h3>
                    <p className="text-gray-600 mt-2">{result.message}</p>
                  </div>

                  <div className={`p-4 rounded-lg ${getRiskColor(result.risk_level)}`}>
                    <p className="font-medium">Risk Level: {result.risk_level.toUpperCase()}</p>
                  </div>

                  {result.herder && (
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-gray-800 mb-2">Herder Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {result.herder.full_name}</p>
                        <p><span className="font-medium">Age:</span> {result.herder.age}</p>
                        <p><span className="font-medium">State:</span> {result.herder.state_of_origin}</p>
                        <p><span className="font-medium">Status:</span> {result.herder.status}</p>
                      </div>
                    </div>
                  )}

                  {result.livestock && result.livestock.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-gray-800 mb-2">Livestock</h4>
                      <div className="space-y-2">
                        {result.livestock.map((animal: any) => (
                          <div key={animal.id} className="bg-gray-50 p-3 rounded text-sm">
                            <p><span className="font-medium">RFID:</span> {animal.rfid_code}</p>
                            <p><span className="font-medium">Type:</span> {animal.animal_type}</p>
                            {animal.breed && <p><span className="font-medium">Breed:</span> {animal.breed}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
