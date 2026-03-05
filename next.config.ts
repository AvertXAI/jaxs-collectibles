import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Move this out of experimental for Next 16
  cacheComponents: false,

  experimental: {
    // VS Code might show red, but Next.js needs this for 192.168.1.245
    allowedDevOrigins: ["192.168.1.245", "localhost:3000"],
  },
};

export default nextConfig;