/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for Vercel deployment
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
}

module.exports = nextConfig

