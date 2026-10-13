import { app } from "./app.js";
import { env } from "./config/env.js";
import { container } from "./container.js";
import { logger } from "./utils/logger.js";

await container.queueConnection.connect();

const server = app.listen(env.PORT, () => logger.info(`stats listening on ${env.PORT}`));

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`${signal} received, shutting down`);

  await new Promise((resolve) => server.close(resolve));
  await container.queueConnection.close();
  await container.redis.quit();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
