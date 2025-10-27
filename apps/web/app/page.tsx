import { currentUser, auth } from "@clerk/nextjs/server";
import { rolePaths } from "@power/utils";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();
  const session = auth();
  const role =
    (user?.publicMetadata as { role?: string })?.role ??
    (session?.sessionClaims?.publicMetadata as { role?: string })?.role ??
    session?.sessionClaims?.role;

  if (role && rolePaths[role as keyof typeof rolePaths]) {
    redirect(rolePaths[role as keyof typeof rolePaths]);
  }

  redirect("/coach");
}
