import { Link } from "react-router";
import { Img } from "./Img";

interface CardProps {
  title: string;
  href: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  imageScenario?: string;
  imageFixedAlt?: string;
  meta?: string;
  headingLevel?: 2 | 3 | 4;
}

export function Card({ title, href, text, image, imageAlt, imageScenario, imageFixedAlt, meta, headingLevel = 3 }: CardProps) {
  const H = `h${headingLevel}` as const;
  return (
    <article className="card">
      {image && <Img image={image} alt={imageAlt ?? (imageScenario ? undefined : "")} scenario={imageScenario} fixedAlt={imageFixedAlt} className="card-image" sizes="(min-width: 60rem) 30vw, 100vw" aspect="4 / 3" />}
      <div className="card-body">
        {meta && <p className="card-meta">{meta}</p>}
        <H className="card-title">
          <Link to={href}>{title}</Link>
        </H>
        {text && <p className="card-text">{text}</p>}
      </div>
    </article>
  );
}

export function CardGrid({ children, columns = 3 }: { children: React.ReactNode; columns?: 2 | 3 | 4 }) {
  return <div className={`card-grid card-grid--${columns}`}>{children}</div>;
}
