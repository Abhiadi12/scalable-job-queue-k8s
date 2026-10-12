import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS, DEFAULT_BCRYPT_TEXT } from "../constants/index.js";
import { InvalidPayloadError } from "../errors/invalid-payload.error.js";
import type { JobHandler } from "../types/job-handler.js";

export const bcryptHandler: JobHandler = (payload) => {
  const text = payload.text ?? DEFAULT_BCRYPT_TEXT;
  if (typeof text !== "string") {
    throw new InvalidPayloadError('bcrypt payload "text" must be a string');
  }

  const hash = bcrypt.hashSync(text, BCRYPT_ROUNDS);
  return { rounds: BCRYPT_ROUNDS, hash };
};
