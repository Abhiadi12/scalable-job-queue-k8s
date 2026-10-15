import { Redis } from "ioredis";
import { env } from "./config/env.js";
import { MAX_RETRY_ATTEMPTS } from "./constants/index.js";
import { jobHandlers } from "./handlers/index.js";
import { QueueConnection } from "./queue/connection.js";
import { JobConsumer } from "./queue/job-consumer.js";
import { JobProcessorService } from "./services/job-processor.service.js";
import { HealthService } from "./services/health.service.js";
import { JobStoreService } from "./services/job-store.service.js";
import { MetricsService } from "./services/metrics.service.js";
import { logger } from "./utils/logger.js";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: MAX_RETRY_ATTEMPTS,
});
redis.on("error", (error: Error) => logger.warn({ err: error }, "Redis error"));

const queueConnection = new QueueConnection();

const metricsService = new MetricsService();
const jobStoreService = new JobStoreService(redis);
const jobProcessorService = new JobProcessorService(jobStoreService, metricsService, jobHandlers);

const jobConsumer = new JobConsumer(queueConnection, jobProcessorService, metricsService);
const healthService = new HealthService(redis, queueConnection);

export const container = {
  redis,
  queueConnection,
  metricsService,
  jobStoreService,
  jobProcessorService,
  jobConsumer,
  healthService,
};
