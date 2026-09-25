import { Link, useNavigate } from "react-router";
import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { Callout } from "~/components/Callout";
import { CtaBand } from "~/components/blocks";
import { LinkList, content } from "./_content";

export { inventoryMeta as meta } from "~/routes/meta";

export default function AdmissionsProcess() {
  const c = content("/admissions/process")!;
  const listFixed = useScenario("adm-process-stepper-list-001");
  useScenario("adm-process-number-contrast-001"); // CSS scenario (marketing.css)
  const List = listFixed ? "ol" : "div";

  return (
    <div className="adm-process">
      <Hero title="How to Apply" kicker="Admissions" lede={c.summary} image="admissions-hero-tour" imageAlt="" />
      <div className="page-content">
        <List className="adm-stepper" data-a11y-scenario="adm-process-stepper-list-001 adm-process-number-contrast-001">
          {c.sections.map((s, i) => {
            const [, title] = s.heading!.split(": ");
            return (
              <li key={i} className="adm-step">
                <span className="adm-step-number" aria-hidden="true">{i + 1}</span>
                <div className="stack">
                  <Heading scenario="adm-process-heading-skip-001" level={2} defect="skipped" defectLevel={3}>
                    <span className="visually-hidden">Step {i + 1}: </span>{title}
                  </Heading>
                  {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {s.links && (i === 1
                    ? <StartLink />
                    : <LinkList links={s.links} fixes={{ RedwoodConnect: { scenario: "adm-process-portal-new-window-001", newWindow: true, text: "Log in to RedwoodConnect" } }} />)}
                </div>
              </li>
            );
          })}
        </List>

        <Callout title="Need help with your application?">
          <p>Your regional admissions counselor can help. Call (707) 555-0120 or visit Founders Hall 110, Monday through Friday, 8 a.m. to 5 p.m.</p>
        </Callout>

        <CtaBand title="Start your application" text="Applications for fall 2027 are accepted October 1 through December 1, 2026." action={{ label: "Application for Admission", href: "/admissions/apply" }} />
      </div>
    </div>
  );
}

/** adm-process-start-js-link-001: an href="#" link that navigates in a click handler. */
function StartLink() {
  const fixed = useScenario("adm-process-start-js-link-001");
  const navigate = useNavigate();
  return (
    <p data-a11y-scenario="adm-process-start-js-link-001">
      {fixed
        ? <Link to="/admissions/apply" className="btn btn--primary">Start the Application for Admission</Link>
        : <a href="#" className="btn btn--primary" onClick={(e) => { e.preventDefault(); navigate("/admissions/apply"); }}>Start the Application for Admission</a>}
    </p>
  );
}
