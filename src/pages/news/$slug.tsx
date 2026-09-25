// ArticlePage (/news/:slug): the RSU News magazine CMS article template.
import { Link, useParams } from "react-router";
import { Heading } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { ContactCard } from "~/components/blocks";
import { Img } from "~/components/Img";
import { newsContent } from "~/data/content/news";
import { formatDate } from "~/data/site";
import NotFoundPage from "~/pages/NotFoundPage";
import { ArticleLink, categoryName, newsContact, readMinutes } from "./_shared";

export { inventoryMeta as meta } from "~/routes/meta";

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const article = newsContent[slug];
  useScenario("news-article-byline-contrast-001"); // CSS scenario (magazine.css)
  if (!article) return <NotFoundPage />;

  const related = article.related.map((s) => newsContent[s]).filter(Boolean);

  return (
    <article className="news-article">
      <header className="news-article-header">
        <p className="news-kicker"><Link to={`/news/category/${article.category}`}>{categoryName(article.category)}</Link></p>
        <h1 id="page-title">{article.title}</h1>
        <p className="news-dek">{article.dek}</p>
        <p className="news-byline" data-a11y-scenario="news-article-byline-contrast-001">
          By <strong>{article.author}</strong>, {article.authorTitle}
          <span className="news-byline-sep" aria-hidden="true"> | </span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span className="news-byline-sep" aria-hidden="true"> | </span>
          {readMinutes(article)} min read
        </p>
        <ShareBar title={article.title} slug={article.slug} />
      </header>

      <figure className="news-lead">
        <Img
          image={article.image}
          alt={article.imageCaption}
          scenario="news-article-lead-alt-001"
          sizes="(min-width: 76rem) 76rem, 100vw"
          loading="eager"
        />
        <figcaption>{article.imageCaption}</figcaption>
      </figure>

      <div className="news-article-layout">
        <div className="news-body">
          {article.body.map((block, i) =>
            typeof block === "string"
              ? <p key={i}>{block}</p>
              : <Heading key={i} scenario="news-article-subhead-001" level={2} defect="fake" className="news-subhead">{block.h2}</Heading>,
          )}
        </div>

        <aside className="news-article-aside">
          {article.links && (
            <section className="news-more-info" aria-labelledby="more-info-heading">
              <h2 id="more-info-heading">More information</h2>
              <ul>{article.links.map((l) => <li key={l.href + l.label}><ArticleLink link={l} /></li>)}</ul>
            </section>
          )}
          <ContactCard title="Media contact" lines={newsContact} />
        </aside>
      </div>

      {related.length > 0 && <RelatedStories stories={related} />}
    </article>
  );
}

const networks = [
  { name: "PhotoPine", glyph: "M4 4h16v16H4z M9 9h6v6H9z", url: "https://photopine.example/share?u=" },
  { name: "ReelWave", glyph: "M3 12c3-6 6 6 9 0s6 6 9 0", url: "https://reelwave.example/post?link=" },
  { name: "WorkCircle", glyph: "M12 3a9 9 0 1 0 0.01 0z M8 12h8", url: "https://workcircle.example/share?url=" },
];

/** Share links render icon glyphs only while defective (news-article-share-empty-001). */
function ShareBar({ title, slug }: { title: string; slug: string }) {
  const fixed = useScenario("news-article-share-empty-001");
  const page = encodeURIComponent(`https://www.redwoodstate.example.edu/news/${slug}`);
  const links = [
    ...networks.map((n) => ({ label: `Share on ${n.name}`, href: n.url + page, glyph: n.glyph })),
    { label: "Share by email", href: `mailto:?subject=${encodeURIComponent(title)}&body=${page}`, glyph: "M3 6h18v12H3z M3 6l9 7 9-7" },
  ];
  return (
    <ul className="news-share" data-a11y-scenario="news-article-share-empty-001">
      {links.map((l) => (
        <li key={l.label}>
          <a href={l.href}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path d={l.glyph} fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            {fixed && <span className="visually-hidden">{l.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Related stories: the CMS links the photo and the headline separately (news-article-related-redundant-001). */
function RelatedStories({ stories }: { stories: typeof newsContent[string][] }) {
  const fixed = useScenario("news-article-related-redundant-001");
  return (
    <section className="news-related" aria-labelledby="related-heading" data-a11y-scenario="news-article-related-redundant-001">
      <h2 id="related-heading">Related stories</h2>
      <div className="news-related-grid">
        {stories.map((s) => {
          const img = <Img image={s.image} alt={fixed ? "" : s.title} sizes="(min-width: 60rem) 25vw, 100vw" aspect="4 / 3" />;
          return (
            <article key={s.slug} className="news-related-card">
              {fixed ? img : <Link to={`/news/${s.slug}`} className="news-related-image">{img}</Link>}
              <p className="news-kicker">{categoryName(s.category)}</p>
              <h3><Link to={`/news/${s.slug}`}>{s.title}</Link></h3>
            </article>
          );
        })}
      </div>
    </section>
  );
}
