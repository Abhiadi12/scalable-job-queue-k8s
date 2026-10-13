import { Router } from "express";
import { getHealth, getMetrics, getStats } from "../controllers/stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/stats", getStats);
statsRouter.get("/metrics", getMetrics);
statsRouter.get("/healthz", getHealth);
