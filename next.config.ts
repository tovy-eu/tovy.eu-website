import type {NextConfig} from 'next';

const devOrigin = process.env.CWD_HOST_URL ? new URL(process.env.CWD_HOST_URL).hostname : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: devOrigin ? [devOrigin] : ["*.cloudworkstations.dev"],
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
