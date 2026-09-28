// Plan 09 static checks: no persistence anywhere, and no non-deterministic rendering (Math.random / Date.now)
// outside the fake-latency utility and the donate.tsx countdown, which don't affect defect determinism.
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const noPersistence = [
  { name: "localStorage", message: "No persistence anywhere in this app: state resets on reload (plan 02)." },
  { name: "sessionStorage", message: "No persistence anywhere in this app: state resets on reload (plan 02)." },
  { name: "indexedDB", message: "No persistence anywhere in this app: state resets on reload (plan 02)." },
];

const noRandomTime = [
  { object: "Math", property: "random", message: "Non-deterministic rendering breaks reproducible scans (plan 09). Use src/lib/interactive.ts's hash-based latency instead." },
  { object: "Date", property: "now", message: "Non-deterministic rendering breaks reproducible scans (plan 09)." },
];

export default tseslint.config(
  { ignores: ["build/**", ".react-router/**", "node_modules/**", "public/**"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.base, reactHooks.configs["recommended-latest"]],
    rules: {
      "no-restricted-globals": ["error", ...noPersistence],
      "no-restricted-properties": ["error", ...noRandomTime, { object: "document", property: "cookie", message: "No persistence anywhere in this app: state resets on reload (plan 02)." }],
    },
  },
  {
    // The fake-latency helper and the donate-flow countdown need real timing; neither affects prerendered
    // markup or a scenario's defective/fixed output, so they don't threaten determinism.
    files: ["src/lib/interactive.ts", "src/pages/giving/donate.tsx"],
    rules: {
      "no-restricted-properties": ["error", { object: "document", property: "cookie", message: "No persistence anywhere in this app: state resets on reload (plan 02)." }],
    },
  },
);
