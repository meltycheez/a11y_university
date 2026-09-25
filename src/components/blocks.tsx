// Content block library (plan 05). Templates pick at least two optional blocks per page so pages built on
// the same template still differ. Blocks render accessible baselines; defects are added by the page through
// the scenario helpers (~/a11y/helpers) or props like `titleScenario`.
import { Link } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import type { PageSection } from "~/data/content/pages";
import { Img } from "./Img";

const base = import.meta.env.BASE_URL;
const external = (href: string) => href.startsWith("/documents/") || /^(https?:|mailto:|tel:)/.test(href);

/** Internal paths use the router; documents, mail and external links use <a> (with the base path). */
export function AnyLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return external(href)
    ? <a href={href.startsWith("/") ? base + href.slice(1) : href} className={className}>{children}</a>
    : <Link to={href} className={className}>{children}</Link>;
}

/** Hand-written page copy (src/data/content/pages*.ts). */
export function ContentSection({ section, headingLevel = 2 }: { section: PageSection; headingLevel?: 2 | 3 }) {
  const { heading, paragraphs, list, table, links } = section;
  const H = `h${headingLevel}` as const;
  return (
    <section className="stack">
      {heading && <H>{heading}</H>}
      {paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
      {list && <ul>{list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
      {table && (
        <div className="table-scroll">
          <table>
            {table.caption && <caption>{table.caption}</caption>}
            <thead><tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      {links && (
        <ul className="link-list">
          {links.map((l) => <li key={l.href + l.label}><AnyLink href={l.href}>{l.label}</AnyLink></li>)}
        </ul>
      )}
    </section>
  );
}

export function StatsBand({ stats, label }: { stats: { value: string; label: string }[]; label: string }) {
  return (
    <section className="stats-band" aria-label={label}>
      <ul>{stats.map((s) => <li key={s.label}><span className="stat-value">{s.value}</span><span className="stat-label">{s.label}</span></li>)}</ul>
    </section>
  );
}

export function Quote({ text, name, role, image }: { text: string; name: string; role?: string; image?: string }) {
  return (
    <figure className="quote-block">
      {image && <Img image={image} alt="" className="quote-image" sizes="6rem" aspect="1 / 1" />}
      <blockquote><p>{text}</p></blockquote>
      <figcaption><strong>{name}</strong>{role && <>, {role}</>}</figcaption>
    </figure>
  );
}

export function Gallery({ images, label }: { images: { image: string; alt: string; caption?: string }[]; label: string }) {
  return (
    <section className="gallery" aria-label={label}>
      {images.map((g) => (
        <figure key={g.image}>
          <Img image={g.image} alt={g.alt} sizes="(min-width: 60rem) 30vw, 100vw" aspect="4 / 3" />
          {g.caption && <figcaption>{g.caption}</figcaption>}
        </figure>
      ))}
    </section>
  );
}

/**
 * Video embed placeholder (no third-party player). `titleScenario` registers iframe-missing-title:
 * the frame has no title while defective.
 */
export function VideoEmbed({ title, caption, titleScenario }: { title: string; caption?: string; titleScenario?: string }) {
  const fixed = useScenario(titleScenario);
  const doc = `<!doctype html><html lang="en"><body style="margin:0;display:grid;place-items:center;height:100vh;background:#1a1a18;color:#fff;font:600 1.1rem system-ui">▶ ${title.replace(/</g, "&lt;")}</body></html>`;
  return (
    <figure className="video-embed">
      <iframe srcDoc={doc} title={fixed ? title : undefined} loading="lazy" {...(titleScenario ? { "data-a11y-scenario": titleScenario } : {})} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function RelatedLinks({ title = "Related", links }: { title?: string; links: { label: string; href: string }[] }) {
  return (
    <nav className="related-links" aria-label={title}>
      <h2>{title}</h2>
      <ul>{links.map((l) => <li key={l.href}><AnyLink href={l.href}>{l.label}</AnyLink></li>)}</ul>
    </nav>
  );
}

export function ContactCard({ title, lines }: { title: string; lines: { label: string; value: string; href?: string }[] }) {
  return (
    <aside className="contact-card" aria-label={title}>
      <h2>{title}</h2>
      <dl>
        {lines.map((l) => (
          <div key={l.label}><dt>{l.label}</dt><dd>{l.href ? <AnyLink href={l.href}>{l.value}</AnyLink> : l.value}</dd></div>
        ))}
      </dl>
    </aside>
  );
}

export function CtaBand({ title, text, action }: { title: string; text?: string; action: { label: string; href: string } }) {
  return (
    <section className="cta-band">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      <AnyLink href={action.href} className="btn btn--primary">{action.label}</AnyLink>
    </section>
  );
}
