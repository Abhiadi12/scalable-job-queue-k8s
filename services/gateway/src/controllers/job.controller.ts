import type { Request, Response } from "express";
import { z } from "zod";
import { container } from "../container.js";
import { ValidationError } from "../errors/validation.error.js";
import type { SuccessResponse } from "../types/api-response.js";
import type { JobRecord } from "../types/job.js";
import { submitJobSchema } from "../validators/job.validator.js";

export async function submitJob(
  req: Request,
  res: Response<SuccessResponse<Pick<JobRecord, "id" | "status">>>,
): Promise<void> {
  const parsed = submitJobSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    throw new ValidationError("Invalid job submission", z.flattenError(parsed.error).fieldErrors);
  }

  const job = await container.jobService.submit(parsed.data.type, parsed.data.payload);
  // 202 Accepted: the work is queued, not done.
  res.status(202).json({ success: true, data: job });
}

export async function getJobStatus(
  req: Request<{ id: string }>,
  res: Response<SuccessResponse<JobRecord>>,
): Promise<void> {
  const job = await container.jobService.getStatus(req.params.id);
  res.json({ success: true, data: job });
}
