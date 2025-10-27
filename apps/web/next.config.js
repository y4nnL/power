const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === "document" && request.url.includes("/athlete"),
      handler: "StaleWhileRevalidate"
    },
    {
      urlPattern: ({ request }) => request.destination === "document" && request.url.includes("/coach"),
      handler: "NetworkFirst",
      options: {
        networkTimeoutSeconds: 3
      }
    },
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30
        }
      }
    },
    {
      urlPattern: /\/api\/.*\/?$/,
      handler: "NetworkFirst",
      method: "GET",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
        backgroundSync: {
          name: "api-queue",
          options: {
            maxRetentionTime: 24 * 60
          }
        }
      }
    }
  ],
  workbox: {
    offlineGoogleAnalytics: true,
    navigateFallback: "/offline.html",
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true
  }
});

const config = {
  transpilePackages: ["@power/ui", "@power/utils", "@power/db"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    },
    instrumentationHook: true
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" }
    ]
  },
  poweredByHeader: false,
  sentry: {
    disableServerWebpackPlugin: false,
    disableClientWebpackPlugin: false
  }
};

module.exports = withPWA(config);
