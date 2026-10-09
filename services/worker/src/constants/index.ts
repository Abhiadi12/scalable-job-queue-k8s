export const JOB_TYPES = ["primes"] as const;

export const JOB_STATUS = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const JOB_KEY_PREFIX = "job:";
export const JOB_TTL_SECONDS = 60 * 60;
export const MAX_RETRY_ATTEMPTS = 3;

export const PREFETCH_COUNT = 1;
export const REQUEUE_DELAY_MS = 1000;
export const DEFAULT_PRIME_LIMIT = 100_000;
