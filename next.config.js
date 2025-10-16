/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace firebase-admin with an empty module on the client side
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
