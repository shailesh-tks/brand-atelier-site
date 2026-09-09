/** S7 · Close — SPEC.md §3. */
export default function Close() {
  return (
    <section className="section close" aria-labelledby="close-title">
      {/* The hero's focused point, at rest. A closing rhyme; it does not animate. */}
      <span className="close__dot" aria-hidden="true" />

      <h2 className="statement statement--center" id="close-title">
        <span className="line" data-reveal style={{ "--i": 0 } as React.CSSProperties}>
          <span>Where businesses become</span>
        </span>
        <span className="line" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <span>brands people remember.</span>
        </span>
      </h2>

      <p className="close__contact" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
        <span>
          <a className="draw" href="mailto:hello@thebrandatelier.com">
            hello@thebrandatelier.com
          </a>
        </span>
      </p>
    </section>
  );
}
