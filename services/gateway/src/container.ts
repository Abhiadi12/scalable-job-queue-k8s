import { Redis } from "ioredis";
import { env } from "./config/env.js";
import { MAX_RETRY_ATTEMPTS } from "./constants/index.js";
import { QueueConnection } from "./queue/connection.js";
import { JobPublisher } from "./queue/job-publisher.js";
import { JobStoreService } from "./services/job-store.service.js";
import { JobService } from "./services/job.service.js";
import { logger } from "./utils/logger.js";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: MAX_RETRY_ATTEMPTS,
});
redis.on("error", (error: Error) => logger.warn({ err: error }, "Redis error"));

const queueConnection = new QueueConnection();
const jobPublisher = new JobPublisher(queueConnection);

const jobStoreService = new JobStoreService(redis);
const jobService = new JobService(jobStoreService, jobPublisher);

export const container = {
  redis,
  queueConnection,
  jobPublisher,
  jobStoreService,
  jobService,
};
