const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  customWorkerDir: "workers"
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
