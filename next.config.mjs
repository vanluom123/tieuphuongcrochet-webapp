import withNextIntl from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Thêm option này
    poweredByHeader: false,
    reactStrictMode: true,
    images: {
      domains: ['your-domain.com'],
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
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ]
    }
  }
  
export default withNextIntl()(nextConfig);