import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Image optimization requires a Node.js server; use unoptimized for Cloudflare Pages
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'crests.football-data.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.football-data.org' },
    ],
  },
};

export default nextConfig;
