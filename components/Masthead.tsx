import { asset } from "@/lib/site";

/**
 * Site identity, fixed so it stays with the reader the whole way down rather
 * than scrolling away with the hero. Both marks come straight from the supplied
 * artwork — the wordmark is the real one, not a typeset approximation.
 */
export default function Masthead() {
  return (
    <header className="masthead">
      <img className="masthead__mark" src={asset("/logo-mark.png")} alt="" aria-hidden="true" />
      <img className="masthead__word" src={asset("/logo-wordmark.png")} alt="Brand Atelier" />
    </header>
  );
}
