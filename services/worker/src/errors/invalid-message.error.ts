import { BaseError } from "./base.error.js";

export class InvalidMessageError extends BaseError {
  readonly isPermanent = true;
}
