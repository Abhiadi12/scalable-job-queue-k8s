import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { statsRouter } from "./routes/stats.routes.js";

export const app = express();

app.use(statsRouter);
app.use(notFoundHandler);
app.use(errorHandler);
