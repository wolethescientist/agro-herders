'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut, User, LayoutDashboard, UserPlus, ShieldCheck, Map } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const userStr = Cookies.get('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/herders', label: 'Herders', icon: User },
    { href: '/register', label: 'Register Herder', icon: UserPlus },
    { href: '/verify', label: 'Verify Identity', icon: ShieldCheck },
    { href: '/routes', label: 'Routes Map', icon: Map },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-emerald-800 via-emerald-900 to-slate-900 text-white shadow-2xl flex flex-col z-50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-blue-600/5 pointer-events-none" />
      
      {/* Logo Section */}
      <div className="relative p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center justify-center group">
          <div className="bg-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Image 
              src="/Connexxion_agro_logo.png" 
              alt="Connexxion Agro-Herders" 
              width={140} 
              height={35} 
              className="object-contain" 
            />
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="relative flex-1 py-6 px-4 overflow-y-auto">
        <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider mb-4 px-4">
          Main Menu
        </p>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    active 
                      ? 'bg-white text-emerald-800 shadow-lg shadow-emerald-900/20' 
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'text-emerald-600' : 'group-hover:scale-110'}`} />
                  <span className={`font-medium ${active ? 'text-emerald-800' : ''}`}>{item.label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="relative border-t border-white/10 p-4">
        {user && (
          <div className="flex items-center space-x-3 px-4 py-3 mb-3 bg-gradient-to-r from-emerald-700/50 to-emerald-800/50 rounded-xl backdrop-blur-sm border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
              <p className="text-xs text-emerald-300/70">Security Officer</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-emerald-200 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
