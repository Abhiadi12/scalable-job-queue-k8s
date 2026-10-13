export const STATS_KEY = "stats:jobs";
export const STATS_FIELDS = {
  SUBMITTED: "submitted",
  COMPLETED: "completed",
  FAILED: "failed",
  PROCESSING_TIME_MS: "processingTimeMs",
} as const;

export const MAX_RETRY_ATTEMPTS = 3;
