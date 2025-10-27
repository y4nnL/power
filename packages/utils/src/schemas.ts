import { z } from "zod";

export const orgIdParam = z.string().min(1);
export const cuid = z.string().cuid();

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20)
});

export const programSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  orgId: orgIdParam.optional(),
  ownerId: cuid
});

export const phaseSchema = z.object({
  programId: cuid,
  name: z.string().min(1),
  order: z.number().int().min(0),
  description: z.string().optional()
});

export const workoutSchema = z.object({
  phaseId: cuid,
  name: z.string().min(1),
  sequence: z.number().int().min(0),
  notes: z.string().optional()
});

export const exerciseSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  equipment: z.string().optional(),
  description: z.string().optional(),
  orgId: z.string().optional()
});

export const setSchema = z.object({
  workoutId: cuid,
  exerciseId: cuid,
  order: z.number().int().min(0),
  targetReps: z.number().int().min(1).nullable().optional(),
  targetLoad: z.number().nullable().optional(),
  targetTempo: z.string().nullable().optional(),
  targetRpe: z.number().min(0).max(10).nullable().optional(),
  notes: z.string().nullable().optional()
});

export const assignmentSchema = z.object({
  programId: cuid,
  athleteId: cuid,
  startDate: z.string(),
  endDate: z.string().nullable().optional()
});

export const workoutLogSchema = z.object({
  setId: cuid,
  athleteId: cuid,
  assignmentId: cuid,
  performedReps: z.number().int().nullable().optional(),
  performedLoad: z.number().nullable().optional(),
  perceivedRpe: z.number().min(0).max(10).nullable().optional(),
  notes: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  offline: z.boolean().optional()
});

export const mediaSchema = z.object({
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  muxAssetId: z.string().optional(),
  muxPlaybackId: z.string().optional(),
  scope: z.enum(["PROGRAM", "WORKOUT", "WORKOUT_LOG", "PROFILE"]),
  ownerId: cuid,
  orgId: z.string().optional(),
  workoutLogId: cuid.optional(),
  exerciseId: cuid.optional(),
  programId: cuid.optional(),
  workoutId: cuid.optional()
});

export const subscriptionSchema = z.object({
  orgId: cuid,
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  status: z.enum(["INCOMPLETE", "ACTIVE", "PAST_DUE", "CANCELED", "TRIALING"]),
  currentPeriodEnd: z.string().optional()
});
