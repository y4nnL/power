import "../styles/globals.css";

import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { PostHogProvider } from "./providers/posthog-provider";
import { TracingProvider } from "./providers/tracing-provider";

export const metadata: Metadata = {
  title: {
    default: "Power Coaching Platform",
    template: "%s | Power"
  },
  description: "Programmation sportive multi-tenant pour coachs et athlètes.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0ea5e9",
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
    apple: "/icons/icon-192.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="fr" suppressHydrationWarning>
        <body className="min-h-screen bg-slate-50 text-slate-900">
          <Suspense fallback={null}>
            <PostHogProvider>
              <TracingProvider>{children}</TracingProvider>
            </PostHogProvider>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
