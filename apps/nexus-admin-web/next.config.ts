import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mock-storage.provider.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
