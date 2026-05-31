import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF zuerst – ~30-50 % kleiner als WebP; WebP als Fallback.
    formats: ["image/avif", "image/webp"],
    // Next 16 erfordert eine Allowlist für genutzte quality-Werte.
    qualities: [65, 75, 85, 90, 95],
  },
};

export default nextConfig;
