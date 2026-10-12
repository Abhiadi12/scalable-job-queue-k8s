import type { JobHandler } from "../types/job-handler.js";
import type { JobType } from "../types/job.js";
import { bcryptHandler } from "./bcrypt.handler.js";
import { primesHandler } from "./primes.handler.js";
import { sortHandler } from "./sort.handler.js";

export const jobHandlers: Record<JobType, JobHandler> = {
  primes: primesHandler,
  bcrypt: bcryptHandler,
  sort: sortHandler,
};
