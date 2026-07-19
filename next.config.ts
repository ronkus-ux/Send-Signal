import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.20.10.2*'],
  typescript: {
    // This tells Vercel to bypass strict type errors and build anyway
    ignoreBuildErrors: true,
  },
};

export default nextConfig;