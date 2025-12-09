'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { routesAPI } from '@/lib/api';
import { Route } from '@/lib/types';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gray-100">Loading map...</div>
});

export default function RoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkLat, setCheckLat] = useState('');
  const [checkLng, setCheckLng] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [checkPoint, setCheckPoint] = useState<{ lat: number; lng: number } | null>(null);

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

    try {
      const result = await routesAPI.checkLocation(lat, lng);
      setCheckResult(result);
      setCheckPoint({ lat, lng });
    } catch (error) {
      console.error('Failed to check location:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading routes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Approved Grazing Routes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
              <MapComponent routes={routes} checkPoint={checkPoint} />
            </div>
          </div>

          {/* Route List and Location Checker */}
          <div className="space-y-6">
            {/* Routes List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Active Routes ({routes.length})
              </h2>
              
              <div className="space-y-3">
                {routes.map((route) => (
                  <div key={route.id} className="border-l-4 border-green-500 pl-3 py-2">
                    <h3 className="font-medium text-gray-800">{route.route_name}</h3>
                    <p className="text-sm text-gray-600">{route.state}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Checker */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                <MapPin className="w-5 h-5 inline mr-2" />
                Check Location
              </h2>
              
              <form onSubmit={handleCheckLocation} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={checkLat}
                    onChange={(e) => setCheckLat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="10.5265"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={checkLng}
                    onChange={(e) => setCheckLng(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="7.4379"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Check Authorization
                </button>
              </form>

              {checkResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  checkResult.authorized 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    {checkResult.authorized ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        checkResult.authorized ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {checkResult.authorized ? 'Authorized' : 'Unauthorized'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        checkResult.authorized ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {checkResult.message}
                      </p>
                      
                      {checkResult.routes && checkResult.routes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-green-800">Routes:</p>
                          {checkResult.routes.map((route: any) => (
                            <p key={route.id} className="text-sm text-green-700">
                              • {route.route_name}
                            </p>
                          ))}
                        </div>
                      )}
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
