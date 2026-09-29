import { useState } from "react";
import { Link } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { CtaBand, StatsBand, VideoEmbed } from "~/components/blocks";
import { copyFor } from "./about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/alumni");
const [main] = content.sections;
const link = (label: string) => main.links!.find((l) => l.label === label)!;

const features = [
  { ...link("Homecoming 2026"), image: "event-homecoming-2026", text: "Reunions, the alumni dinner, and the Golden Owl class challenge." },
  { ...link("Alumni News"), image: "news-alumna-salmon-sensor-startup", text: "Stories of Owls making a difference, from river sensors to classrooms." },
  { ...link("Alumni Giving"), image: "giving-hero-scholars", text: "Class challenges and scholarships funded by graduates." },
  { ...link("Order transcripts"), image: "campus-career-center", text: "Request official transcripts or verify your degree through the Registrar." },
];

const chapters = [
  { name: "Westmere", email: "westmere.chapter@redwoodstate.edu", note: "Monthly mixers and a spring networking night." },
  { name: "Kestrel Bay", email: "kestrelbay.chapter@redwoodstate.edu", note: "Coastal cleanups and a summer picnic." },
  { name: "San Aurelio", email: "sanaurelio.chapter@redwoodstate.edu", note: "Career panels with alumni in tech and health care." },
  { name: "The state capital", email: "capital.chapter@redwoodstate.edu", note: "Public service alumni and legislative internship mentors." },
  { name: "Pacific Northwest", email: "pnw.chapter@redwoodstate.edu", note: "Owls in Oregon and Washington; game-watch parties." },
];

const social = [
  { label: "PhotoPine", glyph: "◉" },
  { label: "ReelWave", glyph: "▶" },
  { label: "WorkCircle", glyph: "◎" },
];

export default function AlumniPage() {
  const socialFixed = useScenario("audience-alumni-social-empty-001");
  useScenario("audience-alumni-badge-contrast-001"); // CSS scenario (flagship.css)

  return (
    <>
      <Hero
        title="Alumni"
        kicker="RSU Alumni Association"
        lede={content.summary}
        image="alumni-hero-reunion"
        imageAlt="reunion_final_v2.jpg"
        imageScenario="audience-alumni-hero-alt-001"
      >
        <ButtonLink to="/giving/alumni">Give back</ButtonLink>
        <ButtonLink to="/events/homecoming-2026" variant="secondary">Homecoming 2026</ButtonLink>
      </Hero>

      <div className="page-content alumni-page">
        <section className="stack" aria-labelledby="association-heading">
          <h2 id="association-heading">
            The RSU Alumni Association{" "}
            <span className="alumni-badge" data-a11y-scenario="audience-alumni-badge-contrast-001">Free membership</span>
          </h2>
          {main.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          <ul>{main.list?.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <StatsBand
          label="Alumni by the numbers"
          stats={[
            { value: "112,000+", label: "living alumni" },
            { value: "5", label: "regional chapters" },
            { value: "$0", label: "membership dues" },
          ]}
        />

        <section className="stack" aria-labelledby="stay-heading">
          <h2 id="stay-heading">Stay connected</h2>
          <ul className="alumni-features" data-a11y-scenario="audience-alumni-card-redundant-001">
            {features.map((f) => <FeatureCard key={f.href} {...f} />)}
          </ul>
        </section>

        <section className="stack" aria-labelledby="chapters-heading">
          <h2 id="chapters-heading">Regional chapters</h2>
          <ul className="alumni-chapters" data-a11y-scenario="audience-alumni-chapter-hover-001">
            {chapters.map((c) => <Chapter key={c.name} {...c} />)}
          </ul>
        </section>

        <VideoEmbed
          title="Homecoming 2025 highlights"
          caption="Homecoming & Family Weekend 2025: the alumni dinner, the Golden Owl trophy, and the Owls' win at Redwood Field."
          titleScenario="audience-alumni-video-title-001"
        />

        <section className="stack" aria-labelledby="follow-heading">
          <h2 id="follow-heading">Follow RSU Alumni</h2>
          <ul className="alumni-social" data-a11y-scenario="audience-alumni-social-empty-001">
            {social.map((s) => (
              <li key={s.label}>
                <a href={`#alumni-${s.label.toLowerCase()}`}>
                  <span aria-hidden="true">{s.glyph}</span>
                  {socialFixed && <span className="visually-hidden">RSU Alumni on {s.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <CtaBand title="Mentor a current student" text="Owl-to-Owl pairs alumni with students for one conversation a month." action={{ label: "Order transcripts and records", href: "/students/registrar" }} />
      </div>
    </>
  );
}

/** audience-alumni-card-redundant-001: the photo and the title are separate links to the same page. */
function FeatureCard({ label, href, image, text }: { label: string; href: string; image: string; text: string }) {
  const fixed = useScenario("audience-alumni-card-redundant-001");
  const img = <Img image={image} alt={fixed ? "" : label} sizes="(min-width: 60rem) 22vw, 100vw" aspect="4 / 3" className="card-image" />;
  return (
    <li className="card">
      {fixed ? img : <Link to={href} className="card-image-link">{img}</Link>}
      <div className="card-body">
        <h3 className="card-title"><Link to={href}>{label}</Link></h3>
        <p className="card-text">{text}</p>
      </div>
    </li>
  );
}

/** audience-alumni-chapter-hover-001: chapter contacts appear on mouseover only. */
function Chapter({ name, email, note }: { name: string; email: string; note: string }) {
  const fixed = useScenario("audience-alumni-chapter-hover-001");
  const [open, setOpen] = useState(false);
  const id = `chapter-${name.toLowerCase().replace(/\W+/g, "-")}`;
  const details = (
    <div id={id} className="chapter-details" hidden={!open}>
      <p>{note}</p>
      <p><a href={`mailto:${email}`}>{email}</a></p>
    </div>
  );
  if (fixed) {
    return (
      <li className="chapter">
        <h3 className="chapter-name">
          <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{name}</button>
        </h3>
        {details}
      </li>
    );
  }
  return (
    <li className="chapter" onMouseOver={() => setOpen(true)} onMouseOut={() => setOpen(false)}>
      <h3 className="chapter-name">{name}</h3>
      {details}
    </li>
  );
}
