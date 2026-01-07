'use client';

import Sidebar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30">
      <Sidebar />
      <main className="flex-1 ml-72 transition-all duration-300">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
