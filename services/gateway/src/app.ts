import express from "express";
import { JSON_BODY_LIMIT } from "./constants/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { jobRouter } from "./routes/job.routes.js";

export const app = express();

app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(jobRouter);
app.use(notFoundHandler);
app.use(errorHandler);
