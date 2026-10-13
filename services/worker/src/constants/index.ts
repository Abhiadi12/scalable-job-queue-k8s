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

export const STATS_KEY = "stats:jobs";
export const STATS_FIELDS = {
  SUBMITTED: "submitted",
  COMPLETED: "completed",
  FAILED: "failed",
  PROCESSING_TIME_MS: "processingTimeMs",
} as const;

export const PREFETCH_COUNT = 1;
export const REQUEUE_DELAY_MS = 1000;
export const DEFAULT_PRIME_LIMIT = 100_000;
export const BCRYPT_ROUNDS = 10;
export const DEFAULT_BCRYPT_TEXT = "correct horse battery staple";
export const DEFAULT_SORT_SIZE = 100_000;
export const SORT_MAX_VALUE = 1_000_000;

export const JOB_DURATION_BUCKETS_SECONDS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
export const INVALID_JOB_TYPE_LABEL = "invalid";
