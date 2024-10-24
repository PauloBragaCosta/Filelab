/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.pexels.com', 'avatars.githubusercontent.com'],
    },
    async rewrites() {
      return [
        {
          source: '/api/processimage',
          destination: 'http://127.0.0.1:8000/api/processimage',
        },
      ]
    },
  }

module.exports = nextConfig


