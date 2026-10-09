import { randomUUID } from "node:crypto";
import { JOB_STATUS } from "../constants/index.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ServiceUnavailableError } from "../errors/service-unavailable.error.js";
import type { JobPublisher } from "../queue/job-publisher.js";
import type { JobPayload, JobRecord, JobType } from "../types/job.js";
import { logger } from "../utils/logger.js";
import type { JobStoreService } from "./job-store.service.js";

export class JobService {
  constructor(
    private readonly jobStore: JobStoreService,
    private readonly jobPublisher: JobPublisher,
  ) {}

  async submit(type: JobType, payload: JobPayload): Promise<Pick<JobRecord, "id" | "status">> {
    const job = { id: randomUUID(), type, payload };

    try {
      // Record first, publish second: a worker must never receive a job whose
      // status record does not exist yet.
      await this.jobStore.create(job);
      await this.jobPublisher.publish(job);
    } catch (error) {
      logger.error({ err: error, jobId: job.id }, "Failed to queue job");
      await this.jobStore.delete(job.id).catch(() => {});
      throw new ServiceUnavailableError("Could not queue job, try again later");
    }

    return { id: job.id, status: JOB_STATUS.QUEUED };
  }

  async getStatus(id: string): Promise<JobRecord> {
    const job = await this.jobStore.findById(id);
    if (!job) throw new NotFoundError(`Job ${id} not found`);
    return job;
  }
}
