// /library/account: static patron account (sample patron, in-memory renewals). No real sign-in.
import { useState } from "react";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard } from "~/components/blocks";
import { DataTable } from "~/components/DataTable";
import { Tabs } from "~/components/Tabs";
import { addDays, formatDate, SITE_NOW } from "~/data/site";
import { patron, records } from "./_data";

export { inventoryMeta as meta } from "~/routes/meta";

const byId = new Map(records.map((r) => [r.id, r]));
const MAX_RENEWALS = 3;

export default function LibraryAccount() {
  const [loans, setLoans] = useState(patron.checkouts);
  const [picked, setPicked] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const checkFixed = useScenario("library-account-checkbox-label-001");
  const colorFixed = useScenario("library-account-due-color-001");
  const buttonFixed = useScenario("library-account-renew-div-001");
  const statusFixed = useScenario("library-account-renew-status-001");

  const renew = () => {
    if (!picked.length) { setMessage("Select at least one item to renew."); return; }
    const chosen = loans.filter((l) => picked.includes(l.id));
    const limit = chosen.filter((l) => l.renewals >= MAX_RENEWALS).length;
    const ok = chosen.length - limit;
    setLoans(loans.map((l) => (picked.includes(l.id) && l.renewals < MAX_RENEWALS ? { ...l, due: addDays(SITE_NOW, 28), renewals: l.renewals + 1 } : l)));
    setMessage(`${ok} ${ok === 1 ? "item" : "items"} renewed.${limit ? ` ${limit} could not be renewed (renewal limit reached).` : ""}`);
    setPicked([]);
  };

  const dueState = (due: string) => (due < SITE_NOW ? "overdue" : due <= addDays(SITE_NOW, 7) ? "soon" : "ok");

  const checkouts = (
    <div data-a11y-scenario="library-account-checkbox-label-001 library-account-due-color-001">
      <DataTable
        caption="Items checked out"
        rowHeader="title"
        rows={loans}
        columns={[
          {
            key: "pick", header: "Renew",
            render: (l) => (
              <input
                type="checkbox"
                checked={picked.includes(l.id)}
                onChange={() => setPicked((p) => (p.includes(l.id) ? p.filter((x) => x !== l.id) : [...p, l.id]))}
                aria-label={checkFixed ? `Renew ${byId.get(l.id)?.title}` : undefined}
              />
            ),
          },
          { key: "title", header: "Title", render: (l) => byId.get(l.id)?.title },
          { key: "call", header: "Call number", render: (l) => byId.get(l.id)?.callNumber },
          {
            key: "due", header: "Due",
            render: (l) => {
              const s = dueState(l.due);
              return (
                <span className={`lib-due lib-due--${s}`}>
                  {formatDate(l.due)}
                  {colorFixed && s !== "ok" && <strong> ({s === "overdue" ? "Overdue" : "Due soon"})</strong>}
                </span>
              );
            },
          },
          { key: "renewals", header: "Renewals", numeric: true, render: (l) => `${l.renewals} of ${MAX_RENEWALS}` },
        ]}
      />
      <div className="lib-renew-bar" data-a11y-scenario="library-account-renew-div-001 library-account-renew-status-001">
        {buttonFixed
          ? <button type="button" className="btn btn--primary" onClick={renew}>Renew selected</button>
          : <div className="btn btn--primary" onClick={renew}>Renew selected</div>}
        <p className="lib-renew-msg" {...(statusFixed ? { role: "status" } : {})}>{message}</p>
      </div>
    </div>
  );

  return (
    <div className="page-content lib-account">
      <header className="lib-account-header">
        <div>
          <h1 id="page-title">My Library Account</h1>
          <p>Signed in as <strong>{patron.name}</strong> · {patron.type} · Library card {patron.id} · Expires {formatDate(patron.expires)}</p>
        </div>
      </header>

      <ul className="lib-account-summary">
        <li><strong>{loans.length}</strong> checked out</li>
        <li><strong>{patron.holds.length}</strong> hold</li>
        <li><strong>{patron.ill.length}</strong> interlibrary loan requests</li>
        <li><strong>$0.00</strong> owed</li>
      </ul>

      <Tabs
        label="Account"
        tabs={[
          { label: `Checked out (${loans.length})`, content: checkouts },
          {
            label: `Holds (${patron.holds.length})`,
            content: (
              <DataTable
                caption="Holds"
                rowHeader="title"
                rows={patron.holds}
                columns={[
                  { key: "title", header: "Title", render: (h) => byId.get(h.id)?.title },
                  { key: "placed", header: "Placed", render: (h) => formatDate(h.placed) },
                  { key: "position", header: "Queue position", render: (h) => h.position },
                  { key: "pickup", header: "Pickup location", render: (h) => h.pickup },
                ]}
              />
            ),
          },
          {
            label: `Interlibrary loan (${patron.ill.length})`,
            content: (
              <DataTable
                caption="Interlibrary loan requests"
                rowHeader="title"
                rows={patron.ill}
                columns={[
                  { key: "title", header: "Title", render: (r) => r.title },
                  { key: "source", header: "Source", render: (r) => r.source },
                  { key: "requested", header: "Requested", render: (r) => formatDate(r.requested) },
                  { key: "status", header: "Status", render: (r) => r.status },
                ]}
              />
            ),
          },
          { label: "Fines & fees", content: <p>You have no fines or fees. Sequoia Library does not charge overdue fines on regular loans; course reserves accrue $1 per hour.</p> },
        ]}
      />

      <ContactCard title="Account questions" lines={[{ label: "Circulation Desk", value: "(707) 555-0271", href: "tel:+17075550271" }, { label: "Email", value: "askus@redwoodstate.edu", href: "mailto:askus@redwoodstate.edu" }]} />
    </div>
  );
}
