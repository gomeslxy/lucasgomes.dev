import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep a production preview independent of an existing local dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
