import { supabase } from './supabaseClient';

/**
 * Generate a public URL for an image stored in Supabase Storage
 * with basic transformation for size and quality.
 *
 * @param path Path to the image inside the storage bucket.
 * If a full URL is provided, it will be returned as-is.
 */
export function getPublicImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const [bucket, ...fileParts] = path.split('/');
  const filePath = fileParts.join('/');

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath, {
    transform: { width: 400, quality: 70 },
  });

  return data.publicUrl;
}

