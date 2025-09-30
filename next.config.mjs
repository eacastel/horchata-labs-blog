// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Tell the plugin where your request config lives (inside app/)
const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {serverActions: {bodySizeLimit: '2mb'}},
  reactStrictMode: true
};

export default withNextIntl(nextConfig);
