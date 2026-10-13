// The screen reader challenges' fade-out (plan 11 §5, shared since plan 12): when a run starts (scored or comparison),
// scroll the form into view, count down while it fades out (.ctf-blind), then put focus on its first field. Every run
// starts hidden, even if the player showed the form in the run before. A run resumed by navigating back later skips
// straight past the countdown.
import { useEffect, useRef, useState } from "react";
import type { ChallengeId } from "./challenges";
import { ctfStore } from "./store";

/** The fade-out (keep in step with .ctf-blind in styles/components.css). */
export const FADE_MS = 5000;
/** Time for the smooth scroll to the form before it starts fading. */
const SCROLL_MS = 700;

/**
 * `card` and `cardClass` go on the element that fades; `firstField` is a selector for where focus lands once it's
 * gone. Render the countdown just above the card (right below the challenge bar): the scroll leaves room for it.
 */
export function useBlindRun<T extends HTMLElement>(id: ChallengeId, firstField: string) {
  const { run } = ctfStore.use();
  const blindRun = run?.id === id;
  const runStart = blindRun ? run.startedAt : 0;
  const lastRun = useRef(runStart); // a run already going when the page mounts doesn't count down again
  const card = useRef<T>(null);
  const [scrolling, setScrolling] = useState(false); // the form stays visible until it has scrolled into view
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    const fresh = runStart !== 0 && runStart !== lastRun.current;
    lastRun.current = runStart;
    if (!fresh) { setScrolling(false); setCountdown(0); return; }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    card.current?.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setScrolling(true);
    let left = FADE_MS / 1000;
    let t: ReturnType<typeof setInterval> | undefined;
    const fade = setTimeout(() => {
      setScrolling(false);
      setCountdown(left);
      t = setInterval(() => {
        setCountdown(--left);
        if (left > 0) return;
        clearInterval(t);
        document.querySelector<HTMLElement>(firstField)?.focus();
      }, 1000);
    }, reduce ? 0 : SCROLL_MS);
    return () => { clearTimeout(fade); clearInterval(t); };
  }, [runStart, firstField]);
  const blind = blindRun && !run?.revealed && !scrolling;
  return { card, countdown, blind, cardClass: `ctf-card${blind ? " ctf-blind" : ""}` };
}
