import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Card } from "~/components/Card";
import { LinkList, content } from "~/pages/admissions/_content";
import { ServicePage, contactLines } from "./_ServicePage";

export { inventoryMeta as meta } from "~/routes/meta";

const ICONS = ["💬", "💼", "🎤", "👔", "🤝"];

export default function Careers() {
  const [main, contact] = content("/students/careers")!.sections;
  const iconFixed = useScenario("stu-careers-icons-announced-001");
  const [fair, news] = main.links!;

  return (
    <ServicePage path="/students/careers" image="campus-career-center" contact={contactLines(contact.list!)} related={[{ label: "Types of Aid: Work-Study", href: "/financial-aid/types" }, { label: "Alumni", href: "/alumni" }]}>
      <p>{main.paragraphs![0]}</p>
      <section className="stack" aria-labelledby="services-heading">
        <h2 id="services-heading">What we offer</h2>
        <ul className="svc-icon-list" data-a11y-scenario="stu-careers-icons-announced-001">
          {main.list!.map((item, i) => (
            <li key={item}><span className="svc-icon" aria-hidden={iconFixed || undefined}>{ICONS[i]}</span> {item}</li>
          ))}
        </ul>
        <p>
          Find jobs, internships and Work-Study positions on{" "}
          <SmartLink scenario="stu-careers-owllink-new-window-001" to="https://owllink.redwoodstate.example.edu" newWindow>OwlLink Careers</SmartLink>.
        </p>
      </section>

      <section className="stack" aria-labelledby="events-heading">
        <h2 id="events-heading">Upcoming</h2>
        <div className="svc-feature">
          <Card title={fair.label} href={fair.href} text="Meet employers and graduate programs in Owl Arena." image="event-career-fair-fall-2026" imageScenario="stu-careers-fair-img-alt-001" meta="Event" />
        </div>
        <LinkList links={[news]} fixes={{ "Read more": { scenario: "stu-careers-generic-link-001", defect: "Read more", text: "Student career stories in RSU News" } }} />
      </section>
    </ServicePage>
  );
}
