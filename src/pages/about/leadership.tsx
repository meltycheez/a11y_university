import { useState } from "react";
import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { Modal } from "~/components/Modal";
import { leadership } from "~/data/catalog";
import { leadershipBios, type LeadershipBio } from "~/data/content/people";
import { Copy, copyFor } from "./_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/about/leadership");
const [intro] = content.sections;
const leaders = leadership.map((p) => leadershipBios[p.slug]);
const mail = <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.3Zm1.8-.4L12 11.1 18.2 7Z" /></svg>;

export default function LeadershipPage() {
  const [open, setOpen] = useState<LeadershipBio | null>(null);
  // CSS scenarios (flagship.css).
  useScenario("about-leadership-title-contrast-001");
  useScenario("about-leadership-trigger-focus-001");

  return (
    <>
      <Hero title="University Leadership" kicker="About Redwood State" lede={content.summary} variant="banner" />
      <div className="page-content">
        <Copy section={intro} />

        <section aria-labelledby="cabinet-heading" className="stack">
          <h2 id="cabinet-heading">President's Cabinet</h2>
          <ul
            className="leader-grid"
            data-a11y-scenario="about-leadership-title-contrast-001 about-leadership-trigger-focus-001"
          >
            {leaders.map((l) => <LeaderCard key={l.slug} leader={l} onOpen={() => setOpen(l)} />)}
          </ul>
        </section>

        <div className="about-leadership-contact">
          <ContactCard
            title="Office of the President"
            lines={[
              { label: "Office", value: "Founders Hall 300, 1400 Canopy Drive, Arcadia Falls, CA 95579" },
              { label: "Phone", value: "(707) 555-0101", href: "tel:7075550101" },
              { label: "Email", value: "president@redwoodstate.example.edu", href: "mailto:president@redwoodstate.example.edu" },
            ]}
          />
          <RelatedLinks
            title="Related"
            links={[
              { label: "Strategic Plan 2030", href: "/about/strategic-plan" },
              { label: "Mission, Vision & Values", href: "/about/mission" },
              { label: "Our History", href: "/about/history" },
            ]}
          />
        </div>
        {content.updated && <p className="page-updated">{content.updated}</p>}
      </div>

      <Modal open={open !== null} title={open?.name ?? ""} onClose={() => setOpen(null)}>
        {open && (
          <div className="leader-bio stack">
            <p className="leader-bio-title">{open.title}</p>
            <p>{open.bio}</p>
            <dl className="leader-bio-contact">
              <div><dt>Office</dt><dd>{open.office}</dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:${open.phone.replace(/\D/g, "")}`}>{open.phone}</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${open.email}`}>{open.email}</a></dd></div>
              {open.assistant && <div><dt>Executive assistant</dt><dd>{open.assistant.name}, {open.assistant.phone}</dd></div>}
            </dl>
          </div>
        )}
      </Modal>
    </>
  );
}

function LeaderCard({ leader, onOpen }: { leader: LeadershipBio; onOpen: () => void }) {
  const triggerFixed = useScenario("about-leadership-bio-trigger-001");
  const emailFixed = useScenario("about-leadership-email-empty-001");
  const label = <>Read bio<span className="visually-hidden">{triggerFixed ? `: ${leader.name}` : ""}</span></>;
  return (
    <li className="leader-card">
      <Img
        image={leader.image}
        alt={leader.name}
        scenario="about-leadership-photo-alt-001"
        fixedAlt=""
        className="leader-photo"
        sizes="(min-width: 60rem) 16rem, 50vw"
        aspect="4 / 5"
      />
      <div className="leader-body">
        <Heading scenario="about-leadership-name-heading-001" level={3} defect="fake" className="leader-name">{leader.name}</Heading>
        <p className="leader-title">{leader.title}</p>
        <div className="leader-actions">
          {triggerFixed
            ? <button type="button" className="leader-trigger" onClick={onOpen} data-a11y-scenario="about-leadership-bio-trigger-001">{label}</button>
            : <a href="#" className="leader-trigger" onClick={(e) => { e.preventDefault(); onOpen(); }} data-a11y-scenario="about-leadership-bio-trigger-001">{label}</a>}
          <a href={`mailto:${leader.email}`} className="leader-email" data-a11y-scenario="about-leadership-email-empty-001">
            {mail}
            {emailFixed && <span className="visually-hidden">Email {leader.name}</span>}
          </a>
        </div>
      </div>
    </li>
  );
}
