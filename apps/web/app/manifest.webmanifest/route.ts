import { NextRequest, NextResponse } from "next/server";

type Audience = "coach" | "athlete";

function resolveAudience(search: URLSearchParams): Audience {
  const requested = search.get("audience");
  return requested === "athlete" ? "athlete" : "coach";
}

const baseManifest = {
  background_color: "#0f172a",
  theme_color: "#0ea5e9",
  display: "standalone",
  scope: "/",
  icons: [
    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
  ],
  screenshots: [] as unknown[]
};

const audienceMetadata: Record<Audience, { name: string; short: string; startUrl: string; description: string }> = {
  coach: {
    name: "Power Coach",
    short: "Coach",
    startUrl: "/coach",
    description: "Pilotage complet des programmes, clients et facturation Power."
  },
  athlete: {
    name: "Power Athlete",
    short: "Athlete",
    startUrl: "/athlete",
    description: "Suivez vos séances, vidéos et logs même hors-ligne avec Power."
  }
};

export function GET(request: NextRequest) {
  const audience = resolveAudience(request.nextUrl.searchParams);
  const manifest = {
    ...baseManifest,
    name: audienceMetadata[audience].name,
    short_name: audienceMetadata[audience].short,
    description: audienceMetadata[audience].description,
    start_url: `${audienceMetadata[audience].startUrl}?utm_source=pwa`,
    shortcuts: [
      {
        name: "Espace coach",
        url: "/coach",
        description: "Accéder au tableau de bord coach"
      },
      {
        name: "Espace athlète",
        url: "/athlete",
        description: "Reprendre un entraînement"
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600, must-revalidate"
    }
  });
}
