// /portal/messages: inbox grid plus every message shown in the reading pane (opening/marking read is plan 06).
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import type { PortalStudent } from "~/data/types";
import { PortalPage, erpDate } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

// Follow-up link per message (the vendor template appends "Click here").
const actions: Record<string, { to: string; label: string }> = {
  "msg-1": { to: "/students/advising", label: "Book an advising appointment" },
  "msg-2": { to: "/portal/holds", label: "Review your holds" },
  "msg-3": { to: "/library/account", label: "View your library account" },
  "msg-4": { to: "/portal/account", label: "View your student account" },
  "msg-5": { to: "/portal/registration", label: "Go to Registration" },
  "msg-6": { to: "/events/career-fair-fall-2026", label: "Fall Career & Internship Fair details" },
  "msg-8": { to: "/portal/account", label: "View your student account" },
};

export async function loader() {
  return { messages: (portal as unknown as PortalStudent).messages };
}

export default function MessagesPage() {
  const { messages } = useLoaderData<typeof loader>();
  const [q, setQ] = useState("");
  const searchFixed = useScenario("portal-msg-search-placeholder-001");
  const rowFixed = useScenario("portal-msg-row-click-001");
  const unreadFixed = useScenario("portal-msg-unread-bold-001");
  const boxFixed = useScenario("portal-msg-checkbox-label-001");
  const headingFixed = useScenario("portal-msg-subject-heading-001");
  const ariaFixed = useScenario("portal-msg-labeledby-001");
  useScenario("portal-msg-date-contrast-001");
  const needle = q.trim().toLowerCase();
  const rows = needle ? messages.filter((m) => `${m.subject} ${m.from} ${m.office}`.toLowerCase().includes(needle)) : messages;
  const unread = messages.filter((m) => !m.read).length;
  const H = headingFixed ? "h3" : "h4";
  const paneLabel = ariaFixed ? { "aria-labelledby": "msg-pane-heading" } : { "aria-labeledby": "msg-pane-heading" };

  return (
    <PortalPage title="Messages" subtitle={`${messages.length} messages · ${unread} unread`}>
      <section className="pt-card" aria-labelledby="inbox-heading">
        <h2 id="inbox-heading">Inbox</h2>
        <div className="pt-search" data-a11y-scenario="portal-msg-search-placeholder-001">
          {searchFixed && <label htmlFor="msg-q">Search messages</label>}
          <input id="msg-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchFixed ? undefined : "Search messages"} autoComplete="off" />
        </div>
        <div className="table-wrap">
          <table className="pt-grid pt-inbox" data-a11y-scenario="portal-msg-row-click-001 portal-msg-unread-bold-001 portal-msg-checkbox-label-001 portal-msg-date-contrast-001">
            <caption className="visually-hidden">Inbox</caption>
            <thead>
              <tr><th scope="col"><span className="visually-hidden">Select</span></th><th scope="col">From</th><th scope="col">Subject</th><th scope="col">Date</th></tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className={m.read ? "pt-row-click" : "pt-row-click pt-unread"} onClick={() => document.getElementById(m.id)?.scrollIntoView()}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" id={`sel-${m.id}`} />
                    {boxFixed && <label htmlFor={`sel-${m.id}`} className="visually-hidden">Select message: {m.subject}</label>}
                  </td>
                  <td>{m.from}</td>
                  <td>
                    {unreadFixed && !m.read && <span className="pt-badge">Unread</span>}
                    {rowFixed ? <a href={`#${m.id}`}>{m.subject}</a> : m.subject}
                  </td>
                  <td className="pt-date">{erpDate(m.date)}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4}>No messages match “{q}”.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pt-card pt-pane" {...paneLabel} data-a11y-scenario="portal-msg-labeledby-001 portal-msg-subject-heading-001 portal-msg-click-here-001">
        <h2 id="msg-pane-heading">Messages</h2>
        {messages.map((m) => (
          <article key={m.id} id={m.id} className="pt-message">
            <H>{m.subject}</H>
            <p className="pt-muted">From {m.from}, {m.office} · {erpDate(m.date)}</p>
            {m.body.map((para, i) => <p key={i} className="pt-message-body">{para}</p>)}
            {actions[m.id] && (
              <p><SmartLink scenario="portal-msg-click-here-001" to={actions[m.id].to} defect="Click here">{actions[m.id].label}</SmartLink></p>
            )}
          </article>
        ))}
        <p className="pt-muted">Official university messages are also sent to your RSU email address. <Link to="/portal/profile">Update your contact preferences</Link>.</p>
      </section>
    </PortalPage>
  );
}
