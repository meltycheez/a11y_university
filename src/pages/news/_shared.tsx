// RSU News helpers shared by the magazine pages (front, archive, search, category, article).
import { Link } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { AnyLink } from "~/components/blocks";
import { Img } from "~/components/Img";
import { newsCategories } from "~/data/catalog";
import { newsContent, type NewsArticle, type NewsLink } from "~/data/content/news";
import { formatDate } from "~/data/site";
import { getEntry } from "~/routes/inventory";

/** Every story, newest first. */
export const stories: NewsArticle[] = Object.values(newsContent).sort((a, b) => b.date.localeCompare(a.date));

export const categoryName = (slug: string) => newsCategories.find((c) => c.slug === slug)?.name ?? slug;

export const newsContact = [
  { label: "Office", value: "University Communications, Founders Hall" },
  { label: "Phone", value: "(707) 555-0105", href: "tel:+17075550105" },
  { label: "Email", value: "news@redwoodstate.edu", href: "mailto:news@redwoodstate.edu" },
];

const GENERIC = /^(read more|learn more|click here)\b/i;
export const linkKind = (l: NewsLink) =>
  l.href.endsWith(".pdf") && !/\d\s*[KM]B/i.test(l.label) ? "document" : GENERIC.test(l.label) ? "generic" : "plain";

/** Descriptive text for a generic label, taken from the target page's title. */
export function descriptiveLabel(l: NewsLink): string {
  const title = getEntry(l.href)?.title ?? l.href;
  return /tickets/i.test(l.label) ? `Tickets: ${title}` : title;
}

/**
 * An article's "More information" link. Generic labels ("Read more", "Click here") and PDF links without a
 * size come straight from the CMS; the scenarios swap in descriptive text and file details.
 */
export function ArticleLink({ link }: { link: NewsLink }) {
  const kind = linkKind(link);
  if (kind === "generic") {
    return <SmartLink scenario="news-article-link-generic-001" to={link.href} defect={link.label}>{descriptiveLabel(link)}</SmartLink>;
  }
  if (kind === "document") {
    // All campus PDFs are about 2 KB; the fixed label drops the bare "(PDF)" in favor of type and size.
    return (
      <SmartLink scenario="news-article-link-pdf-001" to={link.href} defect={link.label} fileInfo="PDF, 2 KB">
        {link.label.replace(/\s*\(PDF\)\s*$/, "")}
      </SmartLink>
    );
  }
  return <AnyLink href={link.href}>{link.label}</AnyLink>;
}

export const readMinutes = (a: NewsArticle) =>
  Math.max(2, Math.round(a.body.filter((b) => typeof b === "string").join(" ").split(/\s+/).length / 230));

/** Compact story row used by the archive, search and category pages. */
export function StoryRow({ story, imageScenario, imageAlt, headingLevel = 3 }: {
  story: NewsArticle; imageScenario?: string; imageAlt?: string; headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as const;
  return (
    <article className="news-row">
      <Img image={story.image} alt={imageAlt ?? (imageScenario ? undefined : "")} scenario={imageScenario} fixedAlt="" className="news-row-image" sizes="12rem" aspect="4 / 3" />
      <div>
        <p className="news-kicker"><Link to={`/news/category/${story.category}`}>{categoryName(story.category)}</Link></p>
        <H className="news-row-title"><Link to={`/news/${story.slug}`}>{story.title}</Link></H>
        <p className="news-row-dek">{story.dek}</p>
        <p className="news-row-meta">{formatDate(story.date)} · {story.author}</p>
      </div>
    </article>
  );
}
