import { DEFAULT_PRIME_LIMIT } from "../constants/index.js";
import type { JobHandler } from "../types/job-handler.js";

export const primesHandler: JobHandler = (payload) => {
  const limit = typeof payload.limit === "number" ? payload.limit : DEFAULT_PRIME_LIMIT;

  let primeCount = 0;
  for (let n = 2; n < limit; n += 1) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d += 1) {
      if (n % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primeCount += 1;
  }

  return { limit, primeCount };
};
