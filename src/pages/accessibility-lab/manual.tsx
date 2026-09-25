// Manual Testing Specimens (plan 08): contrast, color-only, motion, reflow, and text-in-image, each with a
// short instruction for how to check it by hand.
import { useEffect, useState } from "react";
import { useScenario } from "~/a11y/useScenario";
import { Specimen } from "./_Specimen";

export { inventoryMeta as meta } from "~/routes/meta";

function Instructions({ children }: { children: React.ReactNode }) {
  return <p className="specimen-instructions">{children}</p>;
}

function ContrastText() {
  const id = "contrast-text-low-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <p className={fixed ? undefined : "lab-manual-contrast-text"} data-a11y-scenario={id}>
        Redwood State's advising office is open weekdays from 8 a.m. to 5 p.m.
      </p>
      <Instructions>Check the text color against the background with a contrast checker; it should meet 4.5:1.</Instructions>
    </>
  );
}

function ContrastUi() {
  const id = "contrast-ui-low-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <button type="button" className={`btn btn--secondary${fixed ? "" : " lab-manual-contrast-ui"}`} data-a11y-scenario={id}>
        View schedule
      </button>
      <Instructions>Check the control's border contrast against its background; it should meet 3:1.</Instructions>
    </>
  );
}

function ColorOnlyInfo() {
  const id = "color-only-info-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <ul className="lab-manual-list" data-a11y-scenario={id}>
        <li><span className="lab-dot lab-dot--green" aria-hidden="true" /> Redwood Merit Award {fixed && "(renewable)"}</li>
        <li><span className="lab-dot lab-dot--gray" aria-hidden="true" /> First-Year Grant</li>
      </ul>
      {!fixed && <p className="specimen-legend">Legend: <span className="lab-dot lab-dot--green" aria-hidden="true" /> = renewable</p>}
      <Instructions>View the page in grayscale; the status should still be identifiable from text alone.</Instructions>
    </>
  );
}

function ColorOnlyError() {
  const id = "color-only-error-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <p className="lab-manual-error-row" data-a11y-scenario={id}>
        {fixed && <strong>Error: </strong>}Student ID
      </p>
      <Instructions>View in grayscale; you should still be able to tell which row has an error.</Instructions>
    </>
  );
}

function MotionTicker() {
  const id = "motion-autorotate-no-pause-manual-lab";
  const fixed = useScenario(id);
  const items = ["Homecoming tickets on sale now", "Library hours extended for finals", "Apply for spring internships"];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (fixed && paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 2000);
    return () => clearInterval(t);
  }, [fixed, paused, items.length]);
  return (
    <>
      <div className="lab-manual-ticker" data-a11y-scenario={id}>
        <span>{items[i]}</span>
        {fixed && <button type="button" onClick={() => setPaused((p) => !p)}>{paused ? "Play" : "Pause"}</button>}
      </div>
      <Instructions>Watch for 6+ seconds; you must be able to pause the movement.</Instructions>
    </>
  );
}

function MotionAnnouncement() {
  const id = "motion-animated-announcement-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <div className={`lab-manual-marquee${fixed ? " is-fixed" : ""}`} data-a11y-scenario={id}>
        <span className="lab-manual-marquee-text">Financial aid deadline is June 1</span>
      </div>
      <Instructions>Confirm the message can be read without motion, and stays still once fixed.</Instructions>
    </>
  );
}

function MotionReducedMotion() {
  const id = "motion-ignores-reduced-motion-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <div key={String(fixed)} className={fixed ? "lab-manual-motion-fixed" : "lab-manual-motion-unfixed"} data-a11y-scenario={id}>
        Welcome back!
      </div>
      <Instructions>Enable "reduce motion" in your OS settings and reload; the fixed version should not animate.</Instructions>
    </>
  );
}

function ReflowOverflow() {
  const id = "reflow-overflow-200-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <div className={fixed ? "lab-manual-card" : "lab-manual-card lab-manual-overflow-200"} data-a11y-scenario={id}>
        The Sequoia Library's study rooms can be reserved up to two weeks in advance through the library website.
      </div>
      <Instructions>Zoom the browser to 200% and confirm no text is clipped or hidden.</Instructions>
    </>
  );
}

function ReflowHorizontalScroll() {
  const id = "reflow-horizontal-scroll-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <div className={fixed ? "lab-manual-hscroll-wrap" : undefined}>
        <div className={fixed ? "lab-manual-hscroll-fixed" : "lab-manual-hscroll"} data-a11y-scenario={id}>
          Fall 2026 orientation schedule: check-in, advising, campus tour, welcome reception.
        </div>
      </div>
      <Instructions>Narrow the viewport to 320px; the page itself shouldn't scroll horizontally.</Instructions>
    </>
  );
}

function ReflowClippedText() {
  const id = "reflow-clipped-text-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <span className={fixed ? "lab-manual-badge lab-manual-badge--fixed" : "lab-manual-badge"} data-a11y-scenario={id}>Open</span>
      <Instructions>Increase the browser's default text size and check nothing is cut off.</Instructions>
    </>
  );
}

function ReflowFixedDimensions() {
  const id = "reflow-fixed-dimensions-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <div className={fixed ? "lab-manual-fixedcard lab-manual-fixedcard--fixed" : "lab-manual-fixedcard"} data-a11y-scenario={id}>
        Registration opens April 1
      </div>
      <Instructions>Zoom to 200% and check the text stays inside the card.</Instructions>
    </>
  );
}

function TextSpacingBreaks() {
  const id = "text-spacing-breaks-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      <p className={fixed ? undefined : "lab-manual-tight-spacing"} data-a11y-scenario={id}>
        Course add/drop deadlines apply to every session length, including short-term and intersession courses.
      </p>
      <Instructions>Apply a user stylesheet that increases line-height and letter-spacing (WCAG 1.4.12 values) and confirm no text is lost.</Instructions>
    </>
  );
}

function TextInImage() {
  const id = "text-in-image-manual-lab";
  const fixed = useScenario(id);
  return (
    <>
      {fixed ? (
        <div className="lab-manual-promo">
          <span className="img-placeholder" aria-hidden="true" style={{ aspectRatio: "16 / 9", display: "inline-block", width: "6rem" }} data-a11y-scenario={id} />
          <p>50% off application fees — apply by June 1.</p>
        </div>
      ) : (
        <span
          className="img-placeholder"
          role="img"
          aria-label="Promotional graphic"
          style={{ aspectRatio: "16 / 9", display: "block", maxWidth: "20rem" }}
          data-a11y-scenario={id}
        />
      )}
      <Instructions>Zoom to 400%; the fixed version's text should stay crisp and reflow, unlike a raster image.</Instructions>
    </>
  );
}

export default function ManualLab() {
  return (
    <>
      <h1>Manual Testing Specimens</h1>
      <p>
        These issues need a human, not just a scanner: contrast, color-only meaning, motion, reflow at zoom, and text baked into
        images. Each specimen includes a short instruction for checking it by hand.
      </p>
      <Specimen id="contrast-text-low-manual-lab"><ContrastText /></Specimen>
      <Specimen id="contrast-ui-low-manual-lab"><ContrastUi /></Specimen>
      <Specimen id="color-only-info-manual-lab"><ColorOnlyInfo /></Specimen>
      <Specimen id="color-only-error-manual-lab"><ColorOnlyError /></Specimen>
      <Specimen id="motion-autorotate-no-pause-manual-lab"><MotionTicker /></Specimen>
      <Specimen id="motion-animated-announcement-manual-lab"><MotionAnnouncement /></Specimen>
      <Specimen id="motion-ignores-reduced-motion-manual-lab"><MotionReducedMotion /></Specimen>
      <Specimen id="reflow-overflow-200-manual-lab"><ReflowOverflow /></Specimen>
      <Specimen id="reflow-horizontal-scroll-manual-lab"><ReflowHorizontalScroll /></Specimen>
      <Specimen id="reflow-clipped-text-manual-lab"><ReflowClippedText /></Specimen>
      <Specimen id="reflow-fixed-dimensions-manual-lab"><ReflowFixedDimensions /></Specimen>
      <Specimen id="text-spacing-breaks-manual-lab"><TextSpacingBreaks /></Specimen>
      <Specimen id="text-in-image-manual-lab"><TextInImage /></Specimen>
    </>
  );
}
