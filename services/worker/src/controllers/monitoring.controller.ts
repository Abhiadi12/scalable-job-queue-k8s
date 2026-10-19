import type { Request, Response } from "express";
import { container } from "../container.js";
import type { ApiResponse, SuccessResponse } from "../types/api-response.js";
import type { Liveness, Readiness } from "../types/health.js";

export async function getMetrics(_req: Request, res: Response): Promise<void> {
  res.type(container.metricsService.contentType).send(await container.metricsService.render());
}

export function getLiveness(_req: Request, res: Response<SuccessResponse<Liveness>>): void {
  res.json({ success: true, data: container.healthService.liveness() });
}

export function getReadiness(_req: Request, res: Response<ApiResponse<Readiness>>): void {
  const readiness = container.healthService.readiness();
  if (!readiness.ready) {
    res
      .status(503)
      .json({ success: false, error: { message: "Service not ready", details: readiness.checks } });
    return;
  }
  res.json({ success: true, data: readiness });
}
