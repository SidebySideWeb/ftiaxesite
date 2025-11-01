import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.log in production
  },
  // Optimize images
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Allow images from Payload CMS and Supabase Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images (for CMS media)
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Allow localhost for development
      },
    ],
  },
  // Production optimizations
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 16+
  
  // Experimental: Optimize CSS loading to reduce preload warnings
  experimental: {
    optimizeCss: true, // This can help reduce CSS preload warnings
  },
};

export default nextConfig;
