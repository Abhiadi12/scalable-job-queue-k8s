import { Router } from "express";
import { getMetrics, getStats } from "../controllers/stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/stats", getStats);
statsRouter.get("/metrics", getMetrics);
