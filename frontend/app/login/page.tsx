'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';
import { Shield, Mail, Lock, AlertCircle, Loader2, Fingerprint, MapPin, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      Cookies.set('token', response.access_token, { expires: 1 });
      Cookies.set('user', JSON.stringify(response.user), { expires: 1 });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Shield, title: 'Secure Authentication', desc: 'Multi-factor verification for enhanced security' },
    { icon: Fingerprint, title: 'Biometric Verification', desc: 'Advanced face and fingerprint recognition' },
    { icon: MapPin, title: 'Real-time Tracking', desc: 'Monitor herder movements and livestock' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-2xl">
              <Image src="/Connexxion_agro_logo.png" alt="Connexxion Agro-Herders" width={280} height={70} className="object-contain" />
            </div>
          </div>
          <p className="text-xl text-emerald-100 text-center font-light tracking-wide">
            Identity, Verification and Security
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-emerald-200/80 text-sm">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 text-emerald-200/60 text-sm">
          © 2024 Connexxion Agro-Allied. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <Image src="/Connexxion_agro_logo.png" alt="Connexxion Agro-Herders" width={200} height={50} className="object-contain" />
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </h2>
              </div>
              <p className="text-gray-500 ml-14">
                Sign in to access the security dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 outline-none"
                    placeholder="officer@connexxion.gov"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
                <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Demo Credentials
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                    <span className="text-gray-500">Email:</span>
                    <code className="text-blue-700 font-mono text-xs bg-blue-100 px-2 py-1 rounded">officer@connexxion.gov</code>
                  </div>
                  <div className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                    <span className="text-gray-500">Password:</span>
                    <code className="text-blue-700 font-mono text-xs bg-blue-100 px-2 py-1 rounded">SecurePass123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Authorized personnel only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
