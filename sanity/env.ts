/**
 * Sanity is optional at build time. Until a project exists, `configured` is
 * false: every query short-circuits to empty, S5 renders nothing, and /studio
 * shows setup instructions instead of crashing the build.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-01-01";
export const configured = projectId.length > 0;
