// /portal: RedwoodConnect dashboard widgets (static; acknowledging alerts etc. is plan 06).
import { Link, useLoaderData } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import type { PortalStudent } from "~/data/types";
import { PortalPage, erpDate, money, time12 } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

const dayOrder = ["M", "T", "W", "R", "F"];

export async function loader() {
  const p = portal as unknown as PortalStudent;
  return {
    preferredName: p.preferredName,
    holds: p.holds.map((h) => h.name),
    classes: p.schedule
      .map((c) => ({ code: c.code, title: c.title, days: c.section.days, start: c.section.start, room: c.section.room }))
      .sort((a, b) => dayOrder.indexOf(a.days[0]) - dayOrder.indexOf(b.days[0]) || a.start.localeCompare(b.start)),
    account: { balance: p.account.balance, nextDue: p.account.nextDue },
    todos: p.todos.filter((t) => t.status === "open").sort((a, b) => (a.due ?? "9").localeCompare(b.due ?? "9")),
    messages: p.messages.slice(0, 4).map((m) => ({ id: m.id, from: m.from, subject: m.subject, date: m.date, read: m.read })),
    registration: p.registration,
    snapshot: { gpa: p.cumulativeGpa, credits: p.creditsEarned, standing: p.classStanding, major: p.major, advisor: p.advisor, advisorSlug: p.advisorSlug },
  };
}

export default function PortalDashboard() {
  const d = useLoaderData<typeof loader>();
  const unreadFixed = useScenario("portal-dash-unread-color-001");
  useScenario("portal-dash-asof-contrast-001");
  const [ticketDate, ticketTime] = d.registration.timeTicket.split("T");

  return (
    <PortalPage title="Dashboard" subtitle={`Welcome back, ${d.preferredName}.`}>
      <HoldsBanner holds={d.holds} />
      <div className="pt-widgets" data-a11y-scenario="portal-dash-asof-contrast-001">
        <Widget title="My Classes" viewAll={{ to: "/portal/schedule", label: "View full class schedule" }}>
          <ul className="pt-list">
            {d.classes.map((c) => (
              <li key={c.code}><strong>{c.code}</strong> {c.title}<br /><span className="pt-muted">{c.days} {time12(c.start)} · {c.room}</span></li>
            ))}
          </ul>
          <p className="pt-foot">Fall 2026 · 12 credits enrolled</p>
        </Widget>

        <Widget title="Account Summary" viewAll={{ to: "/portal/account", label: "View all account activity" }}>
          <p className="pt-big">{money(d.account.balance)}</p>
          <p>Amount due {erpDate(d.account.nextDue.date)}: <strong>{money(d.account.nextDue.amount)}</strong></p>
          <p className="pt-foot">As of 10/05/2026</p>
        </Widget>

        <Widget title="To-Do List" viewAll={{ to: "/portal/todo", label: "View all to-do items" }}>
          <ul className="pt-list">
            {d.todos.slice(0, 3).map((t) => (
              <li key={t.id}><Link to={t.url}>{t.title}</Link>{t.due && <><br /><span className="pt-foot">Due {erpDate(t.due)}</span></>}</li>
            ))}
          </ul>
          <p className="pt-foot">{d.todos.length} open items</p>
        </Widget>

        <Widget title="Messages" viewAll={{ to: "/portal/messages", label: "View all messages" }}>
          <ul className="pt-list" data-a11y-scenario="portal-dash-unread-color-001">
            {d.messages.map((m) => (
              <li key={m.id} className="pt-msg">
                {!m.read && (unreadFixed ? <span className="pt-badge">New</span> : <span className="pt-dot" />)}
                <Link to={`/portal/messages#${m.id}`}>{m.subject}</Link>
                <br /><span className="pt-foot">{m.from} · {erpDate(m.date)}</span>
              </li>
            ))}
          </ul>
        </Widget>

        <Widget title="Registration">
          <p>Spring 2027 time ticket:</p>
          <p className="pt-big">{erpDate(ticketDate)} {time12(ticketTime)}</p>
          <p>Maximum {d.registration.maxCredits} credits. Resolve holds before your time ticket.</p>
          <p><Link to="/portal/registration">Go to Registration</Link></p>
        </Widget>

        <Widget title="Academic Snapshot">
          <dl className="pt-dl">
            <div><dt>Major</dt><dd>{d.snapshot.major}</dd></div>
            <div><dt>Class standing</dt><dd>{d.snapshot.standing}</dd></div>
            <div><dt>Cumulative GPA</dt><dd>{d.snapshot.gpa.toFixed(2)}</dd></div>
            <div><dt>Credits earned</dt><dd>{d.snapshot.credits}</dd></div>
            <div><dt>Advisor</dt><dd><Link to={`/faculty/${d.snapshot.advisorSlug}`}>{d.snapshot.advisor}</Link></dd></div>
          </dl>
          <p><Link to="/portal/degree-progress">Degree progress report</Link></p>
        </Widget>
      </div>
    </PortalPage>
  );
}

function HoldsBanner({ holds }: { holds: string[] }) {
  const fixed = useScenario("portal-dash-alert-live-001");
  // The vendor widget writes aria-live="yes"; the cast only gets the invalid value past the DOM types.
  const live = fixed ? { role: "status" } : { "aria-live": "yes" as "polite" };
  return (
    <div className="pt-banner" {...live} data-a11y-scenario="portal-dash-alert-live-001">
      <strong>You have {holds.length} holds that block Spring 2027 registration:</strong> {holds.join(", ")}.{" "}
      <Link to="/portal/holds">Review your holds</Link>
    </div>
  );
}

function Widget({ title, viewAll, children }: { title: string; viewAll?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="pt-widget">
      <Heading scenario="portal-dash-widget-heading-001" level={2} defect="fake" className="pt-widget-title">{title}</Heading>
      <div className="pt-widget-body">{children}</div>
      {viewAll && (
        <p className="pt-widget-more">
          <SmartLink scenario="portal-dash-viewall-001" to={viewAll.to} defect="View all">{viewAll.label}</SmartLink>
        </p>
      )}
    </section>
  );
}
