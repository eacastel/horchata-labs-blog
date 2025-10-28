// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
import { withBotId } from 'botid/next/config';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

// Base config
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [320, 640, 960, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96],
  },
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
      {
        source: '/terminos-y-condiciones-generales',
        destination: '/es/blog/terminos-y-condiciones-generales',
        permanent: true,
        locale: false,
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

const DISABLE_BOTID = process.env.NEXT_PUBLIC_DISABLE_BOTID === '1';

// Compose: next-intl always; BotID only when enabled
const withAll = (cfg) => (DISABLE_BOTID ? withNextIntl(cfg) : withNextIntl(withBotId(cfg)));

export default withAll(nextConfig);
