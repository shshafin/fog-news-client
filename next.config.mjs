/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "api2.tiresdash.com",
      "newsportal.marcelinestudios.com:5001",
      "images.pexels.com",
    ], // external domains
    deviceSizes: [320, 420, 768, 1024, 1200], // responsive sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // small icons
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend e je route call korbe
        destination: "http://newsportal.marcelinestudios.com:5001/api/:path*", // backend HTTP
      },
    ];
  },
};

export default nextConfig;
