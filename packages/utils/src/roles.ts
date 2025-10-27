export type AppRole = "COACH" | "ATHLETE";

export const rolePaths: Record<AppRole, string> = {
  COACH: "/coach",
  ATHLETE: "/athlete"
};

export function isCoach(role?: string | null): role is "COACH" {
  return role === "COACH";
}

export function isAthlete(role?: string | null): role is "ATHLETE" {
  return role === "ATHLETE";
}
