import { BaseError } from "./base.error.js";

export class ServiceUnavailableError extends BaseError {
  readonly statusCode = 503;
  readonly isOperational = true;
}
