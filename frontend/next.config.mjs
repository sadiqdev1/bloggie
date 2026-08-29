/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ['192.168.10.232'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;