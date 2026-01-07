/**
 * Storage service for uploading files to Supabase Storage
 */
import { supabase } from './supabase';

const BUCKET_NAME = 'Agro';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Generate a unique filename for herder photos
 */
function generateUniqueFilename(file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  return `herder_${timestamp}_${randomString}.${extension}`;
}

/**
 * Upload a herder photo to Supabase Storage
 */
export async function uploadHerderPhoto(file: File): Promise<UploadResult> {
  try {
    const filename = generateUniqueFilename(file);
    const filePath = `herder-photos/${filename}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to upload image',
    };
  }
}
