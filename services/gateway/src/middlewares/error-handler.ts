import type { ErrorRequestHandler, RequestHandler } from "express";
import { env } from "../config/env.js";
import { BaseError } from "../errors/base.error.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import type { ErrorResponse } from "../types/api-response.js";
import { logger } from "../utils/logger.js";

const GENERIC_MESSAGE = "Internal server error";

export const notFoundHandler: RequestHandler = (req) => {
  throw new NotFoundError(`Route ${req.method} ${req.path} not found`);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // express.json() reports a malformed body as a SyntaxError carrying status 400.
  const error =
    err instanceof SyntaxError && "status" in err && err.status === 400
      ? new ValidationError("Malformed JSON body")
      : err;

  if (error instanceof BaseError && error.isOperational) {
    const body: ErrorResponse = {
      success: false,
      error: { message: error.message, details: error.details },
    };
    res.status(error.statusCode).json(body);
    return;
  }

  logger.error({ err: error }, "Unhandled error");
  const statusCode = error instanceof BaseError ? error.statusCode : 500;
  const message =
    env.NODE_ENV === "production" || !(error instanceof Error) ? GENERIC_MESSAGE : error.message;
  const body: ErrorResponse = { success: false, error: { message } };
  res.status(statusCode).json(body);
};
