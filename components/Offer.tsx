import type { CSSProperties } from "react";

/** S4 · The Offer — SPEC.md §3. Copy is verbatim from the source slides. */
const STEPS = [
  {
    n: "01",
    title: "Uncover",
    body: "We look beyond the surface to understand your brand, identify gaps, and uncover untapped potential.",
  },
  {
    n: "02",
    title: "Position",
    body: "We turn those insights into a clear, distinctive, and premium brand position that sets you apart.",
  },
  {
    n: "03",
    title: "Connect & Grow",
    body: "We define how your brand can connect with the right audience and create meaningful, lasting growth.",
  },
];

export default function Offer() {
  return (
    <section className="section offer" aria-labelledby="offer-label">
      <p className="label" id="offer-label" data-reveal style={{ "--i": 0 } as CSSProperties}>
        <span>What we offer</span>
      </p>

      {/* A real sequence, so it is numbered. Engagement runs 01 → 02 → 03. */}
      <ol className="offer__list">
        {STEPS.map((s, panel) => (
          <li className="offer__item" key={s.n}>
            <span
              className="offer__rule"
              data-reveal="rule"
              style={{ "--i": panel } as CSSProperties}
            >
              <span />
            </span>

            <h3 className="offer__head" data-reveal style={{ "--i": panel + 1 } as CSSProperties}>
              <span>
                <span className="offer__num">{s.n}</span>
                {s.title}
              </span>
            </h3>

            <p className="offer__body" data-reveal="fade" style={{ "--i": panel + 2 } as CSSProperties}>
              <span>{s.body}</span>
            </p>
          </li>
        ))}
      </ol>

      <p className="offer__note" data-reveal="fade" style={{ "--i": 5 } as CSSProperties}>
        <span>
          Every insight is backed by a strategic report and a dedicated consultation, to turn
          clarity into action.
        </span>
      </p>
    </section>
  );
}
