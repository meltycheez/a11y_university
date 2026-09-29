import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ButtonLink } from "~/components/Button";
import { Hero } from "~/components/Hero";
import { ContactCard, CtaBand, Quote, StatsBand } from "~/components/blocks";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/giving");
const [intro, ways] = content.sections;
const [taxBefore, taxNote] = intro.paragraphs![0].split(/(?=The Redwood State University Foundation is)/);
const MAIL = "mailto:giving@redwoodstate.edu";

// Title, destination and descriptive link text (once fixed) for each "Ways to give" item, in content order.
const wayLinks: [string, string, string][] = [
  ["Give online", "/giving/donate", "Give online"],
  ["Give monthly", "/giving/donate", "Start a monthly gift"],
  ["Payroll deduction", "/employees/payroll", "Set up payroll deduction"],
  ["Stock and securities", MAIL, "Ask about gifts of stock"],
  ["Planned gifts", MAIL, "Ask about bequests and planned gifts"],
  ["Matching gifts", "/giving/alumni", "Double your gift with an employer match"],
];

const RAISED = 141;
const GOAL = 250;

export default function GivingPage() {
  const meterFixed = useScenario("giving-home-meter-value-001");
  useScenario("giving-home-stats-contrast-001"); // CSS scenarios (foundation.css)
  useScenario("giving-home-tax-small-001");
  const pct = Math.round((RAISED / GOAL) * 100);

  return (
    <>
      <Hero title="Give to Redwood State" kicker="Redwood State Foundation" lede={content.summary} image="giving-hero-scholars">
        <ButtonLink to="/giving/donate">Make a gift</ButtonLink>
        <ButtonLink to="/giving/priorities" variant="secondary">See giving priorities</ButtonLink>
      </Hero>

      <div className="page-content giving-home">
        <section className="stack" aria-labelledby="impact-heading">
          <h2 id="impact-heading">Gifts that go further</h2>
          <p>{taxBefore}</p>
          <p className="giving-tax-note" data-a11y-scenario="giving-home-tax-small-001">{taxNote}</p>
        </section>

        <div className="giving-stats" data-a11y-scenario="giving-home-stats-contrast-001">
          <StatsBand
            label="Giving in 2025–26"
            stats={[
              { value: "9,420", label: "donors in 2025–26" },
              { value: "$21.6M", label: "given in 2025–26" },
              { value: "640", label: "students kept enrolled by emergency grants" },
            ]}
          />
        </div>

        <section className="stack giving-campaign" aria-labelledby="campaign-heading">
          <h2 id="campaign-heading">Wide Branches: The Campaign for Redwood State</h2>
          <p>${RAISED} million committed toward a ${GOAL} million goal by June 2030.</p>
          <div
            className="campaign-meter"
            role="progressbar"
            aria-labelledby="campaign-heading"
            aria-valuemin={0}
            aria-valuemax={meterFixed ? 100 : undefined}
            aria-valuenow={(meterFixed ? pct : `${pct}%`) as number}
            aria-valuetext={meterFixed ? `$${RAISED} million of $${GOAL} million (${pct}%)` : undefined}
            data-a11y-scenario="giving-home-meter-value-001"
          >
            <span className="campaign-meter-fill" style={{ width: `${pct}%` }} />
          </div>
          <p><ButtonLink to="/giving/campaigns" variant="secondary">Campaign progress</ButtonLink></p>
        </section>

        <section className="stack" aria-labelledby="ways-heading">
          <h2 id="ways-heading">{ways.heading}</h2>
          <ul className="ways-grid">
            {ways.list!.map((w, i) => (
              <li key={w} className="way">
                <Heading scenario="giving-home-ways-heading-001" level={3} defect="skipped" defectLevel={4} className="way-title">{wayLinks[i][0]}</Heading>
                <p>{w}</p>
                <SmartLink scenario="giving-home-ways-generic-001" to={wayLinks[i][1]} defect="Learn more">{wayLinks[i][2]}</SmartLink>
              </li>
            ))}
          </ul>
        </section>

        <Quote
          text="I was the first in my family to go to college. A $500 emergency grant my sophomore year is the reason I finished."
          name="First-Generation Scholar, Class of 2025"
        />

        <ContactCard
          title="Office of Advancement"
          lines={[
            { label: "Office", value: "Founders Hall 320" },
            { label: "Phone", value: "(707) 555-0190", href: "tel:7075550190" },
            { label: "Email", value: "giving@redwoodstate.edu", href: MAIL },
          ]}
        />

        <CtaBand title="Every gift counts" text="Choose a fund, give once or monthly, and receive your tax receipt by email." action={{ label: "Make a gift", href: "/giving/donate" }} />
      </div>
    </>
  );
}
