import { localEnvironment } from "./local-environment.mjs";
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
const [mode, ...extra] = process.argv.slice(2);
if (!["dev", "build", "start"].includes(mode))
  throw new Error("Choose dev, build, or start.");
mkdirSync(".runtime/logs", { recursive: true });
const args =
  mode === "start"
    ? [
        "node_modules/wrangler/bin/wrangler.js",
        "dev",
        "--config",
        "dist/server/wrangler.json",
        "--local",
        "--ip",
        "127.0.0.1",
        "--inspector-port",
        "0",
        ...extra,
      ]
    : ["node_modules/vinext/dist/cli.js", mode, ...extra];
const result = spawnSync(process.execPath, args, {
  stdio: "inherit",
  env: localEnvironment(),
});
process.exit(result.status || 0);
