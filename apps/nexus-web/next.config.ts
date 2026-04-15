import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Enable gzip/brotli compression on HTTP responses — reduces payload sizes
  // and lowers memory pressure during response serialization.
  compress: true,

  images: {
    // Delegate image optimization to the CDN / reverse proxy instead of
    // running sharp inside the Next.js process. This is the single biggest
    // lever to prevent OOM in the image optimizer.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mock-storage.provider.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },

  experimental: {
    // Defer JS module preloading from server startup to first request.
    // Without this, Next.js eagerly loads ALL route bundles into memory when
    // the server starts — causing a large RAM spike that can OOM on low-memory
    // containers. With false, modules are loaded on-demand and memory grows
    // gradually instead of spiking at boot.
    preloadEntriesOnStart: false,

    // Enable filesystem caching for `next dev`
    turbopackFileSystemCacheForDev: true,
    // Enable filesystem caching for `next build`
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
