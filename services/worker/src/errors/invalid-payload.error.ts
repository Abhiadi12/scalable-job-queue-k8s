import { BaseError } from "./base.error.js";

export class InvalidPayloadError extends BaseError {
  readonly isPermanent = true;
}
