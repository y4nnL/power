self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const mutationQueueName = "mutation-queue";

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method === "POST" && request.url.includes("/api")) {
    event.respondWith(
      fetch(request.clone()).catch(async () => {
        const bgSync = await self.registration.sync.getTags();
        if (!bgSync.includes(mutationQueueName)) {
          await self.registration.sync.register(mutationQueueName);
        }
        const cache = await caches.open(mutationQueueName);
        const serializedHeaders = {};
        request.headers.forEach((value, key) => {
          serializedHeaders[key] = value;
        });
        const key = `${request.url}:${Date.now()}`;
        const bodyText = await request.clone().text();
        await cache.put(
          new Request(key),
          new Response(
            JSON.stringify({
              url: request.url,
              headers: serializedHeaders,
              body: bodyText
            }),
            { headers: { "Content-Type": "application/json" } }
          )
        );
        return new Response(JSON.stringify({ ok: false, queued: true }), {
          status: 202,
          headers: { "Content-Type": "application/json" }
        });
      })
    );
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === mutationQueueName) {
    event.waitUntil(flushMutationQueue());
  }
});

async function flushMutationQueue() {
  const cache = await caches.open(mutationQueueName);
  const requests = await cache.keys();
  await Promise.all(
    requests.map(async (request) => {
      const response = await cache.match(request);
      if (!response) return;
      try {
        const { url, headers, body } = await response.json();
        await fetch(url, {
          method: "POST",
          headers,
          body
        });
      } catch (error) {
        console.error("Failed to replay mutation", error);
      } finally {
        await cache.delete(request);
      }
    })
  );
}
