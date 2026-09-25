// /library: Sequoia Library home, a dense vendor-hosted library site with a tabbed search box.
import { Form, Link } from "react-router";
import { Field, IconButton, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { AnyLink, ContactCard, VideoEmbed } from "~/components/blocks";
import { Hero } from "~/components/Hero";
import { Img } from "~/components/Img";
import { Tabs } from "~/components/Tabs";
import { libraryGuides } from "~/data/catalog";
import { pageContent } from "~/data/content/pages";

export { inventoryMeta as meta } from "~/routes/meta";

const QUICK_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "Find", links: [{ label: "OneSearch", href: "/library/search" }, { label: "Databases A–Z", href: "/library/databases" }, { label: "Research Guides", href: "/library/guides" }, { label: "Course reserves", href: "/library/search?q=reserves" }, { label: "Local History Archives", href: "/library/guides/local-history-archives" }] },
  { title: "Borrow", links: [{ label: "My Library Account", href: "/library/account" }, { label: "Renew items", href: "/library/account" }, { label: "Loan periods", href: "/library/policies" }, { label: "Fines and fees", href: "/library/policies" }] },
  { title: "Spaces", links: [{ label: "Study Room Reservations", href: "/library/study-rooms" }, { label: "Library Hours", href: "/library/hours" }, { label: "Quiet floors", href: "/library/policies" }, { label: "Stacks Café", href: "/library/hours" }] },
  { title: "Help", links: [{ label: "Citing sources", href: "/library/guides/citation-guide" }, { label: "Nursing research", href: "/library/guides/nursing-evidence-based-practice" }, { label: "Academic advising", href: "/students/advising" }, { label: "Library policies", href: "/library/policies" }] },
];

export default function LibraryHome() {
  const listFixed = useScenario("library-home-quicklinks-list-001");
  const titleFixed = useScenario("library-home-space-img-title-001");
  useScenario("library-home-quicklinks-small-001"); // CSS scenarios (library.css)
  useScenario("library-home-quicklinks-focus-001");
  useScenario("library-home-hours-contrast-001");
  const intro = pageContent["/library"]?.sections[0].paragraphs?.[0];
  const hours = pageContent["/library/hours"]?.sections[0].table?.rows ?? [];

  return (
    <>
      <Hero title="Sequoia Library" kicker="Redwood State University" lede={intro} image="library-hero-exterior" />

      <div className="page-content lib-home">
        <section className="lib-searchbox" aria-labelledby="lib-search-heading">
          <h2 id="lib-search-heading">Search the library</h2>
          <Tabs
            label="Search type"
            tabs={[
              { label: "Everything", content: <EverythingSearch /> },
              { label: "Books & Media", content: <BooksSearch /> },
              { label: "Articles", content: <ArticlesSearch /> },
              {
                label: "Databases",
                content: (
                  <div className="lib-db-tab">
                    <p>Go straight to one of 41 research databases, or browse by subject.</p>
                    <ul className="lib-inline-links">
                      <li><Link to="/library/databases">Databases A–Z</Link></li>
                      <li><Link to="/library/databases#letter-o">Omnibus Article Search</Link></li>
                      <li><Link to="/library/databases#letter-c">Clinical Nursing Collection</Link></li>
                      <li>
                        <SmartLink scenario="library-home-oa-newwindow-001" to="https://oajournals.example.org" newWindow>Open Access Journals Directory</SmartLink>
                      </li>
                    </ul>
                  </div>
                ),
              },
            ]}
          />
        </section>

        <div className="lib-home-grid">
          <nav className="lib-quicklinks" aria-label="Library quick links" data-a11y-scenario="library-home-quicklinks-list-001 library-home-quicklinks-small-001 library-home-quicklinks-focus-001">
            {QUICK_LINKS.map((col) => (
              <div key={col.title} className="lib-quicklinks-col">
                <p className="lib-quicklinks-title">{col.title}</p>
                {listFixed
                  ? <ul>{col.links.map((l) => <li key={l.label}><Link to={l.href}>{l.label}</Link></li>)}</ul>
                  : <div className="lib-quicklinks-items">{col.links.map((l) => <li key={l.label}><Link to={l.href}>{l.label}</Link></li>)}</div>}
              </div>
            ))}
          </nav>

          <aside className="lib-hours-widget" aria-labelledby="hours-today-heading" data-a11y-scenario="library-home-hours-contrast-001">
            <h2 id="hours-today-heading">Hours today</h2>
            <p className="lib-hours-date">Monday, October 5</p>
            <dl>
              {hours.map((row) => <div key={row[0]}><dt>{row[0]}</dt><dd>{row[1]}</dd></div>)}
            </dl>
            <Link to="/library/hours">All hours</Link>
          </aside>
        </div>

        <section className="lib-home-row" aria-labelledby="spaces-heading">
          <div>
            <h2 id="spaces-heading">Study spaces</h2>
            <Img
              image="campus-library-interior"
              alt="Reading room"
              title={titleFixed ? undefined : "Reading room"}
              scenario="library-home-space-img-title-001"
              sizes="(min-width: 60rem) 30rem, 100vw"
            />
            <p>38 bookable group study rooms, silent study on floors 3 and 4, and the timber-beamed reading room on the second floor. Open 24 hours during finals.</p>
            <p><Link to="/library/study-rooms">Reserve a study room</Link></p>
          </div>
          <div>
            <h2 id="tour-heading">Take a tour</h2>
            <VideoEmbed title="Sequoia Library in 90 seconds" caption="A quick walk through the library's four floors." titleScenario="library-home-tour-iframe-001" />
          </div>
        </section>

        <section className="lib-home-row" aria-labelledby="guides-heading">
          <div>
            <h2 id="guides-heading">Research guides</h2>
            <ul>{libraryGuides.map((g) => <li key={g.slug}><Link to={`/library/guides/${g.slug}`}>{g.name}</Link></li>)}</ul>
            <SmartLink scenario="library-home-learnmore-001" to="/library/guides" defect="Learn more">See all research guides</SmartLink>
          </div>
          <div>
            <h2 id="library-news-heading">News from the library</h2>
            <p>
              <AnyLink href="/news/library-digitizes-logging-archives">Sequoia Library digitizes a century of Arcadia Falls logging records</AnyLink>
            </p>
            <p className="lib-small">Payroll ledgers, camp photographs and oral histories from 1885 to 1985 are now free to search online.</p>
          </div>
          <ContactCard
            title="Ask a librarian"
            lines={[
              { label: "Research Help Desk", value: "1st floor, Sequoia Library" },
              { label: "Phone", value: "(707) 555-0170", href: "tel:+17075550170" },
              { label: "Email", value: "askus@redwoodstate.example.edu", href: "mailto:askus@redwoodstate.example.edu" },
            ]}
          />
        </section>

        <ChatLauncher />
      </div>
    </>
  );
}

/** Floating "chat with a librarian" launcher from the vendor chat widget: an icon-only link. */
function ChatLauncher() {
  const fixed = useScenario("library-home-chat-empty-001");
  return (
    <a className="lib-chat" href="mailto:askus@redwoodstate.example.edu?subject=Library%20chat" data-a11y-scenario="library-home-chat-empty-001">
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
        <path d="M4 4h16v11H9l-5 4z" fill="currentColor" />
      </svg>
      {fixed && <span className="visually-hidden">Ask a librarian by email</span>}
    </a>
  );
}

function EverythingSearch() {
  return (
    <Form action="/library/search" method="get" className="lib-search-row">
      <Field scenario="library-home-onesearch-label-001" id="lib-q-all" name="q" label="Search books, articles and more" defect="missing" type="search" />
      <IconButton scenario="library-home-search-submit-001" label="Search" type="submit" icon="⌕" className="lib-search-go" />
    </Form>
  );
}

function BooksSearch() {
  const fixed = useScenario("library-home-books-select-001");
  return (
    <Form action="/library/search" method="get" className="lib-search-row" data-a11y-scenario="library-home-books-select-001">
      {fixed && <label htmlFor="lib-books-field" className="visually-hidden">Search in</label>}
      <select id="lib-books-field" name="field" defaultValue="keyword">
        <option value="keyword">Keyword</option>
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="isbn">ISBN</option>
      </select>
      <Field scenario="library-home-articles-placeholder-001" id="lib-q-books" name="q" label="Search books and media" defect="placeholder" type="search" />
      <input type="hidden" name="format" value="Book" />
      <IconButton scenario="library-home-search-submit-001" label="Search" type="submit" icon="⌕" className="lib-search-go" />
    </Form>
  );
}

function ArticlesSearch() {
  return (
    <Form action="/library/search" method="get" className="lib-search-row">
      <Field scenario="library-home-articles-placeholder-001" id="lib-q-articles" name="q" label="Search articles" defect="placeholder" type="search" />
      <input type="hidden" name="format" value="Article" />
      <IconButton scenario="library-home-search-submit-001" label="Search" type="submit" icon="⌕" className="lib-search-go" />
    </Form>
  );
}
