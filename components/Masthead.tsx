import { asset } from "@/lib/site";

/**
 * Site identity, fixed so it stays with the reader the whole way down.
 *
 * One image cropped straight from the supplied artwork — monogram, wordmark
 * and tagline together, in the logo's own stacked arrangement and spacing,
 * so the proportions cannot drift from re-composing them in CSS.
 */
export default function Masthead() {
  return (
    <header className="masthead">
      <img
        className="masthead__logo"
        src={asset("/logo-full.png")}
        srcSet={`${asset("/logo-full.png")} 700w, ${asset("/logo-full@2x.png")} 1400w`}
        sizes="220px"
        width={700}
        height={314}
        alt="Brand Atelier — Brands. Positioned to Lead."
      />
    </header>
  );
}
