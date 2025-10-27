import { ReactNode } from "react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@power/ui";

export default async function AthleteLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/athlete" className="text-lg font-semibold text-white">
            Power Athlete
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/athlete/workouts">Workouts</Link>
            <Link href="/athlete/live">Live</Link>
            <Link href="/athlete/media">Vidéos</Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{user?.firstName}</span>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/sign-out">Quitter</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-6">{children}</main>
    </div>
  );
}
