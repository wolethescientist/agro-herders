'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { routesAPI } from '@/lib/api';
import { Route } from '@/lib/types';
import { MapPin, CheckCircle, XCircle, Navigation, Loader2, Route as RouteIcon, Search } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Loading map...</p>
      </div>
    </div>
  )
});

export default function RoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkLat, setCheckLat] = useState('');
  const [checkLng, setCheckLng] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [checkPoint, setCheckPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadRoutes();
  }, [router]);

  const loadRoutes = async () => {
    try {
      const data = await routesAPI.getAll();
      setRoutes(data);
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const lat = parseFloat(checkLat);
    const lng = parseFloat(checkLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }

    setChecking(true);
    try {
      const result = await routesAPI.checkLocation(lat, lng);
      setCheckResult(result);
      setCheckPoint({ lat, lng });
    } catch (error) {
      console.error('Failed to check location:', error);
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-gray-200 rounded-2xl animate-pulse" style={{ height: '600px' }} />
            <div className="space-y-6">
              <div className="bg-gray-200 rounded-2xl animate-pulse h-64" />
              <div className="bg-gray-200 rounded-2xl animate-pulse h-80" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/20">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Approved Grazing Routes
            </h1>
          </div>
          <p className="text-gray-500 ml-14">View and verify authorized grazing corridors</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map Display */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden" style={{ height: '650px' }}>
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-600" />
                  Route Map
                </h2>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {routes.length} active routes
                </span>
              </div>
              <div style={{ height: 'calc(100% - 60px)' }}>
                <MapComponent routes={routes} checkPoint={checkPoint} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Routes List */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <RouteIcon className="w-5 h-5 text-emerald-600" />
                  Active Routes
                </h2>
              </div>
              
              <div className="p-4 max-h-64 overflow-y-auto">
                {routes.length > 0 ? (
                  <div className="space-y-3">
                    {routes.map((route, index) => (
                      <div 
                        key={route.id} 
                        className="group p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/30 border border-emerald-100 hover:border-emerald-200 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{route.route_name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {route.state}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <RouteIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No routes available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location Checker */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  Location Checker
                </h2>
              </div>
              
              <form onSubmit={handleCheckLocation} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={checkLat}
                    onChange={(e) => setCheckLat(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none"
                    placeholder="10.5265"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={checkLng}
                    onChange={(e) => setCheckLng(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none"
                    placeholder="7.4379"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={checking}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Check Authorization</span>
                    </>
                  )}
                </button>
              </form>

              {/* Check Result */}
              {checkResult && (
                <div className="px-4 pb-4">
                  <div className={`p-4 rounded-xl ${
                    checkResult.authorized 
                      ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200' 
                      : 'bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${checkResult.authorized ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {checkResult.authorized ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${checkResult.authorized ? 'text-emerald-800' : 'text-red-800'}`}>
                          {checkResult.authorized ? 'Location Authorized' : 'Location Unauthorized'}
                        </p>
                        <p className={`text-sm mt-1 ${checkResult.authorized ? 'text-emerald-600' : 'text-red-600'}`}>
                          {checkResult.message}
                        </p>
                        
                        {checkResult.routes && checkResult.routes.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-emerald-200">
                            <p className="text-xs font-semibold text-emerald-700 mb-2">Matching Routes:</p>
                            {checkResult.routes.map((route: any) => (
                              <p key={route.id} className="text-sm text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {route.route_name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
