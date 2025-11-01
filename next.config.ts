import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  allowedDevOrigins: ["http://localhost:3000","http://192.168.6.144:3000","http://192.168.200.92:3000"],
};

export default nextConfig;
