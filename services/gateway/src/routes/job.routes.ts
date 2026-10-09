import { Router } from "express";
import { getJobStatus, submitJob } from "../controllers/job.controller.js";

export const jobRouter = Router();

jobRouter.post("/submit", submitJob);
jobRouter.get("/status/:id", getJobStatus);
