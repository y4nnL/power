"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Card, Button } from "@power/ui";

type MediaItem = {
  id: string;
  title: string;
  createdAt: string;
  playbackId?: string | null;
  url: string;
  scope: string;
  thumbnail?: string | null;
};

const MuxPlayer = dynamic(() => import("@mux/mux-player-react").then((mod) => mod.MuxPlayer), {
  ssr: false
});

interface MediaGalleryProps {
  items: MediaItem[];
}

export function MediaGallery({ items }: MediaGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const activeItem = useMemo(() => items.find((item) => item.id === activeId) ?? items[0], [items, activeId]);

  if (!items.length) {
    return <p className="text-sm text-slate-400">Aucun média disponible pour le moment.</p>;
  }

  return (
    <div className="space-y-6">
      {activeItem ? (
        <Card
          title={activeItem.title}
          description={new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short"
          }).format(new Date(activeItem.createdAt))}
          className="bg-slate-900/40 text-white"
          contentClassName="space-y-4 text-white"
        >
          {activeItem.playbackId ? (
            <MuxPlayer
              playbackId={activeItem.playbackId}
              accentColor="#0ea5e9"
              metadata={{
                video_title: activeItem.title,
                viewer_user_id: "athlete"
              }}
              thumbnailTime={0}
            />
          ) : (
            <video controls poster={activeItem.thumbnail ?? undefined} className="w-full rounded-lg">
              <source src={activeItem.url} />
            </video>
          )}
        </Card>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            description={item.scope}
            className="bg-slate-900/20 text-white"
            contentClassName="text-white"
          >
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-300">{new Date(item.createdAt).toLocaleString()}</p>
              <Button
                variant={activeId === item.id ? "default" : "secondary"}
                onClick={() => setActiveId(item.id)}
              >
                {activeId === item.id ? "En lecture" : "Lire"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
