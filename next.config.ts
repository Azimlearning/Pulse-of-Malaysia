import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output as a standard Next.js app (not static export) to support
  // Vercel's edge network and image optimization
  output: "standalone",

  // Image optimization — allow serving logos from the /logos path
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Suppress the workspace root warning (caused by a parent package-lock.json)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
