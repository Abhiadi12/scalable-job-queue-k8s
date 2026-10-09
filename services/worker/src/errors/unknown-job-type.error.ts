import { BaseError } from "./base.error.js";

export class UnknownJobTypeError extends BaseError {
  readonly isPermanent = true;
}
