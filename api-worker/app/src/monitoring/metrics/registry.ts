import { collectDefaultMetrics, Registry } from "prom-client";

export const registry = new Registry();

/**
 * Collect default NodeJS metrics.
 *
 * Examples:
 * - process_cpu_user_seconds_total
 * - process_resident_memory_bytes
 * - nodejs_heap_size_total_bytes
 * - nodejs_eventloop_lag_seconds
 */
collectDefaultMetrics({
  register: registry,
  prefix: "fraud_",
});