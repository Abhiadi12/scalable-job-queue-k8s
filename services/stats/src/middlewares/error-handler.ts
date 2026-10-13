import type { ErrorRequestHandler, RequestHandler } from "express";
import { env } from "../config/env.js";
import { BaseError } from "../errors/base.error.js";
import { NotFoundError } from "../errors/not-found.error.js";
import type { ErrorResponse } from "../types/api-response.js";
import { logger } from "../utils/logger.js";

const GENERIC_MESSAGE = "Internal server error";

export const notFoundHandler: RequestHandler = (req) => {
  throw new NotFoundError(`Route ${req.method} ${req.path} not found`);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BaseError && err.isOperational) {
    const body: ErrorResponse = {
      success: false,
      error: { message: err.message, details: err.details },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  logger.error({ err }, "Unhandled error");
  const statusCode = err instanceof BaseError ? err.statusCode : 500;
  const message =
    env.NODE_ENV === "production" || !(err instanceof Error) ? GENERIC_MESSAGE : err.message;
  const body: ErrorResponse = { success: false, error: { message } };
  res.status(statusCode).json(body);
};
