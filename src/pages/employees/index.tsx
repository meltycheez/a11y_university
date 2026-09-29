import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { ContactCard } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/employees");
const [quick, announcements] = content.sections;
const links = quick.links!;

export default function EmployeesPage() {
  const layoutFixed = useScenario("employees-home-links-layout-table-001");
  const essFixed = useScenario("employees-home-ess-link-001");
  useScenario("employees-home-maintained-small-001"); // CSS scenario (intranet.css)

  // Old intranet layout: quick links in a 3-column table.
  const rows = [0, 3, 6].map((i) => links.slice(i, i + 3));

  return (
    <>
      <Hero title="Faculty & Staff Resources" lede={content.summary} image="employees-hero-office" imageScenario="employees-home-hero-alt-001" variant="banner" />
      <div className="page-content intranet-home">
        <Announcements items={announcements.list!} />

        <section aria-labelledby="quick-heading" data-a11y-scenario="employees-home-links-layout-table-001">
          <h2 id="quick-heading">Quick links</h2>
          {layoutFixed ? (
            <ul className="link-grid">{links.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}</ul>
          ) : (
            <table className="intranet-links" width="100%" cellPadding={4}>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>{r.map((l) => <td key={l.href}><Link to={l.href}>{l.label}</Link></td>)}</tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <Callout title="Employee Self-Service">
          <p>
            View pay statements, update direct deposit, and change tax withholding in{" "}
            {essFixed ? (
              <Link to="/employees/payroll" data-a11y-scenario="employees-home-ess-link-001">RedwoodConnect Employee Self-Service (see Payroll Services)</Link>
            ) : (
              <a href="#" onClick={(e) => e.preventDefault()} data-a11y-scenario="employees-home-ess-link-001">RedwoodConnect Employee Self-Service</a>
            )}.
          </p>
        </Callout>

        <ContactCard
          title="HR Service Center"
          lines={[
            { label: "Location", value: "Founders Hall 210" },
            { label: "Phone", value: "(707) 555-0180", href: "tel:7075550180" },
            { label: "Email", value: "hr@redwoodstate.edu", href: "mailto:hr@redwoodstate.edu" },
            { label: "Hours", value: "Monday–Friday, 8 a.m. to 4:30 p.m." },
          ]}
        />
        <p className="page-updated intranet-maintained" data-a11y-scenario="employees-home-maintained-small-001">{content.updated}</p>
      </div>
    </>
  );
}

/** employees-home-announce-rotate-001: announcements rotate every 5 seconds with no pause control. */
function Announcements({ items }: { items: string[] }) {
  const fixed = useScenario("employees-home-announce-rotate-001");
  const [i, setI] = useState(0);
  useEffect(() => {
    if (fixed) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [fixed, items.length]);

  return (
    <section className="intranet-announcements" aria-labelledby="announce-heading" data-a11y-scenario="employees-home-announce-rotate-001">
      <h2 id="announce-heading">Announcements</h2>
      {fixed
        ? <ul>{items.map((a) => <li key={a}>{a}</li>)}</ul>
        : <p className="announcement-rotator">{items[i]} <span className="announcement-count">({i + 1} of {items.length})</span></p>}
    </section>
  );
}
