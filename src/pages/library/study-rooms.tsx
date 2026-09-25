// /library/study-rooms: availability grid with drag-to-book (plan 06 #12). Bookings live in React state only.
import { useCallback, useEffect, useRef, useState } from "react";
import { useScenario } from "~/a11y/useScenario";
import { SmartLink } from "~/a11y/helpers";
import { ContactCard } from "~/components/blocks";
import { Img } from "~/components/Img";
import { Toast } from "~/components/widgets";
import { addDays, formatDate, SITE_NOW } from "~/data/site";
import { confirmationCode, latency } from "~/lib/interactive";

export { inventoryMeta as meta } from "~/routes/meta";

const ROOMS = [
  { id: "201", seats: 4, floor: 2, equipment: "Whiteboard" },
  { id: "202", seats: 4, floor: 2, equipment: "Whiteboard" },
  { id: "205", seats: 6, floor: 2, equipment: "Display screen, whiteboard" },
  { id: "208", seats: 8, floor: 2, equipment: "Display screen, conference phone" },
  { id: "212", seats: 10, floor: 2, equipment: "Projector, whiteboard wall" },
  { id: "304", seats: 2, floor: 3, equipment: "Quiet room" },
  { id: "306", seats: 4, floor: 3, equipment: "Quiet room, whiteboard" },
  { id: "310", seats: 6, floor: 3, equipment: "Quiet room, display screen" },
];
const HOURS = Array.from({ length: 12 }, (_, i) => 9 + i); // 9 a.m. – 8 p.m. starts
const MAX_HOURS = 2; // per student per day
const hourLabel = (h: number) => (h === 12 ? "12 p.m." : h < 12 ? `${h} a.m.` : `${h - 12} p.m.`);
const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DATES = Array.from({ length: 7 }, (_, i) => addDays(SITE_NOW, i));
const weekday = (iso: string) => WEEKDAY[new Date(`${iso}T00:00:00Z`).getUTCDay()];

/** Deterministic "booked" pattern: busier in the afternoon and early in the week. */
function isBooked(room: number, hour: number, dayIndex: number): boolean {
  const n = (room * 7 + hour * 13 + dayIndex * 29) % 10;
  return n < (hour >= 13 && hour <= 17 ? 6 : 3) + (dayIndex < 3 ? 1 : 0);
}

interface Range { r: number; from: number; to: number }
const slotKey = (day: number, r: number, h: number) => `${day}-${r}-${h}`;
const hoursOf = (s: Range) => Array.from({ length: s.to - s.from + 1 }, (_, i) => s.from + i);
const describe = (s: Range, day: number) => `Room ${ROOMS[s.r].id}, ${weekday(DATES[day])}, ${formatDate(DATES[day])}, ${hourLabel(s.from)}–${hourLabel(s.to + 1)}`;

export default function StudyRooms() {
  const [dayIndex, setDayIndex] = useState(0);
  const selectFixed = useScenario("library-rooms-date-select-001");
  const tabFixed = useScenario("library-rooms-tabindex-001");
  const headersFixed = useScenario("library-rooms-headers-001");
  const colorFixed = useScenario("library-rooms-color-only-001");
  const captionFixed = useScenario("library-rooms-caption-001");
  const reflowFixed = useScenario("library-rooms-reflow-001"); // defect CSS in library.css
  const dragFixed = useScenario("library-rooms-drag-001");
  const date = DATES[dayIndex];

  const [mine, setMine] = useState<ReadonlySet<string>>(new Set());
  const [sel, setSel] = useState<Range | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const drag = useRef<{ r: number; anchor: number } | null>(null);
  const dismiss = useCallback(() => setToast(null), []);

  const taken = (r: number, h: number, day = dayIndex) => isBooked(r, h, day) || mine.has(slotKey(day, r, h));
  const minesToday = [...mine].filter((k) => k.startsWith(`${dayIndex}-`)).length;

  useEffect(() => {
    const end = () => { drag.current = null; };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => { window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
  }, []);
  useEffect(() => { setSel(null); setError(""); }, [dayIndex]);

  /** Grows the selection from the anchor toward `h`, stopping at a taken slot or the daily limit. */
  function extend(r: number, anchor: number, h: number): Range {
    const dir = h >= anchor ? 1 : -1;
    let end = anchor;
    while (end !== h && Math.abs(end + dir - anchor) < MAX_HOURS && !taken(r, end + dir)) end += dir;
    return { r, from: Math.min(anchor, end), to: Math.max(anchor, end) };
  }

  // Pointer drag across one room's row. elementFromPoint makes it work for touch too (touch pointers stay captured
  // by the cell they started on, so pointerenter never fires on the others).
  const onPointerDown = (e: React.PointerEvent, r: number, h: number) => {
    if (taken(r, h)) return;
    e.preventDefault();
    drag.current = { r, anchor: h };
    setError("");
    setSel({ r, from: h, to: h });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const cell = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>("[data-slot]");
    if (!cell) return;
    const [r, h] = cell.dataset.slot!.split("-").map(Number);
    if (r === drag.current.r) setSel(extend(r, drag.current.anchor, h));
  };

  async function reserve(s: Range) {
    if (hoursOf(s).some((h) => taken(s.r, h))) return setError("That time is no longer open. Choose another slot.");
    if (minesToday + hoursOf(s).length > MAX_HOURS) return setError(`You can reserve up to ${MAX_HOURS} hours per day. You already have ${minesToday} on ${formatDate(date)}.`);
    setError("");
    setBusy(true);
    await latency(`study-room-${slotKey(dayIndex, s.r, s.from)}`);
    setBusy(false);
    setMine((m) => new Set([...m, ...hoursOf(s).map((h) => slotKey(dayIndex, s.r, h))]));
    setSel(null);
    setToast(`Reserved: ${describe(s, dayIndex)}. Confirmation ${confirmationCode(`room-${slotKey(dayIndex, s.r, s.from)}-${s.to}`)}.`);
  }

  const slotText = (booked: boolean, own: boolean, selected: boolean) =>
    !colorFixed ? "" : selected ? "Selected" : own ? "Yours" : booked ? "Booked" : "Open";

  return (
    <div className="page-content lib-rooms">
      <header>
        <h1 id="page-title">Study Room Reservations</h1>
        <p>Reserve a group study room in Sequoia Library. Current RSU students may reserve up to 2 hours per day and 6 hours per week. Rooms are held for 15 minutes past the start of a reservation. Rooms on the 3rd floor are designated quiet rooms.</p>
      </header>

      <figure className="lib-rooms-photo">
        <Img image="campus-library-interior" alt="The second-floor reading room is open to everyone; group study rooms are on floors 2 and 3." scenario="library-rooms-photo-alt-001" sizes="(min-width: 60rem) 36rem, 100vw" />
        <figcaption>The second-floor reading room is open to everyone; group study rooms are on floors 2 and 3.</figcaption>
      </figure>

      <section aria-labelledby="availability-heading" data-a11y-scenario="library-rooms-drag-001">
        <h2 id="availability-heading">Availability</h2>
        <div className="lib-rooms-date" data-a11y-scenario="library-rooms-date-select-001 library-rooms-tabindex-001">
          {selectFixed ? <label htmlFor="room-date">Date</label> : <span className="lib-tool-label">Date</span>}
          <select id="room-date" value={dayIndex} tabIndex={tabFixed ? undefined : 1} onChange={(e) => setDayIndex(Number(e.target.value))}>
            {DATES.map((d, i) => <option key={d} value={i}>{weekday(d)}, {formatDate(d)}</option>)}
          </select>
        </div>

        <p className="lib-rooms-hint">To book, press on an open slot and drag across the row to choose up to {MAX_HOURS} hours, then select Reserve.</p>

        {colorFixed && (
          <p className="lib-rooms-legend"><span className="lib-slot lib-slot--open">Open</span> can be reserved · <span className="lib-slot lib-slot--booked">Booked</span> already reserved · <span className="lib-slot lib-slot--mine">Yours</span> your reservation</p>
        )}

        <div className="lib-rooms-grid" {...(reflowFixed ? { tabIndex: 0, role: "region", "aria-label": "Room availability" } : {})} data-a11y-scenario="library-rooms-headers-001 library-rooms-color-only-001 library-rooms-caption-001 library-rooms-reflow-001">
          <table className="lib-rooms-table" onPointerMove={onPointerMove}>
            {captionFixed && <caption>Study room availability, {weekday(date)}, {formatDate(date)}</caption>}
            <thead>
              <tr>
                <th scope={headersFixed ? "col" : undefined}>Room</th>
                {HOURS.map((h) => <th key={h} id={`h-${h}`} scope={headersFixed ? "col" : undefined}>{hourLabel(h)}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROOMS.map((room, r) => (
                <tr key={room.id}>
                  {headersFixed
                    ? <th scope="row">Room {room.id} <span className="lib-small">({room.seats} seats)</span></th>
                    : <td id={`r-${room.id}`} className="lib-rooms-name">Room {room.id} <span className="lib-small">({room.seats} seats)</span></td>}
                  {HOURS.map((h) => {
                    const own = mine.has(slotKey(dayIndex, r, h));
                    const booked = !own && isBooked(r, h, dayIndex);
                    const selected = sel?.r === r && h >= sel.from && h <= sel.to;
                    const state = selected ? "selected" : own ? "mine" : booked ? "booked" : "open";
                    return (
                      <td
                        key={h}
                        headers={headersFixed ? undefined : `room-${room.id} hour-${h}`}
                        className={`lib-slot lib-slot--${state}`}
                        {...(state === "open" || state === "selected" ? { "data-slot": `${r}-${h}`, onPointerDown: (e: React.PointerEvent) => onPointerDown(e, r, h) } : {})}
                      >
                        {slotText(booked, own, selected)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lib-rooms-selection">
          {sel ? (
            <>
              <span><strong>Selected:</strong> {describe(sel, dayIndex)}</span>
              <button type="button" className="lib-btn" disabled={busy} onClick={() => reserve(sel)}>{busy ? "Reserving…" : "Reserve"}</button>
              <button type="button" className="lib-btn lib-btn--plain" onClick={() => setSel(null)}>Clear</button>
            </>
          ) : <span className="lib-small">No time selected.</span>}
        </div>

        {dragFixed && <PickerForm dayIndex={dayIndex} busy={busy} onReserve={reserve} />}
        {error && <p className="lib-rooms-error" role={dragFixed ? "alert" : undefined}>{error}</p>}
      </section>

      <Toast message={toast} onDismiss={dismiss} scenario="library-rooms-toast-001" defect="vanishes" />

      <section aria-labelledby="rooms-heading">
        <h2 id="rooms-heading">Rooms and equipment</h2>
        <ul className="lib-room-list">
          {ROOMS.map((r) => <li key={r.id}><strong>Room {r.id}</strong> · Floor {r.floor} · {r.seats} seats · {r.equipment}</li>)}
        </ul>
      </section>

      <section aria-labelledby="booking-heading" className="stack">
        <h2 id="booking-heading">Booking help</h2>
        <p>Reservations made here are held under your RSU ID. You can also reserve a room at the Circulation Desk on the first floor or by phone; bring your RSU ID when you check in. Rooms not claimed within 15 minutes are released.</p>
        <p>
          <SmartLink scenario="library-rooms-policies-pdf-001" to="/documents/library-policies.pdf" defect="Library Policies (PDF)" fileInfo="PDF, 2 KB">Library Policies</SmartLink>
        </p>
        <ContactCard title="Circulation Desk" lines={[{ label: "Location", value: "Sequoia Library, 1st floor" }, { label: "Phone", value: "(707) 555-0271", href: "tel:+17075550271" }, { label: "Supervisor", value: "Paloma Ramirez, Access Services" }]} />
      </section>
    </div>
  );
}

/** Fixed state of library-rooms-drag-001: a labeled form that books the same slots without dragging. */
function PickerForm({ dayIndex, busy, onReserve }: { dayIndex: number; busy: boolean; onReserve: (s: Range) => void }) {
  const [r, setR] = useState(0);
  const [from, setFrom] = useState(HOURS[0]);
  const [len, setLen] = useState(1);
  const hours = HOURS.filter((h) => h + len - 1 <= HOURS[HOURS.length - 1]);
  return (
    <form className="lib-rooms-picker" onSubmit={(e) => { e.preventDefault(); onReserve({ r, from, to: Math.min(from + len - 1, HOURS[HOURS.length - 1]) }); }}>
      <fieldset>
        <legend>Or choose a room and time, {formatDate(DATES[dayIndex])}</legend>
        <label>Room <select value={r} onChange={(e) => setR(Number(e.target.value))}>{ROOMS.map((room, i) => <option key={room.id} value={i}>Room {room.id} ({room.seats} seats)</option>)}</select></label>
        <label>Start <select value={from} onChange={(e) => setFrom(Number(e.target.value))}>{hours.map((h) => <option key={h} value={h}>{hourLabel(h)}</option>)}</select></label>
        <label>Length <select value={len} onChange={(e) => setLen(Number(e.target.value))}>{Array.from({ length: MAX_HOURS }, (_, i) => <option key={i} value={i + 1}>{i + 1} hour{i ? "s" : ""}</option>)}</select></label>
        <button type="submit" className="lib-btn" disabled={busy}>Reserve</button>
      </fieldset>
    </form>
  );
}
