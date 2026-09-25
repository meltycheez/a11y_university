// /portal/holds: active holds grid (hold detail modals are plan 06; details are shown inline).
import { useLoaderData } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import type { PortalStudent } from "~/data/types";
import { PortalPage, erpDate } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

export async function loader() {
  return { holds: (portal as unknown as PortalStudent).holds };
}

const stop = (
  <svg viewBox="0 0 24 24" width="20" height="20" className="pt-stop" focusable="false" aria-hidden="true">
    <path d="M8 2h8l6 6v8l-6 6H8l-6-6V8Z" fill="#c62828" /><path d="M7 11h10v2H7z" fill="#fff" />
  </svg>
);

export default function HoldsPage() {
  const { holds } = useLoaderData<typeof loader>();
  const emptyFixed = useScenario("portal-holds-heading-empty-001");
  const blocksFixed = useScenario("portal-holds-blocks-color-001");

  return (
    <PortalPage title="Holds" subtitle="Holds that may prevent registration or transcripts">
      <section className="pt-card">
        <div data-a11y-scenario="portal-holds-heading-empty-001">{!emptyFixed && <h2 className="pt-notice" />}</div>
        <h2>Active Holds ({holds.length})</h2>
        <p>Resolve holds by contacting the office listed for each hold. Most holds are released within two business days after the office receives what it needs.</p>
        <div className="table-wrap">
          <table className="pt-grid pt-holds" data-a11y-scenario="portal-holds-blocks-color-001">
            <caption className="visually-hidden">Active holds</caption>
            <thead>
              <tr><th scope="col">Hold</th><th scope="col">Office</th><th scope="col">Reason</th><th scope="col">Added</th><th scope="col">Blocks</th><th scope="col">Action</th></tr>
            </thead>
            <tbody>
              {holds.map((h) => (
                <tr key={h.code}>
                  <th scope="row">{h.name} <span className="pt-muted">({h.code})</span></th>
                  <td>{h.office}</td>
                  <td>{h.reason}</td>
                  <td>{erpDate(h.added)}</td>
                  <td>{stop}{blocksFixed && <span className="pt-blocks-text">{h.blocks.join(", ")}</span>}</td>
                  <td>
                    <SmartLink scenario="portal-holds-resolve-generic-001" to={h.url} defect="More info">How to resolve: {h.name}</SmartLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PortalPage>
  );
}
