// /campus-map (tier T, plan 06 #10): a hand-built SVG campus map with clickable buildings, a building type filter,
// layer chips, a detail panel, zoom and pan. The widget looks like a vendor map dropped into the flagship template.
// 37 scenarios live in a11y/registry/campus-map.ts; CSS defects and fixes in styles/features/campus-map.css.
// Also the eye tracking CTF (plan 11 §7): find Hawthorne Observatory, read its code from the tooltip, check in.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Field, IconButton, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { ChallengeBanner } from "~/ctf/ChallengeBanner";
import { ChallengeComplete } from "~/ctf/ChallengeComplete";
import { revealFlag } from "~/ctf/store";
import { pageContent } from "~/data/content/pages";
import {
  ADDRESS, MAP_H, MAP_W, buildings, categories, doorPoint, entrances, lots, permits, rectPath,
  type Building, type Category,
} from "./_campus-map-data";

export { inventoryMeta as meta } from "~/routes/meta";

const content = pageContent["/campus-map"];
const [intro, directory] = content.sections;

interface View { x: number; y: number; s: number }
const clampView = ({ x, y, s }: View): View => {
  const w = MAP_W / s, h = MAP_H / s;
  return { s, x: Math.min(Math.max(x, 0), MAP_W - w), y: Math.min(Math.max(y, 0), MAP_H - h) };
};

// The map opens zoomed in on "You are here"; Reset returns here too.
const DEFAULT_VIEW = clampView({ s: 1.6, x: 375 - MAP_W / 3.2, y: 600 - MAP_H / 3.2 });
const OBSERVATORY_CODE = buildings.find((b) => b.accessCode)!.accessCode!;

// Registered on the page root: CSS scenarios and the layout-level focus order.
const ROOT_SCENARIOS = [
  "campus-map-footnote-small-001", "campus-map-focus-indicator-001", "campus-map-reflow-001", "campus-map-focus-order-001",
  "campus-map-close-focus-001", "campus-map-detail-announce-001", "campus-map-timeout-001", "campus-map-banner-shift-001",
];

export default function CampusMapPage() {
  useScenario("campus-map-footnote-small-001");
  useScenario("campus-map-focus-indicator-001");
  useScenario("campus-map-reflow-001");
  const orderFixed = useScenario("campus-map-focus-order-001");
  const announceFixed = useScenario("campus-map-detail-announce-001");
  const restoreFixed = useScenario("campus-map-close-focus-001");
  const listFixed = useScenario("campus-map-building-keyboard-001");
  const timeoutFixed = useScenario("campus-map-timeout-001");
  useScenario("campus-map-banner-shift-001");

  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState<"all" | Category>("all");
  const [layers, setLayers] = useState({ parking: true, entrances: true });
  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const [checkin, setCheckin] = useState("");
  const [round, setRound] = useState(0); // bumped by "Try again with all issues fixed" to reset the check-in

  // campus-map-timeout-001: every 60 s, "Are you still there?"; 15 s without Continue resets the map.
  const [stillThere, setStillThere] = useState(false);
  useEffect(() => {
    if (timeoutFixed) { setStillThere(false); return; }
    const t = setTimeout(() => {
      if (!stillThere) return setStillThere(true);
      setView(DEFAULT_VIEW); setSelected(null); setCheckin(""); setStillThere(false);
    }, stillThere ? 15_000 : 60_000);
    return () => clearTimeout(t);
  }, [timeoutFixed, stillThere]);

  // Focus work runs after the render that shows or removes the panel content.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<(() => void) | null>(null);
  useEffect(() => { pendingFocus.current?.(); pendingFocus.current = null; });

  const select = (slug: string) => {
    opener.current = document.activeElement as HTMLElement | null;
    pendingFocus.current = announceFixed ? () => headingRef.current?.focus() : null;
    if (slug === selected) { pendingFocus.current?.(); pendingFocus.current = null; } // no re-render for the same building
    setSelected(slug);
  };
  const close = () => {
    // Defective: the close button unmounts and focus falls to <body>.
    pendingFocus.current = restoreFixed
      ? () => {
          const el = opener.current;
          if (el?.isConnected && el !== document.body) el.focus();
          if (document.activeElement !== el) headingRef.current?.focus();
        }
      : null;
    setSelected(null);
  };

  const zoom = (f: number) => setView((v) => {
    const s = Math.min(Math.max(v.s * f, 1), 4);
    const cx = v.x + MAP_W / v.s / 2, cy = v.y + MAP_H / v.s / 2;
    return clampView({ s, x: cx - MAP_W / s / 2, y: cy - MAP_H / s / 2 });
  });
  const pan = (dx: number, dy: number) => setView((v) => clampView({ ...v, x: v.x + (dx * MAP_W) / v.s, y: v.y + (dy * MAP_H) / v.s }));
  const reset = () => setView(DEFAULT_VIEW);

  const visible = category === "all" ? buildings : buildings.filter((b) => b.category === category);
  const building = buildings.find((b) => b.slug === selected);

  const tools = (
    <div className="cmap-tools">
      <MapSearch onFind={select} />
      <MapFilters category={category} setCategory={setCategory} layers={layers} setLayers={setLayers} count={visible.length} />
      <MapLegend />
    </div>
  );

  return (
    <>
      <Hero variant="banner" title="Campus Map" kicker="About Redwood State" lede={content.summary} />
      <div className="page-content cmap-page" data-a11y-scenario={ROOT_SCENARIOS.join(" ")}>
        <ChallengeBanner id="map-eyes" />
        <section className="stack cmap-intro">
          {intro.paragraphs?.map((p) => <p key={p}>{p}</p>)}
          <ul className="link-list">
            <li><SmartLink scenario="campus-map-parking-pdf-001" to="/documents/parking-map.pdf" fixedTo="/students/parking#maps-heading" defect="Printable parking map">Parking maps and lot guide</SmartLink></li>
            <li><SmartLink scenario="campus-map-parking-window-001" to="/students/parking" newWindow>Parking Services</SmartLink></li>
            <li><Link to="/visitors">Visitor information</Link></li>
          </ul>
        </section>

        <p className="cmap-parking-alert"><strong>Parking update:</strong> Lot J is closed for resurfacing October 5–9. Use Lot D or the Canopy Drive shuttle.</p>
        <div className="cmap">
          {orderFixed && tools}
          <div className="cmap-main">
            <MapToolbar zoom={zoom} pan={pan} reset={reset} />
            <CampusMapSvg visible={visible} selected={selected} onSelect={select} layers={layers} view={view} setView={setView} zoom={zoom} pan={pan} reset={reset} />
            <p className="cmap-footnote">Not to scale. {content.updated}. Blue dots mark accessible entrances.</p>
            {stillThere && (
              <div className="cmap-timeout">
                <p>Are you still there? The map resets in 15 seconds.</p>
                <button type="button" className="cmap-timeout-btn" onClick={() => setStillThere(false)}>Continue</button>
              </div>
            )}
            <CheckIn key={round} value={checkin} setValue={setCheckin}
              onRetry={() => { setView(DEFAULT_VIEW); setSelected(null); setCheckin(""); setRound((n) => n + 1); }} />
          </div>
          <BuildingDetail building={building} onClose={close} headingRef={headingRef} />
          {!orderFixed && tools}
        </div>

        {listFixed && (
          <section className="stack cmap-list" aria-labelledby="cmap-list-heading">
            <h2 id="cmap-list-heading">Buildings (list view)</h2>
            <ul>
              {visible.map((b) => (
                <li key={b.slug}>
                  <button type="button" className="cmap-list-btn" aria-current={b.slug === selected ? "true" : undefined} onClick={() => select(b.slug)}>
                    {b.name} <span className="cmap-code">{b.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <BuildingDirectory />
      </div>
    </>
  );
}

/** Observatory after-hours check-in: the eye tracking CTF's finish line. Not a scenario: plain and accessible. */
function CheckIn({ value, setValue, onRetry }: { value: string; setValue: (v: string) => void; onRetry: () => void }) {
  const [message, setMessage] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.replace(/\D/g, "") !== OBSERVATORY_CODE) { setMessage("That code doesn't match. The after-hours code is shown when you point at Hawthorne Observatory on the map."); return; }
    const flag = revealFlag("map-eyes", [OBSERVATORY_CODE]);
    setMessage(flag ? "Checked in at Hawthorne Observatory." : "Checked in at Hawthorne Observatory. Clear skies!");
  };
  return (
    <form className="cmap-checkin" onSubmit={submit} noValidate>
      <h2>Observatory check-in</h2>
      <label htmlFor="cmap-checkin-code">Hawthorne Observatory after-hours access code</label>
      <div className="cmap-checkin-row">
        <input id="cmap-checkin-code" inputMode="numeric" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit" className="btn btn--primary">Check in</button>
      </div>
      <p role="status" className="cmap-checkin-msg">{message}</p>
      <ChallengeComplete id="map-eyes" onRetry={onRetry} />
    </form>
  );
}

function MapSearch({ onFind }: { onFind: (slug: string) => void }) {
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim().toLowerCase();
    if (!term) return;
    const hit = buildings.find((b) => b.code.toLowerCase() === term) ?? buildings.find((b) => b.name.toLowerCase().includes(term));
    setMessage(hit ? "" : `No building matches “${q.trim()}”. Try a building name or code, such as LIB.`);
    if (hit) onFind(hit.slug);
  };
  return (
    <form className="cmap-search" role="search" aria-label="Buildings" onSubmit={submit}>
      <div className="cmap-search-row">
        <Field scenario="campus-map-search-label-001" id="cmap-q" label="Find a building" defect="placeholder" type="search" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
        <IconButton scenario="campus-map-search-button-001" type="submit" label="Search buildings" className="cmap-search-btn" icon={
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
        } />
      </div>
      <p className="cmap-search-msg" role="status">{message}</p>
    </form>
  );
}

function MapFilters({ category, setCategory, layers, setLayers, count }: {
  category: "all" | Category; setCategory: (c: "all" | Category) => void;
  layers: { parking: boolean; entrances: boolean }; setLayers: (l: { parking: boolean; entrances: boolean }) => void; count: number;
}) {
  const labelFixed = useScenario("campus-map-category-label-001");
  const controlsFixed = useScenario("campus-map-category-controls-001");
  const pressedFixed = useScenario("campus-map-layers-state-001");
  const liveFixed = useScenario("campus-map-results-count-001");
  useScenario("campus-map-layers-contrast-001");
  const chip = (key: keyof typeof layers, label: string) => {
    const on = layers[key];
    return (
      <button type="button" className={on ? "cmap-chip is-on" : "cmap-chip"} aria-pressed={pressedFixed ? on : undefined} onClick={() => setLayers({ ...layers, [key]: !on })}>
        {pressedFixed && on && <span aria-hidden="true">✓ </span>}{label}
      </button>
    );
  };
  return (
    <div className="cmap-filters" data-a11y-scenario="campus-map-category-label-001 campus-map-category-controls-001 campus-map-layers-state-001 campus-map-layers-contrast-001 campus-map-results-count-001">
      <div className="cmap-field">
        {labelFixed ? <label htmlFor="cmap-category">Show building type</label> : <span className="cmap-field-label">Show:</span>}
        <select id="cmap-category" aria-controls={controlsFixed ? "campus-map-buildings" : "map-buildings"} value={category} onChange={(e) => setCategory(e.target.value as "all" | Category)}>
          <option value="all">All buildings</option>
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <p className="cmap-chips-label">Layers</p>
      <div className="cmap-chips">
        {chip("parking", "Parking")}
        {chip("entrances", "Accessible entrances")}
      </div>
      <p className="cmap-count" role={liveFixed ? "status" : undefined}>Showing {count} of {buildings.length} buildings</p>
    </div>
  );
}

function MapLegend() {
  const [open, setOpen] = useState(true);
  const expandedFixed = useScenario("campus-map-legend-expanded-001");
  const textFixed = useScenario("campus-map-parking-legend-001");
  // Defective: aria-expanded="yes"/"no" (not valid ARIA values).
  const expanded = { "aria-expanded": expandedFixed ? open : open ? "yes" : "no" } as React.AriaAttributes;
  return (
    <div className="cmap-legend" data-a11y-scenario="campus-map-legend-expanded-001 campus-map-parking-legend-001">
      <button type="button" className="cmap-legend-toggle" aria-controls="cmap-legend-body" {...expanded} onClick={() => setOpen(!open)}>Map legend</button>
      <div id="cmap-legend-body" hidden={!open}>
        <ul className="cmap-legend-list">
          {categories.map((c) => <li key={c.value}><span className={`cmap-swatch cmap-b--${c.value}`} aria-hidden="true" />{c.label}</li>)}
          <li><span className="cmap-swatch cmap-swatch--door" aria-hidden="true" />Accessible entrance</li>
        </ul>
        <p className="cmap-legend-sub">Parking</p>
        <ul className={textFixed ? "cmap-legend-list" : "cmap-legend-list cmap-legend-list--row"}>
          {Object.entries(permits).map(([key, p]) => (
            <li key={key}><span className="cmap-swatch" style={{ background: p.color }} aria-hidden="true" />{textFixed && p.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const icons = {
  in: <path d="M12 5v14M5 12h14" />,
  out: <path d="M5 12h14" />,
  reset: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /></>,
  up: <path d="m6 15 6-6 6 6" />, down: <path d="m6 9 6 6 6-6" />, left: <path d="m15 6-6 6 6 6" />, right: <path d="m9 6 6 6-6 6" />,
};

function MapToolbar({ zoom, pan, reset }: { zoom: (f: number) => void; pan: (dx: number, dy: number) => void; reset: () => void }) {
  const named = useScenario("campus-map-zoom-name-001");
  const tabFixed = useScenario("campus-map-zoom-tabindex-001");
  const panFixed = useScenario("campus-map-pan-drag-001");
  const printFixed = useScenario("campus-map-print-link-001");
  useScenario("campus-map-zoom-target-001");
  const btn = (label: string, icon: React.ReactNode, onClick: () => void, always = false) => (
    <button type="button" className="cmap-zoom-btn" onClick={onClick} tabIndex={tabFixed || always ? undefined : 1} aria-label={named || always ? label : undefined}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" focusable="false" aria-hidden={named || always ? true : undefined}>{icon}</svg>
    </button>
  );
  const print = (e?: React.MouseEvent) => { e?.preventDefault(); window.print(); };
  return (
    <div className="cmap-toolbar" data-a11y-scenario="campus-map-zoom-name-001 campus-map-zoom-tabindex-001 campus-map-print-link-001 campus-map-zoom-target-001">
      <div className="cmap-zoom">
        {btn("Zoom in", icons.in, () => zoom(1.5))}
        {btn("Zoom out", icons.out, () => zoom(1 / 1.5))}
        {btn("Reset map view", icons.reset, reset)}
      </div>
      {panFixed && (
        <div className="cmap-zoom">
          {btn("Pan north", icons.up, () => pan(0, -0.2), true)}
          {btn("Pan south", icons.down, () => pan(0, 0.2), true)}
          {btn("Pan west", icons.left, () => pan(-0.2, 0), true)}
          {btn("Pan east", icons.right, () => pan(0.2, 0), true)}
        </div>
      )}
      {printFixed
        ? <button type="button" className="cmap-print" onClick={() => print()}>Print this map</button>
        : <a href="#" className="cmap-print" onClick={print}>Print this map</a>}
    </div>
  );
}

function CampusMapSvg({ visible, selected, onSelect, layers, view, setView, zoom, pan, reset }: {
  visible: Building[]; selected: string | null; onSelect: (slug: string) => void; layers: { parking: boolean; entrances: boolean };
  view: View; setView: (fn: (v: View) => View) => void; zoom: (f: number) => void; pan: (dx: number, dy: number) => void; reset: () => void;
}) {
  const nameFixed = useScenario("campus-map-building-name-001");
  const roleFixed = useScenario("campus-map-svg-role-001");
  const lotsFixed = useScenario("campus-map-lots-hidden-focus-001");
  const idsFixed = useScenario("campus-map-duplicate-id-001");
  const tipFixed = useScenario("campus-map-tooltip-hover-001");
  const persistFixed = useScenario("campus-map-tip-persist-001");
  const kbdFixed = useScenario("campus-map-building-keyboard-001");
  const panFixed = useScenario("campus-map-pan-drag-001");
  useScenario("campus-map-labels-contrast-001");
  useScenario("campus-map-marker-motion-001");
  const [tip, setTip] = useState<string | null>(null);
  // campus-map-tip-persist-001: the tooltip closes after 2 s or once the pointer drifts 8 px from where it opened.
  const tipStart = useRef<{ x: number; y: number } | null>(null);
  const tipTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTip = () => { clearTimeout(tipTimer.current); tipStart.current = null; setTip(null); };
  const showTip = (slug: string, e?: React.MouseEvent) => {
    setTip(slug);
    clearTimeout(tipTimer.current);
    if (persistFixed || !e) return;
    tipStart.current = { x: e.clientX, y: e.clientY };
    tipTimer.current = setTimeout(hideTip, 2000);
  };
  const driftTip = (e: React.MouseEvent) => {
    const at = tipStart.current;
    if (!persistFixed && at && Math.hypot(e.clientX - at.x, e.clientY - at.y) > 8) hideTip();
  };
  useEffect(() => () => clearTimeout(tipTimer.current), []);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragged = useRef(false);

  // Drag to pan (the only way to pan while campus-map-pan-drag-001 is defective).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const start = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, k: MAP_W / view.s / (svgRef.current?.getBoundingClientRect().width || MAP_W) };
    dragged.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) dragged.current = true;
      setView((v) => clampView({ ...v, x: start.vx - dx * start.k, y: start.vy - dy * start.k }));
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const onMapKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowUp: () => pan(0, -0.1), ArrowDown: () => pan(0, 0.1), ArrowLeft: () => pan(-0.1, 0), ArrowRight: () => pan(0.1, 0),
      "+": () => zoom(1.5), "=": () => zoom(1.5), "-": () => zoom(1 / 1.5), "0": reset,
    };
    if (keys[e.key]) { e.preventDefault(); keys[e.key](); }
  };

  const tipB = visible.find((b) => b.slug === tip);
  const svgA11y = roleFixed ? { role: "group", "aria-label": "Interactive campus map" } : { role: "img" };
  const svgKbd = panFixed ? { tabIndex: 0, onKeyDown: onMapKey, "aria-describedby": "cmap-instructions" } : {};

  return (
    <div className="cmap-viewport" data-a11y-scenario="campus-map-tip-persist-001 campus-map-building-name-001 campus-map-svg-role-001 campus-map-lots-hidden-focus-001 campus-map-duplicate-id-001 campus-map-tooltip-hover-001 campus-map-building-keyboard-001 campus-map-pan-drag-001 campus-map-labels-contrast-001 campus-map-marker-motion-001">
      <Img image="map-aerial-illustration" scenario="campus-map-aerial-alt-001" alt="campus_aerial_FINAL_v3.jpg" fixedAlt="" className="cmap-aerial" sizes="(min-width: 60rem) 52rem, 100vw" />
      <svg
        ref={svgRef}
        className="cmap-svg"
        viewBox={`${view.x} ${view.y} ${MAP_W / view.s} ${MAP_H / view.s}`}
        onPointerDown={onPointerDown}
        {...svgA11y}
        {...svgKbd}
      >
        <g className="cmap-ground" aria-hidden="true">
          <rect className="cmap-land" x="0" y="0" width={MAP_W} height={MAP_H} />
          <path className="cmap-road" d="M0 612C300 596 640 620 1000 604" />
          <path className="cmap-road cmap-road--loop" d="M285 150H745V455H285Z" />
          <path className="cmap-road" d="M515 612V535M880 604V140" />
          <rect className="cmap-green" x="400" y="250" width="200" height="130" rx="18" />
          <text className="cmap-place" x="500" y="320" textAnchor="middle">Canopy Green</text>
          <text className="cmap-place" x="140" y="630">Canopy Drive</text>
          <text className="cmap-place" x="760" y="152">Green Loop</text>
          <g className="cmap-north" transform="translate(960 40)"><path d="M0-18 8 10 0 4-8 10Z" /><text y="26" textAnchor="middle">N</text></g>
        </g>

        {layers.parking && (
          <g className="cmap-lots" aria-hidden={lotsFixed ? undefined : true}>
            {lots.map((l) => {
              const shape = <>
                <path d={rectPath(l.box)} fill={permits[l.permit].color} />
                <text x={l.box[0] + l.box[2] / 2} y={l.box[1] + l.box[3] / 2 + 6} textAnchor="middle" aria-hidden={lotsFixed || undefined}>{l.id}</text>
              </>;
              // Fixed: a named shape, not eight identical links to the parking page (WAVE "redundant link").
              return lotsFixed
                ? <g key={l.id} className="cmap-lot" role="img" aria-label={`Lot ${l.id}, ${permits[l.permit].label}`}>{shape}</g>
                : <Link key={l.id} to="/students/parking" className="cmap-lot">{shape}</Link>;
            })}
          </g>
        )}

        <g id="campus-map-buildings">
          {visible.map((b) => (
            <path
              key={b.slug}
              id={b.slug}
              d={rectPath(b.box)}
              className={`cmap-bldg cmap-b--${b.category}${b.slug === selected ? " is-selected" : ""}`}
              onClick={() => { if (!dragged.current) onSelect(b.slug); }}
              onMouseEnter={(e) => showTip(b.slug, e)}
              onMouseMove={driftTip}
              onMouseLeave={hideTip}
              aria-label={nameFixed ? `${b.name} (${b.code})` : undefined}
              {...(kbdFixed ? {
                role: "button",
                tabIndex: 0,
                "aria-pressed": b.slug === selected,
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onSelect(b.slug); }
                },
              } : {})}
              {...(tipFixed ? { onFocus: () => showTip(b.slug), onBlur: hideTip } : {})}
            />
          ))}
        </g>
        <g className="cmap-labels" aria-hidden="true">
          {visible.map((b) => (
            <text key={b.slug} id={idsFixed ? undefined : b.slug} className="cmap-label" x={b.box[0] + b.box[2] / 2} y={b.box[1] + b.box[3] / 2 + 5} textAnchor="middle">{b.code}</text>
          ))}
        </g>

        {layers.entrances && (
          <g className="cmap-doors" aria-hidden="true">
            {visible.map((b) => { const [cx, cy] = doorPoint(b); return <circle key={b.slug} className="cmap-door" cx={cx} cy={cy} r="6" />; })}
          </g>
        )}

        <g className="cmap-here" aria-hidden="true" transform="translate(375 600)">
          <circle className="cmap-here-pulse" r="14" />
          <circle className="cmap-here-dot" r="6" />
          <text x="12" y="-10">You are here</text>
        </g>

        {tipB && (() => {
          const extra = tipB.accessCode ? `After-hours code: ${tipB.accessCode}` : "";
          const w = Math.max(tipB.name.length, extra.length) * 8 + 20, h = extra ? 42 : 24;
          // Buildings at the top edge get the tooltip below them, so it stays inside the map.
          const below = tipB.box[1] < 60;
          const y = below ? tipB.box[1] + tipB.box[3] + 8 + h : tipB.box[1] - 8;
          const x = Math.max(w / 2 + 4, tipB.box[0] + tipB.box[2] / 2);
          return (
            <g className="cmap-tip" aria-hidden="true" transform={`translate(${x} ${y})`}>
              <rect x={-w / 2} y={-h - 2} width={w} height={h} rx="4" />
              <text y={extra ? -27 : -9} textAnchor="middle">{tipB.name}</text>
              {extra && <text y="-9" textAnchor="middle">{extra}</text>}
            </g>
          );
        })()}
      </svg>
      {panFixed && <p id="cmap-instructions" className="cmap-hint">Select the map, then use the arrow keys to pan and + or − to zoom. Every building is also listed below the map.</p>}
    </div>
  );
}

// Wheelchair glyph for accessible entrances (generic International Symbol of Access shape).
const ACCESS_ICON = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1a5fb4"/><g fill="none" stroke="#fff" stroke-width="2"><circle cx="11" cy="14.5" r="4.5"/><path d="M10 9.5V13h5l2 5"/></g><circle cx="10" cy="6" r="1.8" fill="#fff"/></svg>',
);

function BuildingDetail({ building, onClose, headingRef }: { building?: Building; onClose: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const headingFixed = useScenario("campus-map-detail-heading-empty-001");
  const skipFixed = useScenario("campus-map-detail-heading-skip-001");
  const altFixed = useScenario("campus-map-entrance-icon-alt-001");
  useScenario("campus-map-close-button-001");
  useScenario("campus-map-detail-more-001");
  const H = skipFixed ? "h3" : "h5";
  return (
    <div className="cmap-detail" data-a11y-scenario="campus-map-detail-heading-empty-001 campus-map-detail-heading-skip-001 campus-map-entrance-icon-alt-001 campus-map-close-button-001 campus-map-detail-more-001">
      {!building ? (
        <>
          {headingFixed ? <h2 ref={headingRef} tabIndex={-1} className="cmap-detail-title">Building details</h2> : <h2 className="cmap-detail-title" />}
          <p className="cmap-detail-empty">Select a building on the map to see its hours, entrances and what's inside.</p>
        </>
      ) : (
        <>
          <div className="cmap-detail-head">
            <h2 ref={headingRef} tabIndex={-1} className="cmap-detail-title">{building.name} <span className="cmap-code">{building.code}</span></h2>
            <IconButton scenario="campus-map-close-button-001" label="Close building details" icon="×" className="cmap-close" onClick={onClose} />
          </div>
          <p className="cmap-detail-address">{building.name}, {ADDRESS}</p>
          <H>Hours</H>
          <p>{building.hours}</p>
          <H>Entrances</H>
          <ul className="cmap-entrances">
            {entrances(building).map((en) => (
              <li key={en.text}>
                {en.accessible ? <img src={ACCESS_ICON} width="18" height="18" alt={altFixed ? "Accessible entrance" : ""} /> : <span className="cmap-entrance-gap" />}
                {en.text}
              </li>
            ))}
          </ul>
          <H>In this building</H>
          <p>{building.uses}</p>
          <p><SmartLink scenario="campus-map-detail-more-001" to={building.link.href} defect="Learn more">Visit {building.link.label}</SmartLink></p>
        </>
      )}
    </div>
  );
}

function BuildingDirectory() {
  const headingFixed = useScenario("campus-map-directory-heading-001");
  const captionFixed = useScenario("campus-map-directory-caption-001");
  const t = directory.table!;
  return (
    <section className="stack cmap-directory" aria-labelledby={headingFixed ? "cmap-directory-heading" : undefined} data-a11y-scenario="campus-map-directory-heading-001 campus-map-directory-caption-001">
      {headingFixed ? <h2 id="cmap-directory-heading">{directory.heading}</h2> : <p className="fake-heading"><strong>{directory.heading}</strong></p>}
      <div className="table-wrap">
        <table className="data-table">
          {captionFixed && <caption>Major campus buildings, building codes and uses</caption>}
          <thead><tr>{t.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>
            {t.rows.map((r) => <tr key={r[1]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
