import type { JOB_STATUS, JOB_TYPES } from "../constants/index.js";

export type JobType = (typeof JOB_TYPES)[number];
export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
export type JobPayload = Record<string, unknown>;

/** What travels through RabbitMQ. */
export interface JobMessage {
  id: string;
  type: JobType;
  payload: JobPayload;
}

/** What is stored in Redis and returned by /status/:id. */
export interface JobRecord extends JobMessage {
  status: JobStatus;
  submittedAt: number;
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
  result?: unknown;
  error?: string;
}
