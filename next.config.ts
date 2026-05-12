import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Cleans up chunk graph on each build — prevents stale module errors in production
  generateBuildId: async () => `build-${Date.now()}`,
}

export default nextConfig
