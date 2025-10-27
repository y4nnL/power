"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { useEffect } from "react";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!key) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      persistence: "memory"
    });
  }, []);

  if (!key) {
    return <>{children}</>;
  }

  return <Provider client={posthog}>{children}</Provider>;
}
