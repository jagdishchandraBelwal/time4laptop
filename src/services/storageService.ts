import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Storage Service:
 * Handles uploading product images, banners, and condition proof photos to Supabase Storage.
 * Falls back safely to base64 if Supabase storage is not configured yet.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.warn('Supabase storage upload error, falling back to local reader:', error.message);
      } else if (data) {
        const { data: publicData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          return publicData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Storage upload exception:', err);
    }
  }

  // Fallback to local Data URL (Base64)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
