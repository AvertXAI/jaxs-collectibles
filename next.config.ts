import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        // THE FIX: Authorize Unsplash for the Construction page
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.1.245", "localhost:3000", "ecommerce.avertxai.com"],
    },
  },
};

export default nextConfig;