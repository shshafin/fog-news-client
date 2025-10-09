/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["api2.tiresdash.com", "images.pexels.com"], // external domains
    deviceSizes: [320, 420, 768, 1024, 1200], // responsive sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // small icons
    unoptimized: true,
  },
};

export default nextConfig;
