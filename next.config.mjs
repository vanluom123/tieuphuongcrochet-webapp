import withNextIntl from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Thêm option này
    poweredByHeader: false,
    reactStrictMode: true,
    images: {
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
            },
          ],
        },
      ]
    }
  }

export default withNextIntl()(nextConfig);