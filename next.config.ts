import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // If you specifically need to allow origins for Server Actions/Forms:
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.1.245", "localhost:3000"],
    },
  },
};

export default nextConfig;