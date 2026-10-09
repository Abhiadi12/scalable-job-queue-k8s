import type { JobHandler } from "../types/job-handler.js";
import type { JobType } from "../types/job.js";
import { primesHandler } from "./primes.handler.js";

export const jobHandlers: Record<JobType, JobHandler> = {
  primes: primesHandler,
};
