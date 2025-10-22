
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://sebastian-judicative-valorie.ngrok-free.dev/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
