// Shared chrome for a lab specimen: one <section> per scenario, sourced entirely from its registry entry
// so every specimen page renders consistent copy without duplicating it (title, detection, fix, live status).
import { scenarios } from "~/a11y/registry";
import { useScenario } from "~/a11y/useScenario";

const FIX_LABEL = { error: "Fix Errors", alert: "Fix Alerts", manual: "Fix Manual Testing Issues" } as const;

function detectionText(id: string): string {
  const s = scenarios.get(id)!;
  const parts = [
    s.detectedBy.wave?.length ? `WAVE: ${s.detectedBy.wave.join(", ")}` : null,
    s.detectedBy.axe?.length ? `axe: ${s.detectedBy.axe.join(", ")}` : null,
  ].filter((p): p is string => p !== null);
  if (s.detectedBy.manualOnly || !parts.length) parts.push("manual testing");
  return parts.join(" · ");
}

/** One isolated specimen: heading, the live defective/fixed markup, and a caption naming the scenario. */
export function Specimen({ id, level = 2, children }: { id: string; level?: 2 | 3; children: React.ReactNode }) {
  const s = scenarios.get(id);
  if (!s) throw new Error(`Unknown lab scenario: ${id}`);
  const fixed = useScenario(id);
  const H = `h${level}` as const;
  return (
    <section className="specimen" aria-labelledby={`${id}-h`}>
      <H id={`${id}-h`}>{s.title}</H>
      <div className="specimen-live">{children}</div>
      <p className="specimen-caption">
        <code>{id}</code> · Expected detection: {detectionText(id)} · Currently{" "}
        <strong>{fixed ? `fixed by ${FIX_LABEL[s.category]}` : "active"}</strong>. Fix: {s.fixDescription}
      </p>
    </section>
  );
}
