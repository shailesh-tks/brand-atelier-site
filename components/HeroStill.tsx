/**
 * The no-WebGL / reduced-motion fallback — SPEC.md §6.
 *
 * The same scene at its resolved state: a blurred field with one point in
 * focus. Drawn as inline SVG rather than shipped as an AVIF (as originally
 * spec'd) because it is ~1.6KB instead of ~40KB, needs no build step, and
 * scales to any viewport without a second asset.
 */

// Deterministic, so the field is identical on every render.
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = rng(7);
const FIELD = Array.from({ length: 90 }, () => {
  const depth = rand(); // 0 = far, 1 = near
  return {
    cx: rand() * 1600,
    cy: rand() * 900,
    r: 2 + depth * 9,
    o: 0.05 + depth * 0.09,
  };
});

export default function HeroStill() {
  return (
    <div className="hero__scene" aria-hidden="true" role="presentation">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="ba-dof" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <radialGradient id="ba-focus">
            <stop offset="0%" stopColor="#F2F0EC" stopOpacity="1" />
            <stop offset="45%" stopColor="#F2F0EC" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F2F0EC" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1600" height="900" fill="#0A0B0C" />

        <g filter="url(#ba-dof)" fill="#F2F0EC">
          {FIELD.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} opacity={p.o} />
          ))}
        </g>

        {/* the one point that resolved */}
        <circle cx="1216" cy="606" r="34" fill="url(#ba-focus)" />
      </svg>
    </div>
  );
}
