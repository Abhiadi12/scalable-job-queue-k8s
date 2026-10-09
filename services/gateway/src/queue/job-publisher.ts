import { env } from "../config/env.js";
import type { JobMessage } from "../types/job.js";
import type { QueueConnection } from "./connection.js";

export class JobPublisher {
  constructor(private readonly queueConnection: QueueConnection) {}

  /** Resolves once the broker has confirmed it stored the message. */
  publish(message: JobMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queueConnection.getChannel().sendToQueue(
        env.QUEUE_NAME,
        Buffer.from(JSON.stringify(message)),
        { persistent: true, contentType: "application/json", messageId: message.id },
        (error) => (error ? reject(error) : resolve()),
      );
    });
  }
}
