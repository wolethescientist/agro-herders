'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Shield, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const userStr = Cookies.get('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/Connexxion_agro_logo.png" alt="Connexxion Agro-Herders" width={150} height={40} className="object-contain" />
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-green-200 transition">
              Dashboard
            </Link>
            <Link href="/register" className="hover:text-green-200 transition">
              Register Herder
            </Link>
            <Link href="/verify" className="hover:text-green-200 transition">
              Verify Identity
            </Link>
            <Link href="/routes" className="hover:text-green-200 transition">
              Routes Map
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="text-sm">{user.full_name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-green-200 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
