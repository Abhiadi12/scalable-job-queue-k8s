import type { ChainableCommander, Redis } from "ioredis";
import {
  JOB_KEY_PREFIX,
  JOB_STATUS,
  JOB_TTL_SECONDS,
  STATS_FIELDS,
  STATS_KEY,
} from "../constants/index.js";

export class JobStoreService {
  constructor(private readonly redis: Redis) {}

  private key(id: string): string {
    return `${JOB_KEY_PREFIX}${id}`;
  }

  private update(id: string, fields: Record<string, string | number>): ChainableCommander {
    const key = this.key(id);
    return this.redis.multi().hset(key, fields).expire(key, JOB_TTL_SECONDS);
  }

  async markProcessing(id: string): Promise<void> {
    await this.update(id, { status: JOB_STATUS.PROCESSING, startedAt: Date.now() }).exec();
  }

  async markCompleted(id: string, result: unknown, durationMs: number): Promise<void> {
    await this.update(id, {
      status: JOB_STATUS.COMPLETED,
      result: JSON.stringify(result),
      durationMs,
      completedAt: Date.now(),
    })
      .hincrby(STATS_KEY, STATS_FIELDS.COMPLETED, 1)
      .hincrbyfloat(STATS_KEY, STATS_FIELDS.PROCESSING_TIME_MS, durationMs)
      .exec();
  }

  async markFailed(id: string, reason: string): Promise<void> {
    await this.update(id, { status: JOB_STATUS.FAILED, error: reason, completedAt: Date.now() })
      .hincrby(STATS_KEY, STATS_FIELDS.FAILED, 1)
      .exec();
  }
}
