'use client';

import { useRef, useState, useEffect } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface PhotoUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
  disabled?: boolean;
}

export default function PhotoUpload({
  onFileSelect,
  selectedFile,
  error,
  disabled = false,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Image must be less than 5MB';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        onFileSelect(null);
      } else {
        setValidationError(null);
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValidationError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = validationError || error;

  return (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Herder Photo
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        onClick={handleClick}
        className={`relative w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500 hover:bg-emerald-50/50'}
          ${displayError ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50'}
          ${previewUrl ? 'border-solid border-emerald-500' : ''}`}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-emerald-100 transition-colors">
              <Upload className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-medium text-gray-600">Click to upload photo</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP (max 5MB)</p>
          </div>
        )}
      </div>

      {displayError && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
