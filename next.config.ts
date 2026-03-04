import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Corrected property name for Next.js 16
    allowedRevalidateHeaderKeys: ["192.168.1.245", "localhost:3000"],
    // Keeping this false to allow your Sanity dynamic fetching
    cacheComponents: false,
  },
};

export default nextConfig;