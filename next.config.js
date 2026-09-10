const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
}

module.exports = withSentryConfig(nextConfig, {
  org: 'ozgur-gurcan',
  project: 'json-share',
  // Kaynak haritasi yuklemek icin token gerekiyor; yoksa derleme sessizce devam etsin.
  silent: true,
  disableLogger: true,
  // Reklam engelleyicilerin Sentry isteklerini kesmemesi icin kendi alan adimizdan tunel.
  tunnelRoute: '/monitoring',
})
