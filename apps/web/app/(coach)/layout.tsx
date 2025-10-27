import { ReactNode } from "react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@power/ui";

export default async function CoachLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/coach" className="text-lg font-semibold text-brand-600">
            Power Coach
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/coach/programs">Programmes</Link>
            <Link href="/coach/clients">Clients</Link>
            <Link href="/coach/billing">Facturation</Link>
            <Link href="/coach/media">Médias</Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.emailAddresses[0]?.emailAddress}</span>
            <Button asChild variant="secondary">
              <Link href="/sign-out">Se déconnecter</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8">{children}</main>
    </div>
  );
}
