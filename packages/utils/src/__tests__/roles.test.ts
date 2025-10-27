import { describe, expect, it } from "vitest";
import { isAthlete, isCoach, rolePaths } from "../roles";

describe("role helpers", () => {
  it("maps each role to the correct path", () => {
    expect(rolePaths).toEqual({
      COACH: "/coach",
      ATHLETE: "/athlete"
    });
  });

  it("identifies coaches accurately", () => {
    expect(isCoach("COACH")).toBe(true);
    expect(isCoach("ATHLETE")).toBe(false);
    expect(isCoach(null)).toBe(false);
  });

  it("identifies athletes accurately", () => {
    expect(isAthlete("ATHLETE")).toBe(true);
    expect(isAthlete("COACH")).toBe(false);
    expect(isAthlete(undefined)).toBe(false);
  });
});
