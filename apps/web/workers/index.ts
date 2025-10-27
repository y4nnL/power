/// <reference lib="webworker" />

import { clientsClaim, setCacheNameDetails } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<import("workbox-build").ManifestEntry>;
};

setCacheNameDetails({
  prefix: "power"
});

self.skipWaiting();
clientsClaim();

precacheAndRoute([
  ...self.__WB_MANIFEST,
  { url: "/offline.html", revision: "1" }
]);

const mutationQueue = new BackgroundSyncPlugin("mutations", {
  maxRetentionTime: 24 * 60
});

registerRoute(
  ({ request, url }) => request.method === "GET" && url.pathname.startsWith("/api"),
  new NetworkFirst({
    cacheName: "power-api",
    networkTimeoutSeconds: 5
  }),
  "GET"
);

registerRoute(
  ({ request, url }) =>
    request.destination === "document" && (url.pathname === "/athlete" || url.pathname.startsWith("/athlete/")),
  new StaleWhileRevalidate({ cacheName: "power-athlete-pages" })
);

registerRoute(
  ({ request, url }) =>
    request.destination === "document" && (url.pathname === "/coach" || url.pathname.startsWith("/coach/")),
  new NetworkFirst({ cacheName: "power-coach-pages", networkTimeoutSeconds: 3 })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "power-images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30
      })
    ]
  })
);

registerRoute(
  ({ request, url }) => request.method === "POST" && url.pathname.startsWith("/api"),
  new NetworkOnly({
    plugins: [mutationQueue]
  }),
  "POST"
);

setCatchHandler(async ({ event }) => {
  if (event.request.destination === "document") {
    const offlineFallback = await caches.match("/offline.html");
    if (offlineFallback) {
      return offlineFallback;
    }
    return Response.redirect("/offline.html");
  }

  return Response.error();
});

export {};
