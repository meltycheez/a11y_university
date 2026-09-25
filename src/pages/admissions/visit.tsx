import { useState } from "react";
import { Link } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { Callout } from "~/components/Callout";
import { VideoEmbed } from "~/components/blocks";
import { SITE_NOW, addDays, formatDate } from "~/data/site";
import { LinkList, Table, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOf = (iso: string) => DAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()];

/** Upcoming weekday walking tours after SITE_NOW (static until plan 06's date picker replaces this list). */
function upcomingTours(count: number) {
  const slots: { date: string; time: string; key: string }[] = [];
  for (let d = 1; slots.length < count; d++) {
    const date = addDays(SITE_NOW, d);
    if (["Saturday", "Sunday"].includes(dayOf(date))) continue;
    slots.push({ date, time: "10:00 a.m.", key: `${date}-10am` }, { date, time: "2:00 p.m.", key: `${date}-2pm` });
  }
  return slots.slice(0, count);
}

const GALLERY = [
  { image: "campus-library-interior", defect: "DSC_0192.JPG", caption: "Sequoia Library reading room" },
  { image: "campus-dining-hall", defect: "DSC_0247.JPG", caption: "Lunch at the dining commons" },
  { image: "campus-housing-madrone", defect: "DSC_0311.JPG", caption: "A double room in Madrone Hall" },
];

export default function Visit() {
  const c = content("/admissions/visit")!;
  const [intro, schedule] = c.sections;
  const [open, setOpen] = useState(false);
  const moreFixed = useScenario("adm-visit-more-dates-001");
  useScenario("adm-visit-saturday-contrast-001"); // CSS scenarios (marketing.css): register only.
  useScenario("adm-visit-reserve-focus-001");
  const tours = upcomingTours(open ? 12 : 6);
  const toggle = () => setOpen((o) => !o);

  return (
    <div className="adm-visit">
      <Hero title="Visit Campus" kicker="Admissions" lede={c.summary} image="admissions-hero-tour" imageScenario="adm-visit-hero-alt-001">
        <a href="#choose-date" className="btn btn--primary">Choose a tour date</a>
      </Hero>
      <div className="page-content">
        <p className="adm-lead">{intro.paragraphs![0]}</p>

        <section className="stack">
          <Heading scenario="adm-visit-tips-heading-001" level={2} defect="fake">Before you come</Heading>
          <ul>
            <li>Tours depart from the Welcome Center in Founders Hall 110.</li>
            <li>Plan on about 90 minutes of walking, including a residence hall and Sequoia Library.</li>
            <li>Wear comfortable shoes and bring a rain jacket.</li>
          </ul>
        </section>

        <section className="stack" aria-labelledby="schedule-heading">
          <h2 id="schedule-heading">{schedule.heading}</h2>
          <Table table={schedule.table!} caption="Weekly campus tour schedule" captionScenario="adm-visit-schedule-caption-001" />
          <div className="adm-saturday" data-a11y-scenario="adm-visit-saturday-contrast-001">
            <Callout title="Saturday tours">
              <p>Saturday tours run at 11:00 a.m. on select Saturdays, September through April. Dates fill quickly in the spring.</p>
            </Callout>
          </div>
        </section>

        {/* Static placeholder: plan 06 replaces this list with the visit date picker and booking dialog. */}
        <section className="stack adm-dates" id="choose-date" aria-labelledby="dates-heading" data-a11y-scenario="adm-visit-reserve-focus-001">
          <h2 id="dates-heading">Choose a date</h2>
          <p>Upcoming weekday campus walking tours. Pick a time to reserve your spot.</p>
          <ul className="adm-date-list">
            {tours.map((t) => (
              <li key={t.key}>
                <span className="adm-date">{dayOf(t.date)}, {formatDate(t.date)}</span>
                <span className="adm-time">{t.time}</span>
                <ReserveLink date={t.date} time={t.time} />
              </li>
            ))}
          </ul>
          {moreFixed
            ? <button type="button" className="btn btn--secondary" aria-expanded={open} onClick={toggle} data-a11y-scenario="adm-visit-more-dates-001">{open ? "Show fewer dates" : "Show more dates"}</button>
            : <div className="btn btn--secondary" onClick={toggle} data-a11y-scenario="adm-visit-more-dates-001">{open ? "Show fewer dates" : "Show more dates"}</div>}
        </section>

        <section className="stack" aria-labelledby="virtual-heading">
          <h2 id="virtual-heading">Can't make it to the redwoods?</h2>
          <p>Join a virtual information session with an admissions counselor on Tuesdays at 5:00 p.m., or watch the tour video.</p>
          <VideoEmbed title="Redwood State virtual campus tour" titleScenario="adm-visit-video-title-001" />
        </section>

        <section className="stack" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading">What you'll see</h2>
          <div className="gallery" data-a11y-scenario="adm-visit-gallery-alt-001">
            {GALLERY.map((g) => (
              <figure key={g.image}>
                <Img image={g.image} alt={g.defect} scenario="adm-visit-gallery-alt-001" fixedAlt="" sizes="(min-width: 60rem) 30vw, 100vw" aspect="4 / 3" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <nav className="related-links" aria-label="Plan your trip">
          <h2>Plan your trip</h2>
          <LinkList links={schedule.links!} fixes={{ "Directions and parking": { scenario: "adm-visit-directions-new-window-001", newWindow: true } }} />
        </nav>
      </div>
    </div>
  );
}

function ReserveLink({ date, time }: { date: string; time: string }) {
  const fixed = useScenario("adm-visit-reserve-generic-001");
  return (
    <Link to={`/admissions/visit?date=${date}&time=${encodeURIComponent(time)}`} className="btn btn--primary adm-reserve" data-a11y-scenario="adm-visit-reserve-generic-001">
      Reserve{fixed && <span className="visually-hidden"> a spot on the {formatDate(date)} {time} tour</span>}
    </Link>
  );
}
