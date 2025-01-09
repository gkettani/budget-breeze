import { ObservabilityClientBuilder } from '@budget-breeze/observability';

const observability = new ObservabilityClientBuilder()
  .setServiceName('bb-server')
  .setEnvironment('production')
  .setVersion('commit-hash-892867HJE2')
  .withLogger((config) => config.setLevel('info'))
  .withMetrics((config) =>
    config
      .addOpenTelemetryConsoleExporter()
  )
  .build();

export const { logger, metrics } = observability;
