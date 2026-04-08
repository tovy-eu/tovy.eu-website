/**
 * @fileOverview Custom Image Loader for Tovy.
 * Enables optimized image delivery via Cloudinary for Next.js static exports.
 */

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's a relative path (placeholder or local asset)
  if (src.startsWith('/')) {
    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
    return `https://res.cloudinary.com/tovy-demo/image/upload/${params.join(',')}${src}`;
  }
  
  // Return external URLs as is, or you could proxy them through your CDN
  return src;
}
