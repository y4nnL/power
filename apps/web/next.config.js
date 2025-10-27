import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  customWorkerDir: "workers"
});

const nextConfig = {
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

export default withPWA(nextConfig);
