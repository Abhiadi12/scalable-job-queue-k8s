export interface Liveness {
  status: "ok";
  uptimeSeconds: number;
}

export interface Readiness {
  ready: boolean;
  checks: {
    redis: boolean;
    rabbitmq: boolean;
  };
}
