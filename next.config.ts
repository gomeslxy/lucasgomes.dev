import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep a production preview independent of an existing local dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85, 90],
  },
};

export default nextConfig;
