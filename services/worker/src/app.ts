import express from "express";
import { monitoringRouter } from "./routes/monitoring.routes.js";

export const app = express();

app.use(monitoringRouter);
