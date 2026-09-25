// /library/study-rooms: static availability table. The drag-to-book grid is a plan 06 widget (#12).
import { useState } from "react";
import { useScenario } from "~/a11y/useScenario";
import { SmartLink } from "~/a11y/helpers";
import { ContactCard } from "~/components/blocks";
import { Img } from "~/components/Img";
import { addDays, formatDate, SITE_NOW } from "~/data/site";

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
const hourLabel = (h: number) => (h === 12 ? "12 p.m." : h < 12 ? `${h} a.m.` : `${h - 12} p.m.`);
const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DATES = Array.from({ length: 7 }, (_, i) => addDays(SITE_NOW, i));
const weekday = (iso: string) => WEEKDAY[new Date(`${iso}T00:00:00Z`).getUTCDay()];

/** Deterministic "booked" pattern: busier in the afternoon and early in the week. */
function isBooked(room: number, hour: number, dayIndex: number): boolean {
  const n = (room * 7 + hour * 13 + dayIndex * 29) % 10;
  return n < (hour >= 13 && hour <= 17 ? 6 : 3) + (dayIndex < 3 ? 1 : 0);
}

export default function StudyRooms() {
  const [dayIndex, setDayIndex] = useState(0);
  const selectFixed = useScenario("library-rooms-date-select-001");
  const tabFixed = useScenario("library-rooms-tabindex-001");
  const headersFixed = useScenario("library-rooms-headers-001");
  const colorFixed = useScenario("library-rooms-color-only-001");
  const captionFixed = useScenario("library-rooms-caption-001");
  const reflowFixed = useScenario("library-rooms-reflow-001"); // defect CSS in library.css
  const date = DATES[dayIndex];

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

      <section aria-labelledby="availability-heading">
        <h2 id="availability-heading">Availability</h2>
        <div className="lib-rooms-date" data-a11y-scenario="library-rooms-date-select-001 library-rooms-tabindex-001">
          {selectFixed ? <label htmlFor="room-date">Date</label> : <span className="lib-tool-label">Date</span>}
          <select id="room-date" value={dayIndex} tabIndex={tabFixed ? undefined : 1} onChange={(e) => setDayIndex(Number(e.target.value))}>
            {DATES.map((d, i) => <option key={d} value={i}>{weekday(d)}, {formatDate(d)}</option>)}
          </select>
        </div>

        {colorFixed && (
          <p className="lib-rooms-legend"><span className="lib-slot lib-slot--open">Open</span> can be reserved · <span className="lib-slot lib-slot--booked">Booked</span> already reserved</p>
        )}

        <div className="lib-rooms-grid" {...(reflowFixed ? { tabIndex: 0, role: "region", "aria-label": "Room availability" } : {})} data-a11y-scenario="library-rooms-headers-001 library-rooms-color-only-001 library-rooms-caption-001 library-rooms-reflow-001">
          <table className="lib-rooms-table">
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
                    const booked = isBooked(r, h, dayIndex);
                    return (
                      <td
                        key={h}
                        headers={headersFixed ? undefined : `room-${room.id} hour-${h}`}
                        className={`lib-slot lib-slot--${booked ? "booked" : "open"}`}
                      >
                        {colorFixed ? (booked ? "Booked" : "Open") : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="rooms-heading">
        <h2 id="rooms-heading">Rooms and equipment</h2>
        <ul className="lib-room-list">
          {ROOMS.map((r) => <li key={r.id}><strong>Room {r.id}</strong> · Floor {r.floor} · {r.seats} seats · {r.equipment}</li>)}
        </ul>
      </section>

      <section aria-labelledby="booking-heading" className="stack">
        <h2 id="booking-heading">How to book</h2>
        <p>Online booking is moving to a new reservation system this term. Until it opens, reserve a room at the Circulation Desk on the first floor or by phone, and bring your RSU ID when you check in. Rooms not claimed within 15 minutes are released.</p>
        <p>
          <SmartLink scenario="library-rooms-policies-pdf-001" to="/documents/library-policies.pdf" defect="Library Policies (PDF)" fileInfo="PDF, 2 KB">Library Policies</SmartLink>
        </p>
        <ContactCard title="Circulation Desk" lines={[{ label: "Location", value: "Sequoia Library, 1st floor" }, { label: "Phone", value: "(707) 555-0271", href: "tel:+17075550271" }, { label: "Supervisor", value: "Paloma Ramirez, Access Services" }]} />
      </section>
    </div>
  );
}
