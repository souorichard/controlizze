import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'cdn.jsdelivr.net',
      'avatars.githubusercontent.com',
      'localhost',
      's3.amazonaws.com',
    ],
  },
}

export default nextConfig
