import { app } from "./app.js";
import { env } from "./config/env.js";
import { container } from "./container.js";
import { logger } from "./utils/logger.js";

await container.queueConnection.connect();
await container.jobConsumer.start();
logger.info(`worker ${process.pid} consuming from "${env.QUEUE_NAME}"`);

const server = app.listen(env.PORT, () =>
  logger.info(`worker metrics and health on ${env.PORT}`),
);

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`${signal} received, finishing current job then exiting`);

  await container.jobConsumer.stop();
  await container.queueConnection.close();
  await new Promise((resolve) => server.close(resolve));
  await container.redis.quit();
  logger.info("worker stopped");
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
