// Plan 11: shown on a challenge page where the task finished, once the run has scored (store.revealFlag).
// Infrastructure: fully accessible, registers no scenarios. CSS: .ctf-complete in styles/components.css.
import { useEffect, useRef } from "react";
import { ctfStore, retryWithFixes } from "./store";
import type { ChallengeId } from "./challenges";

/** `onRetry` resets the page's task; this then turns every fix on and moves focus to the challenge bar. */
export function ChallengeComplete({ id, onRetry }: { id: ChallengeId; onRetry: () => void }) {
  const { result } = ctfStore.use();
  const heading = useRef<HTMLHeadingElement>(null);
  const done = result?.id === id;
  // After the page's own effects (some move or drop focus when their task finishes), so this wins.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => heading.current?.focus());
    return () => clearTimeout(t);
  }, [done]);
  if (!done) return null;

  const retry = () => {
    onRetry();
    retryWithFixes(id);
    setTimeout(() => document.querySelector<HTMLElement>(".ctf-banner-title")?.focus());
  };
  return (
    <section className="ctf-complete" aria-labelledby={`${id}-complete`}>
      <h3 id={`${id}-complete`} ref={heading} tabIndex={-1}>Congratulations! You completed the challenge!</h3>
      <p>Your flag <code className="ctf-flag">{result.flag}</code> was entered for you. You scored {result.score} points, saved to the leaderboard as {result.handle}.</p>
      <p>Now try the challenge again with every accessibility issue fixed to compare the experience.</p>
      <button type="button" className="ctf-btn" onClick={retry}>Try again with all issues fixed</button>
    </section>
  );
}
