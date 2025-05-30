import withNextIntl from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Thêm option này
    poweredByHeader: false,
    reactStrictMode: true,
    images: {
      unoptimized: true,
      formats: ['image/avif', 'image/webp'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/v0/b/littlecrochet.appspot.com/**',
        },
        {
          protocol: 'https',
          hostname: 'tieuphuongcrochet.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'cdn.tieuphuongcrochet.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*.r2.dev',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*.r2.cloudflarestorage.com',
          pathname: '/**',
        }
      ],
    },
    // Thêm config cho static files
    async headers() {
      return [
        {
          source: '/:all*(svg|jpg|png|css|js)',
          locale: false,
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=2592000, immutable',
            },
          ],
        },
        {
          source: '/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: 'https://fonts.gstatic.com',
            }
          ]
        }
      ]
    }
  }

export default withNextIntl()(nextConfig);