import type { Redis } from "ioredis";
import { JOB_KEY_PREFIX, JOB_STATUS, JOB_TTL_SECONDS } from "../constants/index.js";
import type { JobMessage, JobRecord, JobStatus, JobType } from "../types/job.js";

const toNumber = (value: string | undefined): number | undefined =>
  value === undefined ? undefined : Number(value);

export class JobStoreService {
  constructor(private readonly redis: Redis) {}

  private key(id: string): string {
    return `${JOB_KEY_PREFIX}${id}`;
  }

  async create(job: JobMessage): Promise<void> {
    const key = this.key(job.id);
    await this.redis
      .multi()
      .hset(key, {
        id: job.id,
        type: job.type,
        payload: JSON.stringify(job.payload),
        status: JOB_STATUS.QUEUED,
        submittedAt: Date.now(),
      })
      .expire(key, JOB_TTL_SECONDS)
      .exec();
  }

  async findById(id: string): Promise<JobRecord | null> {
    // Redis hashes only hold strings, so numbers and JSON are converted back here.
    const hash = await this.redis.hgetall(this.key(id));
    if (!hash.id) return null;

    return {
      id: hash.id,
      type: hash.type as JobType,
      status: hash.status as JobStatus,
      payload: JSON.parse(hash.payload ?? "{}"),
      submittedAt: Number(hash.submittedAt),
      startedAt: toNumber(hash.startedAt),
      completedAt: toNumber(hash.completedAt),
      durationMs: toNumber(hash.durationMs),
      result: hash.result ? JSON.parse(hash.result) : undefined,
      error: hash.error,
    };
  }

  async delete(id: string): Promise<void> {
    await this.redis.del(this.key(id));
  }
}
