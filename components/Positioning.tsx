import type { CSSProperties } from "react";

const HELPS = [
  ["Stand apart", "in a crowded market."],
  ["Attract the right audience", "instead of everyone."],
  ["Build perceived value", "and justify premium pricing."],
  ["Create consistency", "across your messaging, visuals, and customer experience."],
  ["Become memorable", "for something specific and meaningful."],
];

/**
 * S3 · What Is Brand Positioning — SPEC.md §3.
 *
 * This section informs; it does not perform. Per the agreed exclusions there
 * is no animation here beyond a single 500ms opacity fade of the whole block,
 * and the five points appear together rather than staggered.
 */
export default function Positioning() {
  return (
    <section className="section positioning" aria-labelledby="pos-title">
      <div data-reveal="block" style={{ "--i": 0 } as CSSProperties}>
        <span>
          <p className="label">What is brand positioning</p>

          <h2 className="positioning__lead" id="pos-title">
            Brand positioning is the space your brand owns in the mind of your customer.
          </h2>

          <div className="positioning__cols">
            <p>
              It defines who you are, who you serve, what makes you different, and why your
              audience should choose you over the alternatives.
            </p>
            <p>
              It matters because great businesses get lost when their value isn&rsquo;t clearly
              communicated.
            </p>
          </div>

          <p className="positioning__kicker">Strong positioning helps you</p>
          <ul className="positioning__list">
            {HELPS.map(([strong, rest]) => (
              <li key={strong}>
                <b>{strong}</b> {rest}
              </li>
            ))}
          </ul>
        </span>
      </div>
    </section>
  );
}
