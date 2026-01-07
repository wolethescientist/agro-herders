'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Layout from '@/components/Layout';
import { dashboardAPI } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { Users, Beef, MapPin, CheckCircle, TrendingUp, Clock, Shield, Activity } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-80 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="h-10 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-gray-50">
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Herders',
      value: stats?.total_herders || 0,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      iconBg: 'bg-blue-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Livestock',
      value: stats?.total_livestock || 0,
      icon: Beef,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
      iconBg: 'bg-emerald-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Active Routes',
      value: stats?.active_routes || 0,
      icon: MapPin,
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100/50',
      iconBg: 'bg-violet-500',
      trend: '2 new',
      trendUp: true,
    },
    {
      title: 'Verifications',
      value: stats?.recent_verifications?.length || 0,
      icon: CheckCircle,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-100/50',
      iconBg: 'bg-amber-500',
      trend: 'Today',
      trendUp: true,
    },
  ];

  return (
    <Layout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Security Command Dashboard
            </h1>
          </div>
          <p className="text-gray-500 ml-14">Monitor herder activities and verification status in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-gray-100/50 hover:border-gray-200/50 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                      {card.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600">{card.trend}</span>
                      <span className="text-xs text-gray-400">this month</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl ${card.iconBg} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100/50">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/register')}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 hover:from-emerald-100 hover:to-emerald-200/50 transition-all duration-300 group"
              >
                <div className="p-2 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">Register New Herder</span>
              </button>
              <button 
                onClick={() => router.push('/verify')}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 group"
              >
                <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">Verify Identity</span>
              </button>
              <button 
                onClick={() => router.push('/routes')}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-violet-100/50 hover:from-violet-100 hover:to-violet-200/50 transition-all duration-300 group"
              >
                <div className="p-2 bg-violet-500 rounded-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">View Routes Map</span>
              </button>
            </div>
          </div>

          {/* Recent Verifications Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-card p-6 border border-gray-100/50">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Verifications</h2>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                Last 24 hours
              </span>
            </div>
            
            {stats?.recent_verifications && stats.recent_verifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Herder</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recent_verifications.map((verification: any) => (
                      <tr key={verification.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                              {(verification.herders?.full_name || 'U')[0]}
                            </div>
                            <span className="font-medium text-gray-900">
                              {verification.herders?.full_name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600 capitalize">
                            {verification.verification_type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            verification.result === 'verified' 
                              ? 'bg-emerald-100 text-emerald-700'
                              : verification.result === 'suspicious'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              verification.result === 'verified' 
                                ? 'bg-emerald-500'
                                : verification.result === 'suspicious'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`} />
                            {verification.result}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                            verification.risk_level === 'low'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : verification.risk_level === 'medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {verification.risk_level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {new Date(verification.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No verifications recorded yet</p>
                <p className="text-sm text-gray-400 mt-1">Verifications will appear here once processed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
