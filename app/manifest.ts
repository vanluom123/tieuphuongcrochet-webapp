import type { MetadataRoute } from 'next'


export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tiểu Phương Crochet',
    short_name: 'Tiểu Phương Crochet',
    description: 'Free crochet patterns',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fc8282',
    icons: [
      {
        src: '/favicon.ico',
        sizes: "64x64 32x32 24x24 16x16",
        type: 'image/x-icon',
      },
      {
        src: '/logo192.png',
        type: 'image/png',
        sizes: '192x192'
      },
      {
        src: '/logo512.png',
        type: 'image/png',
        sizes: '512x512'
      }
    ],
  }
}
