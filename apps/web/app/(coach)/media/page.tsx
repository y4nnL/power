import { prisma } from "@power/db";
import { Card, Button } from "@power/ui";
import Link from "next/link";
import { headers } from "next/headers";

export default async function MediaLibraryPage() {
  const orgId = headers().get("x-org-id");
  const media = await prisma.media.findMany({
    where: orgId ? { orgId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Bibliothèque média</h1>
          <p className="text-slate-500">Centralisez vos vidéos d'exécution et contenus pédagogiques.</p>
        </div>
        <Button asChild>
          <Link href="/coach/media/upload">Uploader une vidéo</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {media.map((item) => (
          <Card key={item.id} title={item.scope} description={item.createdAt.toLocaleString()}>
            <p className="text-sm text-slate-600">Asset Mux: {item.muxPlaybackId ?? "en cours"}</p>
          </Card>
        ))}
        {media.length === 0 && <p className="text-slate-500">Aucun média disponible pour le moment.</p>}
      </div>
    </div>
  );
}
