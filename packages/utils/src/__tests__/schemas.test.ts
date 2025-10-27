import { describe, expect, it } from "vitest";
import {
  assignmentSchema,
  cuid,
  exerciseSchema,
  mediaSchema,
  orgIdParam,
  paginationSchema,
  phaseSchema,
  programSchema,
  setSchema,
  subscriptionSchema,
  workoutLogSchema,
  workoutSchema
} from "../schemas";

describe("schema validations", () => {
  it("validates identifiers", () => {
    const orgResult = orgIdParam.safeParse("org_123");
    expect(orgResult.success).toBe(true);

    const cuidResult = cuid.safeParse("ckvt12abc0000000000000000");
    expect(cuidResult.success).toBe(true);
  });

  it("enforces pagination defaults and limits", () => {
    const page = paginationSchema.parse({});
    expect(page).toEqual({ limit: 20 });

    expect(() => paginationSchema.parse({ limit: 500 })).toThrow();
  });

  it("parses program data", () => {
    const data = programSchema.parse({
      name: "In-Season Strength",
      description: "Focus on power output",
      ownerId: "ckvt12abc0000000000000000"
    });

    expect(data).toMatchObject({ name: "In-Season Strength" });
  });

  it("requires non-negative phase order", () => {
    expect(() =>
      phaseSchema.parse({
        programId: "ckvt12abc0000000000000000",
        name: "Week 1",
        order: -1
      })
    ).toThrow();
  });

  it("parses workouts and sets", () => {
    const workout = workoutSchema.parse({
      phaseId: "ckvt12abc0000000000000000",
      name: "Day 1",
      sequence: 0
    });

    expect(workout.sequence).toBe(0);

    const set = setSchema.parse({
      workoutId: "ckvt12abc0000000000000000",
      exerciseId: "ckvt12abc0000000000000000",
      order: 0,
      targetReps: 5,
      targetLoad: 80,
      targetTempo: "30X0",
      targetRpe: 8,
      notes: "Explosive"
    });

    expect(set).toMatchObject({ targetRpe: 8 });
  });

  it("validates exercise catalog entries", () => {
    const exercise = exerciseSchema.parse({ name: "Back Squat" });
    expect(exercise.name).toBe("Back Squat");
  });

  it("captures assignment window", () => {
    const assignment = assignmentSchema.parse({
      programId: "ckvt12abc0000000000000000",
      athleteId: "ckvt12abc0000000000000000",
      startDate: "2024-01-01",
      endDate: null
    });

    expect(assignment.endDate).toBeNull();
  });

  it("parses workout logs including offline flag", () => {
    const log = workoutLogSchema.parse({
      setId: "ckvt12abc0000000000000000",
      athleteId: "ckvt12abc0000000000000000",
      assignmentId: "ckvt12abc0000000000000000",
      performedReps: 5,
      performedLoad: 90,
      perceivedRpe: 8,
      notes: "Felt strong",
      offline: true
    });

    expect(log.offline).toBe(true);
  });

  it("supports media metadata variations", () => {
    const media = mediaSchema.parse({
      url: "https://cdn.example.com/video.mp4",
      scope: "WORKOUT",
      ownerId: "ckvt12abc0000000000000000"
    });

    expect(media.scope).toBe("WORKOUT");
  });

  it("parses subscription payloads", () => {
    const subscription = subscriptionSchema.parse({
      orgId: "ckvt12abc0000000000000000",
      stripeCustomerId: "cus_123", 
      stripeSubscriptionId: "sub_123",
      status: "ACTIVE"
    });

    expect(subscription.status).toBe("ACTIVE");
  });
});
