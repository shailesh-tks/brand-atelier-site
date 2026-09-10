import { asset } from "@/lib/site";

/**
 * Site identity, fixed so it stays with the reader the whole way down.
 *
 * One image cropped straight from the supplied artwork — monogram over
 * wordmark, in the logo's own stacked arrangement and spacing, so the
 * proportions cannot drift from re-composing them in CSS.
 */
export default function Masthead() {
  return (
    <header className="masthead">
      <img
        className="masthead__logo"
        src={asset("/logo-stacked.png")}
        srcSet={`${asset("/logo-stacked.png")} 600w, ${asset("/logo-stacked@2x.png")} 1200w`}
        sizes="146px"
        width={600}
        height={221}
        alt="Brand Atelier"
      />
    </header>
  );
}
