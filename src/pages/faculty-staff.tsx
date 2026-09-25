import { Heading } from "~/a11y/helpers";
import { Link } from "react-router";
import { Callout } from "~/components/Callout";
import { Hero } from "~/components/Hero";
import { CtaBand } from "~/components/blocks";
import { copyFor } from "./about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/faculty-staff");
const links = content.sections[0].links!;

export default function FacultyStaffPage() {
  return (
    <>
      <Hero title="Faculty & Staff" kicker="Redwood State University" lede={content.summary} image="employees-hero-office" variant="banner" />
      <div className="page-content">
        <section className="stack">
          {/* The CMS "section title" field was left blank. */}
          <Heading scenario="audience-facstaff-heading-empty-001" level={2} defect="empty">Quick links</Heading>
          <ul className="link-grid quick-links">
            {links.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}
          </ul>
        </section>

        <Callout title="Open enrollment">
          <p>Open enrollment for 2027 benefits runs October 12 – November 6, 2026. Review plan changes on the Benefits page before you enroll.</p>
        </Callout>

        <CtaBand title="Looking for a colleague?" text="Search faculty and staff by name, department, or phone number." action={{ label: "Open the Employee Directory", href: "/employees/directory" }} />
      </div>
    </>
  );
}
