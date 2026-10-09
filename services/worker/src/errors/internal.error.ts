import { BaseError } from "./base.error.js";

export class InternalError extends BaseError {
  readonly isPermanent = false;
}
