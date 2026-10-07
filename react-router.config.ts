import type { Config } from "@react-router/dev/config";
import { allRoutePaths } from "./src/routes/inventory";

export default {
  appDirectory: "src",
  // No runtime server: every route is pre-rendered to static HTML at build time.
  ssr: false,
  prerender: {
    paths: () => [...allRoutePaths(), "/404", "/start", "/leaderboard"],
    concurrency: 4,
  },
  basename: process.env.BASE_PATH ?? "/",
  // Windows can't delete build/client while a local static server has it open; build elsewhere and copy in.
  buildDirectory: process.env.BUILD_DIR ?? "build",
} satisfies Config;
