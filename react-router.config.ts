import type { Config } from "@react-router/dev/config";
import { allRoutePaths } from "./src/routes/inventory";

export default {
  appDirectory: "src",
  // No runtime server: every route is pre-rendered to static HTML at build time.
  ssr: false,
  prerender: {
    paths: () => [...allRoutePaths(), "/404"],
    concurrency: 4,
    // The prerender fetch to the local preview server occasionally drops on Windows ("Request failed" with an empty message).
    retryCount: 3,
    retryDelay: 2000,
  },
  basename: process.env.BASE_PATH ?? "/",
} satisfies Config;
