import { Router } from "express";
import { getHealth, getMetrics } from "../controllers/monitoring.controller.js";

export const monitoringRouter = Router();

monitoringRouter.get("/metrics", getMetrics);
monitoringRouter.get("/healthz", getHealth);
