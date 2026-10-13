import { Redis } from "ioredis";
import { env } from "./config/env.js";
import { MAX_RETRY_ATTEMPTS } from "./constants/index.js";
import { QueueConnection } from "./queue/connection.js";
import { JobCountersService } from "./services/job-counters.service.js";
import { MetricsService } from "./services/metrics.service.js";
import { QueueStatsService } from "./services/queue-stats.service.js";
import { StatsService } from "./services/stats.service.js";
import { logger } from "./utils/logger.js";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: MAX_RETRY_ATTEMPTS,
});
redis.on("error", (error: Error) => logger.warn({ err: error }, "Redis error"));

const queueConnection = new QueueConnection();

const jobCountersService = new JobCountersService(redis);
const queueStatsService = new QueueStatsService(queueConnection);
const statsService = new StatsService(jobCountersService, queueStatsService);
const metricsService = new MetricsService(statsService);

export const container = {
  redis,
  queueConnection,
  jobCountersService,
  queueStatsService,
  statsService,
  metricsService,
};
