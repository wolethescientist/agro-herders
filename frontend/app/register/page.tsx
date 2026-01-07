'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Layout from '@/components/Layout';
import PhotoUpload from '@/components/PhotoUpload';
import { herdersAPI } from '@/lib/api';
import { uploadHerderPhoto } from '@/lib/storage';
import { UserPlus, Fingerprint, User, MapPin, Phone, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    state_of_origin: '',
    phone_number: '',
    national_id: '',
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploadError('');
    setLoading(true);

    try {
      let photoUrl = '';

      // Upload image if selected
      if (selectedFile) {
        const uploadResult = await uploadHerderPhoto(selectedFile);
        if (!uploadResult.success) {
          setUploadError(uploadResult.error || 'Failed to upload image');
          setLoading(false);
          return;
        }
        photoUrl = uploadResult.url || '';
      }

      const mockFaceVector = `FACE_${formData.full_name.replace(/\s/g, '_')}_${Date.now()}`;
      const mockFingerprint = `FINGER_${formData.full_name.replace(/\s/g, '_')}_${Date.now()}`;

      const herderData = {
        ...formData,
        age: parseInt(formData.age),
        photo_url: photoUrl,
        face_vector: mockFaceVector,
        fingerprint_hash: mockFingerprint,
      };

      await herdersAPI.register(herderData);
      setSuccess(true);
      
      setTimeout(() => {
        setFormData({
          full_name: '',
          age: '',
          state_of_origin: '',
          phone_number: '',
          national_id: '',
        });
        setSelectedFile(null);
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputFields = [
    { name: 'full_name', label: 'Full Name', type: 'text', icon: User, required: true, placeholder: 'Enter full name' },
    { name: 'age', label: 'Age', type: 'number', icon: User, required: true, placeholder: 'Enter age' },
    { name: 'state_of_origin', label: 'State of Origin', type: 'text', icon: MapPin, required: true, placeholder: 'Enter state' },
    { name: 'phone_number', label: 'Phone Number', type: 'tel', icon: Phone, required: false, placeholder: '+234 xxx xxx xxxx' },
    { name: 'national_id', label: 'National ID', type: 'text', icon: CreditCard, required: false, placeholder: 'Enter national ID' },
  ];

  return (
    <Layout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Register New Herder
            </h1>
          </div>
          <p className="text-gray-500 ml-14">Add a new herder to the verification system</p>
        </div>

        <div className="max-w-4xl">
          <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
            {/* Success Message */}
            {success && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-full">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">Registration Successful!</p>
                    <p className="text-sm text-emerald-600">Herder has been registered with biometric data captured.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {(error || uploadError) && (
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-b border-red-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 rounded-full">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Registration Failed</p>
                    <p className="text-sm text-red-600">{uploadError || error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {inputFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.name} className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 outline-none"
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Photo Upload */}
                <PhotoUpload
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                  disabled={loading}
                />
              </div>

              {/* Biometric Info Card */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-xl p-6 mb-8 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Fingerprint className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Biometric Data Capture</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Mock biometric data including face vector and fingerprint hash will be automatically 
                      generated for this herder upon registration. In production, this would integrate with 
                      actual biometric capture devices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Register Herder</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
