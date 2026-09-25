// Research guide template (/library/guides/:slug), styled like a hosted guide platform: boxes plus a sidebar.
import { useParams } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { AnyLink, RelatedLinks } from "~/components/blocks";
import { Callout } from "~/components/Callout";
import { libraryGuides } from "~/data/catalog";
import databases from "~/data/generated/databases.json";
import type { LibraryDatabase } from "~/data/types";
import NotFoundPage from "~/pages/NotFoundPage";
import { guides } from "../_data";

export { inventoryMeta as meta } from "~/routes/meta";

const dbBySlug = new Map((databases as LibraryDatabase[]).map((d) => [d.slug, d]));

export default function GuidePage() {
  const { slug = "" } = useParams();
  const guide = guides[slug];
  const name = libraryGuides.find((g) => g.slug === slug)?.name;
  const emailFixed = useScenario("library-guide-email-title-001");
  useScenario("library-guide-box-contrast-001"); // CSS scenario (library.css)
  if (!guide || !name) return <NotFoundPage />;
  const { librarian } = guide;

  return (
    <div className="lib-guide page-content">
      <header>
        <h1 id="page-title">{name}</h1>
        <p>{guide.summary}</p>
        <p className="lib-guide-updated">{guide.updated}</p>
      </header>

      <div className="lib-guide-layout">
        <div className="lib-guide-boxes" data-a11y-scenario="library-guide-box-contrast-001">
          {guide.boxes.map((box) => (
            <section key={box.title} className="lib-box">
              <Heading scenario="library-guide-box-heading-001" level={2} defect="fake" className="lib-box-title">{box.title}</Heading>
              <div className="lib-box-body">
                {box.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                {box.list && <ul>{box.list.map((item) => <li key={item}>{item}</li>)}</ul>}
                {box.links?.map((l) => (
                  <p key={l.href}>
                    {l.href.endsWith(".pdf")
                      ? <SmartLink scenario="library-guide-pdf-001" to={l.href} fileInfo="PDF, 2 KB">{l.label}</SmartLink>
                      : <AnyLink href={l.href}>{l.label}</AnyLink>}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="lib-guide-aside">
          <section className="lib-box lib-librarian" aria-labelledby="librarian-heading">
            <h2 id="librarian-heading" className="lib-box-title">Your librarian</h2>
            <div className="lib-box-body">
              <p><strong>{librarian.name}</strong><br />{librarian.title}</p>
              <p data-a11y-scenario="library-guide-email-title-001">
                <a href={`mailto:${librarian.email}`} title={emailFixed ? undefined : librarian.email}>{librarian.email}</a>
                <br />{librarian.phone}<br />Office: {librarian.room}
              </p>
            </div>
          </section>

          <section className="lib-box" aria-labelledby="dbs-heading">
            <h2 id="dbs-heading" className="lib-box-title">Best databases</h2>
            <ul className="lib-box-body lib-guide-dbs">
              {guide.databases.map((s) => dbBySlug.get(s)).filter((d) => d !== undefined).map((d) => (
                <li key={d.slug}>
                  <SmartLink scenario="library-guide-db-newwindow-001" to={`https://proxy.redwoodstate.example.edu/login?url=https://db.example.com/${d.slug}`} newWindow>{d.name}</SmartLink>
                  <span className="lib-small"> {d.description}</span>
                </li>
              ))}
            </ul>
          </section>

          <RelatedLinks title="Related" links={[...guide.related, { label: "All research guides", href: "/library/guides" }]} />
        </aside>
      </div>

      <Callout title="Need more help?">
        <p>Book a 30-minute research consultation with {librarian.name}, or visit the Research Help Desk on the first floor.</p>
      </Callout>
    </div>
  );
}
