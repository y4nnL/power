import { currentUser } from "@clerk/nextjs/server";
import { Prisma, prisma } from "@power/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MediaGallery } from "./media-gallery";

export default async function AthleteMediaPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: { athleteProfile: true }
  });

  if (!dbUser?.athleteProfile) {
    redirect("/coach");
  }

  const orgId = headers().get("x-org-id") ?? undefined;

  const mediaFilters: Prisma.MediaWhereInput[] = [
    { ownerId: dbUser.id },
    { workoutLog: { athleteId: dbUser.athleteProfile.id } }
  ];

  if (orgId) {
    mediaFilters.push({ orgId, scope: { in: ["PROGRAM", "WORKOUT"] } });
  }

  const media = await prisma.media.findMany({
    where: { OR: mediaFilters },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      muxPlaybackId: true,
      url: true,
      createdAt: true,
      scope: true,
      thumbnail: true,
      workout: { select: { name: true } },
      program: { select: { name: true } },
      workoutLog: { select: { notes: true } }
    }
  });

  const items = media.map((item) => ({
    id: item.id,
    playbackId: item.muxPlaybackId,
    url: item.url,
    createdAt: item.createdAt.toISOString(),
    scope: item.scope,
    thumbnail: item.thumbnail,
    title: item.workout?.name ?? item.program?.name ?? item.workoutLog?.notes ?? "Vidéo partagée"
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-white">Vidéos & médias</h1>
        <p className="mt-1 text-sm text-slate-300">
          Accédez à vos tutoriels, replays de séances et contenus partagés par votre coach même hors-ligne.
        </p>
      </header>
      <MediaGallery items={items} />
    </div>
  );
}
