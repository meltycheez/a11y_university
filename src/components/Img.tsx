import sizes from "~/data/image-sizes.json";
import { useScenario } from "~/a11y/useScenario";

const WIDTHS = [480, 960, 1376];
const base = import.meta.env.BASE_URL;

type ImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height"> & {
  /** Asset manifest id, e.g. "home-hero-quad". */
  image: string;
  /** `sizes` attribute; defaults to full viewport width. */
  sizes?: string;
  /** Aspect ratio for the placeholder when the asset has not been generated yet. */
  aspect?: string;
  /** Alt-text scenario id. While defective, `alt` is used as-is (undefined = no alt attribute). */
  scenario?: string;
  /** Alt text used once the scenario is fixed. */
  fixedAlt?: string;
};

/** Responsive image from public/images, or a tinted placeholder until the asset exists. */
export function Img({ image, sizes: sizesAttr = "100vw", aspect = "16 / 9", className, alt: defectAlt, scenario, fixedAlt, ...rest }: ImgProps) {
  const fixed = useScenario(scenario);
  const alt = scenario && fixed ? fixedAlt : defectAlt;
  const marker = scenario ? { "data-a11y-scenario": scenario } : {};
  const dims = (sizes as Record<string, { width: number; height: number }>)[image];
  if (!dims) {
    return <span className={["img-placeholder", className].filter(Boolean).join(" ")} style={{ aspectRatio: aspect }} role={alt ? "img" : undefined} aria-label={alt || undefined} {...marker} />;
  }
  const widths = WIDTHS.filter((w) => w <= dims.width);
  const src = (w: number) => `${base}images/${image}-${w}.webp`;
  return (
    <img
      src={src(widths[widths.length - 1] ?? WIDTHS[0])}
      srcSet={widths.map((w) => `${src(w)} ${w}w`).join(", ")}
      sizes={sizesAttr}
      width={dims.width}
      height={dims.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      {...marker}
      {...rest}
    />
  );
}
