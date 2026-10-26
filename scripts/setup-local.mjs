import { localEnvironment } from "./local-environment.mjs";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import path from "node:path";
mkdirSync(".runtime/logs", { recursive: true });
if (!existsSync(".dev.vars"))
  writeFileSync(
    ".dev.vars",
    "SETUP_KEY=" + randomBytes(24).toString("base64url") + "\n",
    { flag: "wx" },
  );
const key = readFileSync(".dev.vars", "utf8").match(/^SETUP_KEY=(.+)$/m)?.[1];
const result = spawnSync(
  process.execPath,
  [
    "node_modules/wrangler/bin/wrangler.js",
    "d1",
    "migrations",
    "apply",
    "DB",
    "--local",
  ],
  { stdio: "inherit", env: localEnvironment() },
);
if (result.status !== 0) process.exit(result.status || 1);
console.log("\nLocal database ready.");
console.log("Run npm run dev and open the Local URL.");
console.log("Choose Staff portal > Set up administrator.");
console.log("Your local setup key: " + key);
console.log(
  "Choose your own administrator email and password, then add maintenance accounts from Staff & access.",
);
