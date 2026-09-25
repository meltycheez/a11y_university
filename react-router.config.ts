import type { Config } from "@react-router/dev/config";
import { allRoutePaths } from "./src/routes/inventory";

export default {
  appDirectory: "src",
  // No runtime server: every route is pre-rendered to static HTML at build time.
  ssr: false,
  prerender: {
    paths: () => [...allRoutePaths(), "/404"],
    // ponytail: 2 not 4; builds failed intermittently ("Request failed", no message) under memory pressure at 4.
    concurrency: 2,
  },
  basename: process.env.BASE_PATH ?? "/",
} satisfies Config;
