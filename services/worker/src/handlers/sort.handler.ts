import { DEFAULT_SORT_SIZE, SORT_MAX_VALUE } from "../constants/index.js";
import { InvalidPayloadError } from "../errors/invalid-payload.error.js";
import type { JobHandler } from "../types/job-handler.js";

export const sortHandler: JobHandler = (payload) => {
  const size = payload.size ?? DEFAULT_SORT_SIZE;
  if (typeof size !== "number" || !Number.isInteger(size) || size < 1) {
    throw new InvalidPayloadError('sort payload "size" must be a positive integer');
  }

  const numbers = Array.from({ length: size }, () => Math.floor(Math.random() * SORT_MAX_VALUE));
  numbers.sort((a, b) => a - b);

  return {
    size,
    min: numbers[0],
    median: numbers[Math.floor(size / 2)],
    max: numbers[size - 1],
  };
};
