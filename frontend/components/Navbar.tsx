'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Shield, LogOut, User, Home, UserPlus, CheckCircle, Map } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const userStr = Cookies.get('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/register', label: 'Register Herder', icon: UserPlus },
    { href: '/verify', label: 'Verify Identity', icon: CheckCircle },
    { href: '/routes', label: 'Routes Map', icon: Map },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-green-700 text-white shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-green-600">
        <Link href="/dashboard" className="flex items-center justify-center">
          <div className="bg-white p-2 rounded-lg">
            <Image 
              src="/Connexxion_agro_logo.png" 
              alt="Connexxion Agro-Herders" 
              width={120} 
              height={32} 
              className="object-contain" 
            />
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-green-600 p-4">
        {user && (
          <div className="flex items-center space-x-3 px-4 py-2 mb-3 bg-green-600 rounded-lg">
            <User className="w-5 h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.full_name}</p>
              <p className="text-xs text-green-200">Security Officer</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
