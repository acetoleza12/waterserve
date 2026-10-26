import vinext from "vinext";
import { defineConfig } from "vite";
import path from "node:path";
export default defineConfig(async () => {
  process.env.WRANGLER_LOG_PATH ||= path.resolve(".runtime/logs");
  process.env.WRANGLER_SEND_METRICS ||= "false";
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
      }),
    ],
    server: { host: "127.0.0.1" },
  };
});
