import { Img } from "./Img";

interface HeroProps {
  title: string;
  kicker?: string;
  lede?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  variant?: "overlay" | "split" | "banner";
}

export function Hero({ title, kicker, lede, image, imageAlt = "", children, variant = "overlay" }: HeroProps) {
  return (
    <section className={`hero hero--${variant}${image ? " hero--has-image" : ""}`} aria-labelledby="page-title">
      {image && (
        <div className="hero-media">
          <Img image={image} alt={imageAlt} loading="eager" fetchPriority="high" />
        </div>
      )}
      <div className="hero-body">
        {kicker && <p className="hero-kicker">{kicker}</p>}
        <h1 id="page-title">{title}</h1>
        {lede && <p className="hero-lede">{lede}</p>}
        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}
