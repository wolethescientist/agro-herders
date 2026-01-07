'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Shield, Users, MapPin, Fingerprint, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 animate-fade-in-left">
              <Image src="/Connexxion_agro_logo.png" alt="Connexxion Agro-Herders" width={220} height={55} className="object-contain" />
            </div>
            <div className="flex items-center space-x-4 animate-fade-in-right">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:scale-105"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className={`inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Secure Identity & Verification System</span>
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Agro-Herders Identity,<br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Verification & Security
            </span>
          </h1>
          
          <p className={`text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            A comprehensive system for herder identity verification using biometric authentication, 
            RFID livestock tracking, and intelligent grazing route management.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={() => router.push('/register')}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center space-x-2 text-lg font-semibold overflow-hidden hover:scale-105 hover:-translate-y-1"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Register Now</span>
              <ArrowRight className="relative h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-200 text-lg font-semibold hover:scale-105 hover:-translate-y-1 hover:border-emerald-300"
            >
              Officer Login
            </button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className={`mt-16 relative transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse-slow"></div>
          <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-2xl shadow-2xl p-8 md:p-12 animate-gradient bg-[length:200%_auto]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Fingerprint, title: 'Biometric Auth', desc: 'Secure face and fingerprint verification', delay: '0' },
                { icon: MapPin, title: 'Route Tracking', desc: 'Real-time grazing route monitoring', delay: '200' },
                { icon: Shield, title: 'RFID Security', desc: 'Livestock identification and tracking', delay: '400' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group animate-fade-in-up"
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  <item.icon className="h-12 w-12 text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Powerful Features</h2>
          <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">Everything you need for comprehensive herder management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: 'Herder Registration',
              description: 'Complete digital identity management with biometric enrollment and verification',
              gradient: 'from-emerald-500 to-teal-500'
            },
            {
              icon: Fingerprint,
              title: 'Biometric Verification',
              description: 'Advanced face and fingerprint recognition for secure authentication',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: MapPin,
              title: 'Route Management',
              description: 'Interactive map-based grazing route planning and monitoring',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: Shield,
              title: 'RFID Tracking',
              description: 'Real-time livestock tracking and identification system',
              gradient: 'from-orange-500 to-red-500'
            },
            {
              icon: CheckCircle,
              title: 'Field Verification',
              description: 'Mobile-friendly verification workflow for field officers',
              gradient: 'from-teal-500 to-emerald-500'
            },
            {
              icon: Shield,
              title: 'Security Dashboard',
              description: 'Comprehensive analytics and monitoring for security personnel',
              gradient: 'from-indigo-500 to-purple-500'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent group cursor-pointer animate-fade-in-up hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500`}></div>
              <div className={`relative inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="relative text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">{feature.title}</h3>
              <p className="relative text-gray-600 leading-relaxed">{feature.description}</p>
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500 rounded-b-xl`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 py-16 overflow-hidden animate-gradient bg-[length:200%_auto]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '99.9%', label: 'Verification Accuracy' },
              { value: '24/7', label: 'System Availability' },
              { value: '<2s', label: 'Average Response Time' },
              { value: '100%', label: 'Data Security' }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-white group cursor-pointer animate-fade-in-up hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-5xl font-bold mb-2 group-hover:scale-125 transition-transform duration-300 animate-count-up">{stat.value}</div>
                <div className="text-emerald-100 group-hover:text-white transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl p-12 text-center border border-emerald-100 overflow-hidden group hover:border-emerald-300 transition-all duration-500 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            <div className="absolute top-20 right-20 w-20 h-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
            <div className="absolute bottom-10 left-1/2 w-20 h-20 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>
          </div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Join the modern herder management system today and experience secure, efficient identity verification.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center space-x-2 text-lg font-semibold overflow-hidden hover:scale-105 hover:-translate-y-1 animate-fade-in-up animation-delay-400"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Create Your Account</span>
              <ArrowRight className="relative h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-gray-400 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0 group cursor-pointer">
              <Image src="/Connexxion_agro_logo.png" alt="Connexxion Agro-Herders" width={150} height={40} className="object-contain group-hover:scale-105 transition-all duration-300" />
            </div>
            <div className="text-center md:text-right">
              <p className="hover:text-emerald-400 transition-colors duration-300">&copy; 2024 Connexxion Agro-Allied. All rights reserved.</p>
              <p className="text-sm mt-1 hover:text-gray-300 transition-colors duration-300">Identity, Verification and Security</p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
