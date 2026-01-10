/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'standalone' output for Vercel deployment
  // output: 'standalone', // Only needed for Docker deployments
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: '**.worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: 'images.worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: 'static.worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: 'media.worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'archive.org',
      },
      {
        protocol: 'https',
        hostname: '**.archive.org',
      },
    ],
    unoptimized: true, 
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  trailingSlash: false,
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;