import { Router } from "express";
import { getLiveness, getMetrics, getReadiness } from "../controllers/monitoring.controller.js";

export const monitoringRouter = Router();

monitoringRouter.get("/metrics", getMetrics);
monitoringRouter.get("/healthz", getLiveness);
monitoringRouter.get("/readyz", getReadiness);
