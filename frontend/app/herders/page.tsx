'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Layout from '@/components/Layout';
import { herdersAPI } from '@/lib/api';
import { Herder, Livestock } from '@/lib/types';
import { Users, Search, Filter, X, Beef, Phone, CreditCard, MapPin, Calendar } from 'lucide-react';

interface HerderDetail {
  herder: Herder;
  livestock: Livestock[];
}

export default function HerdersPage() {
  const router = useRouter();
  const [herders, setHerders] = useState<Herder[]>([]);
  const [filteredHerders, setFilteredHerders] = useState<Herder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedHerder, setSelectedHerder] = useState<HerderDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadHerders();
  }, [router]);

  useEffect(() => {
    filterHerders();
  }, [herders, searchQuery, stateFilter, statusFilter]);

  const loadHerders = async () => {
    try {
      const data = await herdersAPI.getAll();
      setHerders(data);
      setFilteredHerders(data);
    } catch (error) {
      console.error('Failed to load herders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHerders = () => {
    let filtered = [...herders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.full_name.toLowerCase().includes(query) ||
          (h.national_id && h.national_id.toLowerCase().includes(query))
      );
    }

    if (stateFilter) {
      filtered = filtered.filter((h) => h.state_of_origin === stateFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((h) => h.status === statusFilter);
    }

    setFilteredHerders(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStateFilter('');
    setStatusFilter('');
  };

  const openHerderDetail = async (herderId: number) => {
    setLoadingDetail(true);
    setShowDetailModal(true);
    try {
      const data = await herdersAPI.getById(herderId);
      setSelectedHerder(data);
    } catch (error) {
      console.error('Failed to load herder details:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedHerder(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const uniqueStates = [...new Set(herders.map((h) => h.state_of_origin))].sort();

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="mb-8">
            <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-4 mb-6">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-gray-50">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
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
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Registered Herders
            </h1>
            <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
              {herders.length} total
            </span>
          </div>
          <p className="text-gray-500 ml-14">View and manage all registered herders in the system</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or national ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white min-w-[150px]"
          >
            <option value="">All States</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white min-w-[130px]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {(searchQuery || stateFilter || statusFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Herders Table */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
          {filteredHerders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">State</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">National ID</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredHerders.map((herder) => (
                    <tr
                      key={herder.id}
                      onClick={() => openHerderDetail(herder.id)}
                      className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6">
                        {herder.photo_url ? (
                          <img
                            src={herder.photo_url}
                            alt={herder.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                            {getInitials(herder.full_name)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900">{herder.full_name}</td>
                      <td className="py-4 px-6 text-gray-600">{herder.age}</td>
                      <td className="py-4 px-6 text-gray-600">{herder.state_of_origin}</td>
                      <td className="py-4 px-6 text-gray-600">{herder.phone_number || '-'}</td>
                      <td className="py-4 px-6 text-gray-600">{herder.national_id || '-'}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          herder.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            herder.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`} />
                          {herder.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm">
                        {new Date(herder.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg mb-2">No herders found</p>
              <p className="text-gray-400 mb-6">
                {searchQuery || stateFilter || statusFilter
                  ? 'Try adjusting your search or filters'
                  : 'Get started by registering your first herder'}
              </p>
              {!searchQuery && !stateFilter && !statusFilter && (
                <button
                  onClick={() => router.push('/register')}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                >
                  Register Herder
                </button>
              )}
            </div>
          )}
        </div>

        {/* Herder Detail Modal */}
        {showDetailModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {loadingDetail ? (
                <div className="p-8">
                  <div className="flex gap-6 mb-6">
                    <div className="w-28 h-28 bg-gray-200 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : selectedHerder ? (
                <>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Herder Details</h2>
                      <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-6 mb-8">
                      {selectedHerder.herder.photo_url ? (
                        <img
                          src={selectedHerder.herder.photo_url}
                          alt={selectedHerder.herder.full_name}
                          className="w-28 h-28 rounded-xl object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                          {getInitials(selectedHerder.herder.full_name)}
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900">{selectedHerder.herder.full_name}</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{selectedHerder.herder.age} years old</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{selectedHerder.herder.state_of_origin}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedHerder.herder.phone_number || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>{selectedHerder.herder.national_id || 'Not provided'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            selectedHerder.herder.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              selectedHerder.herder.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                            }`} />
                            {selectedHerder.herder.status}
                          </span>
                          <span className="text-sm text-gray-400">
                            Registered {new Date(selectedHerder.herder.created_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Livestock Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Beef className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Livestock ({selectedHerder.livestock.length})
                        </h4>
                      </div>
                      {selectedHerder.livestock.length > 0 ? (
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">RFID Code</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Breed</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Age</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Health</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedHerder.livestock.map((animal) => (
                                <tr key={animal.id}>
                                  <td className="py-3 px-4 font-mono text-sm text-gray-700">{animal.rfid_code}</td>
                                  <td className="py-3 px-4 text-gray-600 capitalize">{animal.animal_type}</td>
                                  <td className="py-3 px-4 text-gray-600">{animal.breed || '-'}</td>
                                  <td className="py-3 px-4 text-gray-600">{animal.age_years ? `${animal.age_years} yrs` : '-'}</td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                                      animal.health_status === 'healthy'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : animal.health_status === 'sick'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                      {animal.health_status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                          <Beef className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No livestock registered for this herder</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
