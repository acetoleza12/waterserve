import path from "node:path";
import { mkdirSync } from "node:fs";
export function localEnvironment() {
  const registry = path.resolve(".runtime/registry");
  const devRegistry = path.resolve(".runtime/dev-registry");
  const logs = path.resolve(".runtime/logs");
  for (const dir of [registry, devRegistry, logs])
    mkdirSync(dir, { recursive: true });
  return {
    ...process.env,
    WRANGLER_LOG_PATH: logs,
    WRANGLER_REGISTRY_PATH: devRegistry,
    MINIFLARE_REGISTRY_PATH: registry,
    WRANGLER_SEND_METRICS: "false",
    CLOUDFLARE_CF_FETCH_ENABLED: "false",
  };
}
