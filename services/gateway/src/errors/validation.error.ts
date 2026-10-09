import { BaseError } from "./base.error.js";

export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly isOperational = true;
}
