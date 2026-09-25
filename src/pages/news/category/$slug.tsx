// /news/category/:slug: a section front in the RSU News magazine.
import { Link, useParams } from "react-router";
import { SmartLink } from "~/a11y/helpers";
import { useScenario } from "~/a11y/useScenario";
import { CtaBand, RelatedLinks } from "~/components/blocks";
import { Img } from "~/components/Img";
import { newsCategories } from "~/data/catalog";
import { formatDate } from "~/data/site";
import NotFoundPage from "~/pages/NotFoundPage";
import { stories } from "../_shared";

export { inventoryMeta as meta } from "~/routes/meta";

const intros: Record<string, { text: string; cta: { title: string; text: string; action: { label: string; href: string } } }> = {
  research: {
    text: "Discoveries from Redwood State labs, field stations and archives, from the tide pools at Gull Rock Point to the canopy of the Tanoak Creek Research Forest. Our researchers and their students work on questions that matter to the North Coast and beyond.",
    cta: { title: "Undergraduate research", text: "More than 180 students present their work at the Fall Undergraduate Research Symposium.", action: { label: "Fall Undergraduate Research Symposium", href: "/events/research-symposium-2026" } },
  },
  campus: {
    text: "New buildings, programs and people shaping life at Redwood State, from residence halls and labs to scholarships and the library's growing digital collections.",
    cta: { title: "See campus for yourself", text: "Tours leave from the Welcome Center every weekday at 10 a.m. and 2 p.m.", action: { label: "Plan a campus visit", href: "/admissions/visit" } },
  },
  athletics: {
    text: "Stories from the Redwood Owls, our 14 IAA Division II teams in the Pacific North Conference: title runs, All-Americans and season previews.",
    cta: { title: "Cheer on the Owls", text: "Students get in free to every home game with their RSU ID.", action: { label: "Redwood Owls Athletics", href: "/athletics" } },
  },
  alumni: {
    text: "Redwood State graduates at work in classrooms, labs, startups and communities across California and around the world.",
    cta: { title: "Stay connected", text: "Update your contact information and find alumni events near you.", action: { label: "Alumni Association", href: "/giving/alumni" } },
  },
};

export default function NewsCategory() {
  const { slug = "" } = useParams();
  const category = newsCategories.find((c) => c.slug === slug);
  useScenario("news-category-intro-justified-001"); // CSS scenario (magazine.css)
  if (!category) return <NotFoundPage />;

  const list = stories.filter((s) => s.category === slug);
  const [lead, ...rest] = list;
  const intro = intros[slug];

  return (
    <div className="news-category page-content">
      <header className="news-section-header">
        <p className="news-kicker">RSU News</p>
        <h1 id="page-title">{category.name}</h1>
        <p className="news-category-intro" data-a11y-scenario="news-category-intro-justified-001">{intro.text}</p>
      </header>

      <article className="news-category-lead">
        <Img image={lead.image} alt={`${lead.image}_web.jpg`} scenario="news-category-img-alt-001" fixedAlt="" sizes="(min-width: 60rem) 40rem, 100vw" aspect="16 / 9" />
        <div>
          <h2><Link to={`/news/${lead.slug}`}>{lead.title}</Link></h2>
          <p className="news-dek">{lead.dek}</p>
          <p className="news-row-meta">{formatDate(lead.date)} · By {lead.author}</p>
          <SmartLink scenario="news-category-readmore-001" to={`/news/${lead.slug}`} defect="Read more »" className="news-readmore">
            Read the full story<span className="visually-hidden">: {lead.title}</span>
          </SmartLink>
        </div>
      </article>

      {rest.length > 0 && (
        <section aria-labelledby="more-heading" className="news-category-more">
          <h2 id="more-heading">More {category.name.toLowerCase()} stories</h2>
          {rest.map((s) => (
            <article key={s.slug} className="news-row">
              <Img image={s.image} alt={`${s.image}_web.jpg`} scenario="news-category-img-alt-001" fixedAlt="" className="news-row-image" sizes="12rem" aspect="4 / 3" />
              <div>
                <h3 className="news-row-title"><Link to={`/news/${s.slug}`}>{s.title}</Link></h3>
                <p className="news-row-dek">{s.dek}</p>
                <p className="news-row-meta">{formatDate(s.date)} · By {s.author}</p>
                <SmartLink scenario="news-category-readmore-001" to={`/news/${s.slug}`} defect="Read more »" className="news-readmore">
                  Read the full story<span className="visually-hidden">: {s.title}</span>
                </SmartLink>
              </div>
            </article>
          ))}
        </section>
      )}

      <CtaBand {...intro.cta} />
      <RelatedLinks
        title="Other sections"
        links={[...newsCategories.filter((c) => c.slug !== slug).map((c) => ({ label: c.name, href: `/news/category/${c.slug}` })), { label: "News Archive", href: "/news/archive" }]}
      />
    </div>
  );
}
