export interface JobCounters {
  submitted: number;
  completed: number;
  failed: number;
  processingTimeMs: number;
}

export interface QueueStats {
  length: number;
  consumers: number;
}

export interface Stats {
  jobs: {
    submitted: number;
    completed: number;
    failed: number;
    pending: number;
  };
  averageProcessingTimeMs: number;
  queue: QueueStats;
}
