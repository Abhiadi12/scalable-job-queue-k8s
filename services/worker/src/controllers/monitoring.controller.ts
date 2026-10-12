import type { Request, Response } from "express";
import { container } from "../container.js";
import type { SuccessResponse } from "../types/api-response.js";

export async function getMetrics(_req: Request, res: Response): Promise<void> {
  res.type(container.metricsService.contentType).send(await container.metricsService.render());
}

export function getHealth(
  _req: Request,
  res: Response<SuccessResponse<{ status: "ok"; uptimeSeconds: number }>>,
): void {
  res.json({ success: true, data: { status: "ok", uptimeSeconds: Math.round(process.uptime()) } });
}
