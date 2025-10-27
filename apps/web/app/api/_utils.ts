import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@power/db";

export interface RequestContext {
  userId: string;
  clerkUserId: string;
  orgId: string;
  role: "COACH" | "ATHLETE";
}

export async function getContext(req: NextRequest): Promise<RequestContext> {
  const { userId, sessionClaims } = auth();
  if (!userId) {
    throw new Response(JSON.stringify({ error: "Unauthenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const role =
    (req.headers.get("x-user-role") as RequestContext["role"] | null) ??
    ((sessionClaims?.publicMetadata as { role?: string })?.role as RequestContext["role"]);

  const orgId =
    req.headers.get("x-org-id") ??
    ((sessionClaims?.publicMetadata as { orgId?: string })?.orgId ?? undefined);

  if (!orgId) {
    throw new Response(JSON.stringify({ error: "Organisation requise" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!role) {
    throw new Response(JSON.stringify({ error: "Role non autorisé" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    throw new Response(JSON.stringify({ error: "Utilisateur inconnu" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  return { userId: user.id, clerkUserId: userId, orgId, role };
}

export function requireCoach(context: RequestContext) {
  if (context.role !== "COACH") {
    throw new Response(JSON.stringify({ error: "Réservé aux coachs" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function ensureOrgAccess(orgId: string, clerkUserId: string) {
  const membership = await prisma.membership.findFirst({
    where: {
      orgId,
      user: { clerkUserId }
    }
  });

  if (!membership) {
    throw new Response(JSON.stringify({ error: "Accès refusé" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
}
