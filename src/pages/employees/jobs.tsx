import { useState } from "react";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { Hero } from "~/components/Hero";
import { AnyLink, ContactCard } from "~/components/blocks";
import jobsData from "~/data/generated/jobs.json";
import { addDays, formatDate, SITE_NOW } from "~/data/site";
import type { JobPosting } from "~/data/types";
import { copyFor } from "../about/_Copy";

export { inventoryMeta as meta } from "~/routes/meta";

const content = copyFor("/employees/jobs");
const [main] = content.sections;
const jobs = jobsData as JobPosting[];
const categories = ["Staff", "Faculty", "Student"] as const;
const closingSoon = (j: JobPosting) => j.closes !== null && j.closes <= addDays(SITE_NOW, 14);

export default function JobsPage() {
  const [category, setCategory] = useState("all");
  const selectFixed = useScenario("employees-jobs-filter-select-001");
  const liveFixed = useScenario("employees-jobs-count-live-001");
  const colorFixed = useScenario("employees-jobs-closing-color-001");
  useScenario("employees-jobs-eeo-small-001"); // CSS scenario (intranet.css)
  const shown = category === "all" ? jobs : jobs.filter((j) => j.category === category);

  return (
    <>
      <Hero title="Employment Opportunities" lede={content.summary} variant="banner" />
      <div className="page-content">
        <p className="jobs-eeo" data-a11y-scenario="employees-jobs-eeo-small-001">{main.paragraphs![0]}</p>
        <p>{main.paragraphs![1]}</p>

        <div className="jobs-toolbar">
          <div className="field" data-a11y-scenario="employees-jobs-filter-select-001">
            {selectFixed ? <label htmlFor="job-category">Position type</label> : <span className="field-label">Position type</span>}
            <select id="job-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All positions</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <p className="jobs-count" data-a11y-scenario="employees-jobs-count-live-001" {...(liveFixed ? { "aria-live": "polite" } : {})}>
            Showing {shown.length} of {jobs.length} positions
          </p>
        </div>

        <p className="table-note" data-a11y-scenario="employees-jobs-closing-color-001">
          {colorFixed ? "Postings closing within two weeks are marked “Closing soon.”" : "Closing dates in red are within two weeks."}
        </p>
        <ul className="job-list">
          {shown.map((j) => (
            <li key={j.id} className="job">
              <h2 className="job-title">{j.title}</h2>
              <p className="job-meta">
                {j.department} · {j.category} · {j.appointment} · {j.salary}
              </p>
              <p className="job-dates">
                Posted {formatDate(j.posted)} ·{" "}
                <span className={closingSoon(j) ? "job-closes job-closes--soon" : "job-closes"}>
                  {j.closes ? `Closes ${formatDate(j.closes)}` : "Open until filled"}
                  {colorFixed && closingSoon(j) && " (Closing soon)"}
                </span>
                {" "}· Job #{j.id}
              </p>
              <details>
                <summary>Summary and qualifications</summary>
                <p>{j.summary}</p>
                <ul>{j.qualifications.map((q) => <li key={q}>{q}</li>)}</ul>
              </details>
              <SmartLink
                scenario="employees-jobs-apply-generic-001"
                to={`mailto:jobs@redwoodstate.example.edu?subject=${encodeURIComponent(`Application: ${j.title} (${j.id})`)}`}
                defect="Apply here"
              >
                Apply for {j.title} (#{j.id})
              </SmartLink>
            </li>
          ))}
        </ul>

        <ContactCard
          title="Questions about a posting?"
          lines={[
            { label: "Talent Acquisition", value: "Founders Hall 210" },
            { label: "Phone", value: "(707) 555-0180", href: "tel:7075550180" },
            { label: "Email", value: "jobs@redwoodstate.example.edu", href: "mailto:jobs@redwoodstate.example.edu" },
          ]}
        />
        <p>{main.links!.map((l) => <AnyLink key={l.href} href={l.href}>{l.label}</AnyLink>)} for eligible positions.</p>
      </div>
    </>
  );
}
