import { registerOTel } from "@vercel/otel";
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    registerOTel({
      serviceName: "power-web",
      exporters: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
        ? [
            {
              url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
              headers: process.env.OTEL_EXPORTER_OTLP_HEADERS
            }
          ]
        : []
    });
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: process.env.NODE_ENV === "development"
  });
}
