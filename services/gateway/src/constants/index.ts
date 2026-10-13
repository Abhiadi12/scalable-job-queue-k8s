export const JOB_TYPES = ["primes", "bcrypt", "sort"] as const;

export const JOB_STATUS = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const JOB_KEY_PREFIX = "job:";
export const JOB_TTL_SECONDS = 60 * 60;
export const MAX_RETRY_ATTEMPTS = 3;
export const JSON_BODY_LIMIT = "100kb";

export const STATS_KEY = "stats:jobs";
export const STATS_FIELDS = {
  SUBMITTED: "submitted",
  COMPLETED: "completed",
  FAILED: "failed",
  PROCESSING_TIME_MS: "processingTimeMs",
} as const;
