import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF zuerst – ~30-50 % kleiner als WebP; WebP als Fallback.
    formats: ["image/avif", "image/webp"],
    // Next 16 erfordert eine Allowlist für genutzte quality-Werte.
    qualities: [65, 75, 80, 85],
    // Weniger Größenvarianten = weniger CPU-teure AVIF-Encodes auf dem schwachen
    // Shared-Host (Default sind 8 deviceSizes + 8 imageSizes).
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [256, 384],
    // Einmal encodierte Varianten möglichst lange behalten (1 Jahr).
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
