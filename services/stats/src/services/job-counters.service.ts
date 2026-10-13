import type { Redis } from "ioredis";
import { STATS_FIELDS, STATS_KEY } from "../constants/index.js";
import type { JobCounters } from "../types/stats.js";

export class JobCountersService {
  constructor(private readonly redis: Redis) {}

  async getCounters(): Promise<JobCounters> {
    const hash = await this.redis.hgetall(STATS_KEY);
    return {
      submitted: Number(hash[STATS_FIELDS.SUBMITTED] ?? 0),
      completed: Number(hash[STATS_FIELDS.COMPLETED] ?? 0),
      failed: Number(hash[STATS_FIELDS.FAILED] ?? 0),
      processingTimeMs: Number(hash[STATS_FIELDS.PROCESSING_TIME_MS] ?? 0),
    };
  }
}
