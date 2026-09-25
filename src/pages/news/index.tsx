// /news: the RSU News magazine front (separate CMS from the main site).
import { Link } from "react-router";
import { Heading, SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard, RelatedLinks } from "~/components/blocks";
import { Img } from "~/components/Img";
import sizes from "~/data/image-sizes.json";
import { newsCategories } from "~/data/catalog";
import { newsContent, type NewsArticle } from "~/data/content/news";
import { formatDate } from "~/data/site";
import { categoryName, newsContact, stories } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const MOST_READ = ["madrone-hall-opens", "sleep-study-later-classes", "womens-soccer-conference-title", "redwood-canopy-carbon-study", "first-gen-scholars-expands"];
const manifestAlt = (id: string) => (sizes as Record<string, { alt: string }>)[id]?.alt ?? "";

export default function NewsFront() {
  useScenario("news-front-kicker-contrast-001"); // CSS scenario (magazine.css)
  const [lead, ...rest] = stories;
  const secondary = rest.slice(0, 2);
  const latest = rest.slice(2, 8);

  return (
    <div className="news-front" data-a11y-scenario="news-front-kicker-contrast-001">
      <h1 id="page-title" className="visually-hidden">RSU News</h1>

      <section className="news-lead-story" aria-label="Top story">
        <div className="news-lead-media">
          {/* The CMS pastes the caption and dek into the alt field of the front-page photo. */}
          <Img
            image={lead.image}
            alt={`${manifestAlt(lead.image)}. ${lead.imageCaption} ${lead.dek} Photo by University Communications.`}
            scenario="news-front-lead-alt-long-001"
            sizes="(min-width: 76rem) 50rem, 100vw"
            loading="eager"
          />
        </div>
        <div className="news-lead-text">
          <p className="news-kicker">{categoryName(lead.category)}</p>
          <h2><Link to={`/news/${lead.slug}`}>{lead.title}</Link></h2>
          <p className="news-dek">{lead.dek}</p>
          <p className="news-row-meta">{formatDate(lead.date)} · By {lead.author}</p>
        </div>
      </section>

      <div className="news-front-grid">
        <div className="news-front-main">
          <div className="news-secondary">
            {secondary.map((s) => <FrontCard key={s.slug} story={s} />)}
          </div>

          <section aria-labelledby="latest-heading" className="news-latest">
            <h2 id="latest-heading">Latest stories</h2>
            <div className="news-card-grid">
              {latest.map((s) => <FrontCard key={s.slug} story={s} small />)}
            </div>
            <p><Link to="/news/archive" className="news-archive-link">Browse the full news archive</Link></p>
          </section>
        </div>

        <aside className="news-front-aside">
          <section className="news-most-read" aria-labelledby="most-read-heading">
            <Heading scenario="news-front-mostread-heading-001" level={2} defect="skipped" defectLevel={4}>
              <span id="most-read-heading">Most read</span>
            </Heading>
            <ol>
              {MOST_READ.map((slug) => (
                <li key={slug}><Link to={`/news/${slug}`}>{newsContent[slug].title}</Link></li>
              ))}
            </ol>
          </section>
          <RelatedLinks
            title="Sections"
            links={[...newsCategories.map((c) => ({ label: c.name, href: `/news/category/${c.slug}` })), { label: "Search News", href: "/news/search" }]}
          />
          <ContactCard title="Media inquiries" lines={newsContact} />
        </aside>
      </div>
    </div>
  );
}

function FrontCard({ story, small }: { story: NewsArticle; small?: boolean }) {
  return (
    <article className={`news-card${small ? " news-card--small" : ""}`}>
      <Img image={story.image} scenario="news-front-card-alt-001" fixedAlt="" sizes="(min-width: 60rem) 25vw, 100vw" aspect="3 / 2" />
      <p className="news-kicker">{categoryName(story.category)}</p>
      <h3><Link to={`/news/${story.slug}`}>{story.title}</Link></h3>
      {!small && <p className="news-card-dek">{story.dek}</p>}
      <SmartLink scenario="news-front-readmore-001" to={`/news/${story.slug}`} defect="Read more" className="news-readmore">
        Read more<span className="visually-hidden"> about {story.title}</span>
      </SmartLink>
    </article>
  );
}
