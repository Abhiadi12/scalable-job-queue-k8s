import { Router } from "express";
import { getLiveness, getReadiness } from "../controllers/health.controller.js";

export const healthRouter = Router();

healthRouter.get("/healthz", getLiveness);
healthRouter.get("/readyz", getReadiness);
