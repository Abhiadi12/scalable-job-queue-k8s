import type { JobPayload } from "./job.js";

export type JobHandler = (payload: JobPayload) => unknown;
