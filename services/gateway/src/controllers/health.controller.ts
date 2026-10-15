import type { Request, Response } from "express";
import { container } from "../container.js";
import { ServiceUnavailableError } from "../errors/service-unavailable.error.js";
import type { SuccessResponse } from "../types/api-response.js";
import type { Liveness, Readiness } from "../types/health.js";

export function getLiveness(_req: Request, res: Response<SuccessResponse<Liveness>>): void {
  res.json({ success: true, data: container.healthService.liveness() });
}

export function getReadiness(_req: Request, res: Response<SuccessResponse<Readiness>>): void {
  const readiness = container.healthService.readiness();
  if (!readiness.ready) throw new ServiceUnavailableError("Service not ready", readiness.checks);
  res.json({ success: true, data: readiness });
}
