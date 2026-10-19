import type { Request, Response } from "express";
import { container } from "../container.js";
import type { SuccessResponse } from "../types/api-response.js";
import type { Stats } from "../types/stats.js";

export async function getStats(_req: Request, res: Response<SuccessResponse<Stats>>): Promise<void> {
  res.json({ success: true, data: await container.statsService.getStats() });
}

export async function getMetrics(_req: Request, res: Response): Promise<void> {
  res.type(container.metricsService.contentType).send(await container.metricsService.render());
}
