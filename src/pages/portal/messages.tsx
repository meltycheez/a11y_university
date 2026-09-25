// /portal/messages: inbox list plus a reading pane. Opening a message marks it read (state in ./_store).
import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import type { PortalStudent } from "~/data/types";
import { PortalPage, erpDate } from "./_PortalPage";
import { isRead, portalStore, updatePortal } from "./_store";

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
  const { read } = portalStore.use();
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(messages[0].id);
  const paneHeading = useRef<HTMLHeadingElement>(null);
  const searchFixed = useScenario("portal-msg-search-placeholder-001");
  const rowFixed = useScenario("portal-msg-row-click-001");
  const unreadFixed = useScenario("portal-msg-unread-bold-001");
  const boxFixed = useScenario("portal-msg-checkbox-label-001");
  const headingFixed = useScenario("portal-msg-subject-heading-001");
  const ariaFixed = useScenario("portal-msg-labeledby-001");
  useScenario("portal-msg-date-contrast-001");

  const open = (id: string, focus = false) => {
    setOpenId(id);
    updatePortal({ read: { ...portalStore.get().read, [id]: true } });
    if (focus && rowFixed) paneHeading.current?.focus();
  };
  // Dashboard links arrive as /portal/messages#msg-3 (read in an effect so the first render matches the prerender).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (messages.some((m) => m.id === id)) open(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needle = q.trim().toLowerCase();
  const rows = needle ? messages.filter((m) => `${m.subject} ${m.from} ${m.office}`.toLowerCase().includes(needle)) : messages;
  const unread = messages.filter((m) => !isRead(m, read)).length;
  const msg = messages.find((m) => m.id === openId)!;
  const H = headingFixed ? "h3" : "h4";
  const paneLabel = ariaFixed ? { "aria-labelledby": "msg-pane-heading" } : { "aria-labeledby": "msg-pane-heading" };
  const List = rowFixed ? "ul" : "div";
  const Item = rowFixed ? "li" : "div";

  return (
    <PortalPage title="Messages" subtitle={`${messages.length} messages · ${unread} unread`}>
      <div className="pt-mail">
        <section className="pt-card" aria-labelledby="inbox-heading">
          <h2 id="inbox-heading">Inbox</h2>
          <div className="pt-search" data-a11y-scenario="portal-msg-search-placeholder-001">
            {searchFixed && <label htmlFor="msg-q">Search messages</label>}
            <input id="msg-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchFixed ? undefined : "Search messages"} autoComplete="off" />
          </div>
          <List className="pt-inbox" data-a11y-scenario="portal-msg-row-click-001 portal-msg-unread-bold-001 portal-msg-checkbox-label-001 portal-msg-date-contrast-001">
            {rows.map((m) => {
              const unreadNow = !isRead(m, read);
              const summary = (
                <>
                  <span className="pt-inbox-from">{unreadFixed && unreadNow && <span className="pt-badge">Unread</span>}{m.from}</span>
                  <span className="pt-inbox-subject">{m.subject}</span>
                  <span className="pt-date">{erpDate(m.date)}</span>
                </>
              );
              return (
                <Item key={m.id} className={`pt-inbox-row${unreadNow ? " pt-unread" : ""}${m.id === openId ? " is-open" : ""}`}>
                  <span className="pt-inbox-check">
                    <input type="checkbox" id={`sel-${m.id}`} />
                    {boxFixed && <label htmlFor={`sel-${m.id}`} className="visually-hidden">Select message: {m.subject}</label>}
                  </span>
                  {rowFixed ? (
                    <button type="button" className="pt-inbox-open" aria-current={m.id === openId ? "true" : undefined} onClick={() => open(m.id, true)}>{summary}</button>
                  ) : (
                    // Vendor inbox: the whole row is a clickable <div> with no role, name or keyboard access.
                    <div className="pt-inbox-open" onClick={() => open(m.id)}>{summary}</div>
                  )}
                </Item>
              );
            })}
            {rows.length === 0 && <Item className="pt-inbox-row">No messages match “{q}”.</Item>}
          </List>
        </section>

        <section className="pt-card pt-pane" {...paneLabel} data-a11y-scenario="portal-msg-labeledby-001 portal-msg-subject-heading-001 portal-msg-click-here-001">
          <h2 id="msg-pane-heading">Message</h2>
          <article className="pt-message">
            <H ref={paneHeading} tabIndex={-1}>{msg.subject}</H>
            <p className="pt-muted">From {msg.from}, {msg.office} · {erpDate(msg.date)}</p>
            {msg.body.map((para, i) => <p key={i} className="pt-message-body">{para}</p>)}
            {actions[msg.id] && (
              <p><SmartLink scenario="portal-msg-click-here-001" to={actions[msg.id].to} defect="Click here">{actions[msg.id].label}</SmartLink></p>
            )}
            <p>
              <button type="button" className="btn pt-btn" onClick={() => updatePortal({ read: { ...read, [msg.id]: !isRead(msg, read) } })}>
                {isRead(msg, read) ? "Mark as unread" : "Mark as read"}
              </button>
            </p>
          </article>
          <p className="pt-muted">Official university messages are also sent to your RSU email address. <Link to="/portal/profile">Update your contact preferences</Link>.</p>
        </section>
      </div>
    </PortalPage>
  );
}
