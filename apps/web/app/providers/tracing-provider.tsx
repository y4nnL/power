"use client";

import { createContext, useContext, useEffect } from "react";
import { captureException } from "@sentry/nextjs";

declare global {
  interface Window {
    posthog?: { capture: (event: string, payload?: Record<string, unknown>) => void };
  }
}

interface TracingContextValue {
  track: (event: string, payload?: Record<string, unknown>) => void;
}

const TracingContext = createContext<TracingContextValue>({
  track: () => {}
});

export function TracingProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LOGTAIL_TOKEN) {
      import("@logtail/browser").then(({ Logtail }) => {
        const logtail = new Logtail(process.env.NEXT_PUBLIC_LOGTAIL_TOKEN!);
        TracingContextValueSingleton.log = (message, payload) => logtail.log(message, payload);
      });
    }
  }, []);

  const value: TracingContextValue = {
    track: (event, payload) => {
      if (typeof window !== "undefined" && window.posthog) {
        window.posthog.capture(event, payload);
      }
      try {
        TracingContextValueSingleton.log(event, payload);
      } catch (error) {
        captureException(error);
      }
    }
  };

  return <TracingContext.Provider value={value}>{children}</TracingContext.Provider>;
}

const TracingContextValueSingleton: { log: (message: string, payload?: Record<string, unknown>) => void } = {
  log: () => {}
};

export function useTracing() {
  return useContext(TracingContext);
}
