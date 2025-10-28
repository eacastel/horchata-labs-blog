import createNextIntlPlugin from 'next-intl/plugin';
import { withBotId } from 'botid/next/config';

// Path to your i18n config
const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
  reactStrictMode: true,

  // ✅ Automatic image optimization options
  images: {
    formats: ['image/avif', 'image/webp'], // modern formats
    minimumCacheTTL: 60,                   // cache for 60 seconds (adjust if needed)
    deviceSizes: [320, 640, 960, 1200, 1600], // responsive sizes Next.js will generate
    imageSizes: [16, 32, 48, 64, 96],      // for small inline images (like logos)
  },
  // ✅ Add redirects here
  async redirects() {
    return [
      {
        source: '/:locale(es|en)/terminos-y-condiciones-generales',
        destination: '/:locale/blog/terminos-y-condiciones-generales',
        permanent: true,
      },
      {
        source: '/:locale(es|en)/terminos-y-condiciones-generales/',
        destination: '/:locale/blog/terminos-y-condiciones-generales',
        permanent: true,
      },

      // Root (no locale) → force Spanish blog slug
      {
        source: '/terminos-y-condiciones-generales',
        destination: '/es/blog/terminos-y-condiciones-generales',
        permanent: true,
        locale: false, // <- critical: don't auto-add /es here
      },
      {
        source: '/terminos-y-condiciones-generales/',
        destination: '/es/blog/terminos-y-condiciones-generales',
        permanent: true,
        locale: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
