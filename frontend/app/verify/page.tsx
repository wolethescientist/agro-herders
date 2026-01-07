'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Layout from '@/components/Layout';
import { verificationAPI } from '@/lib/api';
import { VerificationResult } from '@/lib/types';
import { Fingerprint, Scan, Radio, CheckCircle, XCircle, AlertTriangle, MapPin, ShieldCheck, Loader2, User, Beef } from 'lucide-react';

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          gradient: 'from-emerald-500 to-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          glow: 'shadow-emerald-500/20',
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          gradient: 'from-amber-500 to-orange-500',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          glow: 'shadow-amber-500/20',
        };
      default:
        return {
          icon: XCircle,
          gradient: 'from-red-500 to-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          glow: 'shadow-red-500/20',
        };
    }
  };

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case 'low':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
      case 'medium':
        return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
      default:
        return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
    }
  };

  return (
    <Layout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Identity Verification
            </h1>
          </div>
          <p className="text-gray-500 ml-14">Verify herder identity using biometric and RFID data</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Verification Form */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Scan className="w-5 h-5 text-blue-600" />
                Enter Verification Data
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Face Vector */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Scan className="w-4 h-4 inline mr-2 text-gray-400" />
                  Face Vector <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="face_vector"
                  value={formData.face_vector}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none"
                  placeholder="FACE_..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1.5">Mock face recognition vector from registration</p>
              </div>

              {/* Fingerprint Hash */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Fingerprint className="w-4 h-4 inline mr-2 text-gray-400" />
                  Fingerprint Hash <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fingerprint_hash"
                  value={formData.fingerprint_hash}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none"
                  placeholder="FINGER_..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1.5">Mock fingerprint hash from registration</p>
              </div>

              {/* RFID Code */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Radio className="w-4 h-4 inline mr-2 text-gray-400" />
                  RFID Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rfid_code"
                  value={formData.rfid_code}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none"
                  placeholder="RFID_..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1.5">Livestock RFID tag identifier</p>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2 text-gray-400" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="location_lat"
                    value={formData.location_lat}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none"
                    placeholder="10.5265"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="location_lng"
                    value={formData.location_lng}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none"
                    placeholder="7.4379"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Run Full Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Verification Result */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Verification Result
              </h2>
            </div>

            <div className="p-6">
              {!result ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Scan className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Awaiting Verification</p>
                  <p className="text-sm text-gray-400 mt-1">Enter data and click verify to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Status Display */}
                  <div className="text-center py-6">
                    {(() => {
                      const config = getStatusConfig(result.status);
                      const Icon = config.icon;
                      return (
                        <>
                          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-xl ${config.glow}`}>
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 capitalize mb-2">
                            {result.status}
                          </h3>
                          <p className="text-gray-600">{result.message}</p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Risk Level */}
                  <div className={`p-4 rounded-xl ${getRiskConfig(result.risk_level).bg} border ${getStatusConfig(result.status).border}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Risk Assessment</span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getRiskConfig(result.risk_level).bg} ${getRiskConfig(result.risk_level).text}`}>
                        <span className={`w-2 h-2 rounded-full ${getRiskConfig(result.risk_level).dot}`} />
                        {result.risk_level.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Herder Information */}
                  {result.herder && (
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        Herder Information
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name</span>
                          <span className="font-medium text-gray-900">{result.herder.full_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Age</span>
                          <span className="font-medium text-gray-900">{result.herder.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">State</span>
                          <span className="font-medium text-gray-900">{result.herder.state_of_origin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            {result.herder.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Livestock Information */}
                  {result.livestock && result.livestock.length > 0 && (
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Beef className="w-4 h-4 text-amber-600" />
                        Livestock ({result.livestock.length})
                      </h4>
                      <div className="space-y-3">
                        {result.livestock.map((animal: any) => (
                          <div key={animal.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-500 rounded-lg">
                                <Radio className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{animal.rfid_code}</p>
                                <p className="text-sm text-gray-500">{animal.animal_type} {animal.breed && `• ${animal.breed}`}</p>
                              </div>
                            </div>
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
    </Layout>
  );
}
