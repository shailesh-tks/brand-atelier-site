import type { CSSProperties } from "react";
import { asset } from "@/lib/site";

/** S2 · The Proposition — SPEC.md §3. */
export default function Proposition() {
  return (
    <section className="section prop" aria-labelledby="prop-title">
      <p className="label" data-reveal style={{ "--i": 0 } as React.CSSProperties}>
        <span>Why us</span>
      </p>

      <h2 className="statement" id="prop-title">
        <span className="line" data-reveal style={{ "--i": 0 } as React.CSSProperties}>
          <span>We don&rsquo;t just</span>
        </span>
        <span className="line" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <span>build brands.</span>
        </span>
        <span className="line line--lead" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
          <span>We build perception.</span>
        </span>
      </h2>

      {/* "Positioning creates preference" — the client's own image, graded
          into the palette. It stands between the claim and the explanation
          because it *is* the claim. */}
      <figure className="prop__media" data-reveal="clip" style={{ "--i": 3 } as CSSProperties}>
        <span>
          <img
              src={asset("/work/positioning-1400.webp")}
              srcSet={`${asset("/work/positioning-900.webp")} 900w, ${asset("/work/positioning-1400.webp")} 1400w, ${asset("/work/positioning-1920.webp")} 1920w`}
              sizes="(min-width: 1280px) 1200px, 92vw"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              alt="A single gold king standing among identical dark pawns."
            />
        </span>
      </figure>

      <div className="prop__body">
        <p data-reveal style={{ "--i": 3 } as React.CSSProperties}>
          <span>
            A brand is more than a logo, a colour palette, or a beautiful identity. It is the
            perception, emotion, and value people associate with your business.
          </span>
        </p>
        <p data-reveal style={{ "--i": 4 } as React.CSSProperties}>
          <span>
            We begin with what makes you different, then turn that essence into a clear position
            and a brand experience built to last. Because premium isn&rsquo;t about looking
            expensive &mdash; it&rsquo;s about being perceived as valuable.
          </span>
        </p>
      </div>
    </section>
  );
}
