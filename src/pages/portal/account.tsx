// /portal/account: balance summary and account activity ledger.
import { Link, useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import type { PortalStudent } from "~/data/types";
import { PortalPage, erpDate, money } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

export async function loader() {
  const p = portal as unknown as PortalStudent;
  return { account: p.account, id: p.id, term: p.currentTerm };
}

export default function AccountPage() {
  const { account, id, term } = useLoaderData<typeof loader>();
  const creditFixed = useScenario("portal-acct-credit-color-001");
  const captionFixed = useScenario("portal-acct-caption-001");
  useScenario("portal-acct-ledger-width-001");
  const ledger = [...account.ledger].reverse();
  const termCharges = account.ledger.filter((e) => e.term === term && e.amount > 0).reduce((n, e) => n + e.amount, 0);
  const termCredits = account.ledger.filter((e) => e.term === term && e.amount < 0).reduce((n, e) => n - e.amount, 0);

  return (
    <PortalPage title="Student Account" subtitle={`Account ${id} · Student Financial Services`}>
      <div className="pt-widgets pt-widgets--2">
        <section className="pt-card" aria-labelledby="acct-balance">
          <h2 id="acct-balance">Account Balance</h2>
          <p className="pt-big">{money(account.balance)}</p>
          <p>Next installment: <strong>{money(account.nextDue.amount)}</strong> due {erpDate(account.nextDue.date)}. Payments after the due date are subject to a $25 late fee.</p>
          <p className="pt-actions">
            <SmartLink scenario="portal-acct-epay-window-001" to="https://epay.redwoodstate.edu/" newWindow className="btn btn--primary pt-btn">Make a payment</SmartLink>
          </p>
        </section>
        <section className="pt-card" aria-labelledby="acct-term">
          <h2 id="acct-term">{term} Summary</h2>
          <dl className="pt-dl">
            <div><dt>Charges</dt><dd>{money(termCharges)}</dd></div>
            <div><dt>Payments and aid</dt><dd>{money(termCredits)}</dd></div>
            <div><dt>Spring 2027 fees due</dt><dd>January 8, 2027</dd></div>
          </dl>
          <p>
            <SmartLink scenario="portal-acct-tuition-pdf-001" to="/documents/tuition-schedule-2025-26.pdf" fileInfo="PDF, 2 KB">Tuition and fee schedule</SmartLink>
            {" · "}<Link to="/admissions/tuition">Tuition &amp; Fees</Link>
            {" · "}<Link to="/financial-aid">Financial Aid</Link>
          </p>
        </section>
      </div>

      <section className="pt-card pt-ledger" aria-labelledby="acct-activity" data-a11y-scenario="portal-acct-ledger-width-001">
        <h2 id="acct-activity">Account Activity</h2>
        <div className="table-wrap">
          <table className="pt-grid" data-a11y-scenario="portal-acct-credit-color-001 portal-acct-caption-001">
            {captionFixed && <caption>Account activity, newest first</caption>}
            <thead>
              <tr><th scope="col">Date</th><th scope="col">Term</th><th scope="col">Description</th><th scope="col" className="num">Amount</th><th scope="col" className="num">Balance</th></tr>
            </thead>
            <tbody>
              {ledger.map((e, i) => (
                <tr key={i}>
                  <td>{erpDate(e.date)}</td>
                  <td>{e.term}</td>
                  <td>{e.description}</td>
                  <td className={e.amount < 0 ? "num pt-credit" : "num"}>
                    {e.amount < 0 && !creditFixed ? money(-e.amount) : money(e.amount).replace("-", "−")}
                    {e.amount < 0 && creditFixed && <span className="pt-credit-tag"> Credit</span>}
                  </td>
                  <td className="num">{money(e.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PortalPage>
  );
}
