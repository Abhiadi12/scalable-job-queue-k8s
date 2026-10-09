import { z } from "zod";
import { JOB_TYPES } from "../constants/index.js";

export const submitJobSchema = z.object({
  type: z.enum(JOB_TYPES).default("primes"),
  payload: z.record(z.string(), z.unknown()).default({}),
});
