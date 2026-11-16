/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Redirige /api/... del frontend al backend automáticamente
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.URL_SERVIDOR}/api/:path*`
      }
    ];
  }
};

module.exports = nextConfig;