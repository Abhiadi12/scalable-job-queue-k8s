import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { healthRouter } from "./routes/health.routes.js";
import { statsRouter } from "./routes/stats.routes.js";

export const app = express();

app.use(healthRouter);
app.use(statsRouter);
app.use(notFoundHandler);
app.use(errorHandler);
