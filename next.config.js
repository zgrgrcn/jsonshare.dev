const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next 13.4'te instrumentation.ts bu bayrak olmadan calismiyor.
    instrumentationHook: true,
  },
}

module.exports = withSentryConfig(nextConfig, {
  org: '1o1ai',
  project: 'jsonshare',
  // Kaynak haritasi yuklemek icin token gerekiyor; yoksa derleme sessizce devam etsin.
  silent: true,
  disableLogger: true,
  // Reklam engelleyicilerin Sentry isteklerini kesmemesi icin kendi alan adimizdan tunel.
  tunnelRoute: '/monitoring',
})
