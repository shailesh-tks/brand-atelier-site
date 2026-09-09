import type { CSSProperties } from "react";
import { asset } from "@/lib/site";

/** S6 · The Founders — SPEC.md §3. Bios verbatim from the source slides. */
const FOUNDERS = [
  {
    slug: "dhivya-rajendran",
    name: "Dhivya Rajendran",
    role: "Founder",
    bio: [
      "A founder, a mother, and a classical dancer — passionate about the power of identity.",
      "From technology to entrepreneurship, I’ve built businesses, communities and brands along the way. My years as a dancer taught me the importance of expression, presence and identity — lessons I now bring into brand positioning.",
      "At The Brand Atelier, I help founders discover what makes them different and turn it into a position that gets remembered.",
    ],
    pull: "Because identity is what makes a brand unforgettable.",
  },
  {
    slug: "meenakshi-vaithinathan",
    name: "Meenakshi Vaithinathan",
    role: "Co-Founder",
    bio: [
      "A designer at heart and an entrepreneur by instinct — my journey has moved through fashion, sustainability, travel, and brand building, each chapter shaping the way I see businesses and people.",
      "Years of exploring new places, meeting different cultures, and building ventures taught me to look beyond the obvious and find the story, character, and potential within every idea.",
      "Today, through The Brand Atelier, I bring that perspective into brand strategy — helping businesses position themselves with clarity and create brands that are distinctive, valuable, and remembered.",
    ],
    pull: "Every brand has a story. The real art is knowing how to tell it.",
  },
];

export default function Founders() {
  return (
    <section className="section founders" aria-labelledby="founders-label">
      <p className="label" id="founders-label" data-reveal style={{ "--i": 0 } as CSSProperties}>
        <span>Who we are</span>
      </p>

      <div className="founders__grid">
        {FOUNDERS.map((f) => (
          <article className="founder" key={f.name}>
            {/* The photograph settles rather than slides: the frame opens from
                the bottom while the image releases from a 1.06 scale. */}
            <span className="founder__media" data-reveal="clip" style={{ "--i": 0 } as CSSProperties}>
              <span>
                {/* Native <picture>. next/image cost 5KB of critical JS to
                    resize two portraits that never change; these are sized
                    once at build instead. */}
                <picture>
                  <source
                    type="image/webp"
                    sizes="(min-width: 860px) 44vw, 92vw"
                    srcSet={`${asset(`/portraits/${f.slug}-600.webp`)} 600w, ${asset(`/portraits/${f.slug}-860.webp`)} 860w, ${asset(`/portraits/${f.slug}-1086.webp`)} 1086w`}
                  />
                  <img
                    src={asset(`/portraits/${f.slug}-1086.jpg`)}
                    srcSet={`${asset(`/portraits/${f.slug}-600.jpg`)} 600w, ${asset(`/portraits/${f.slug}-860.jpg`)} 860w, ${asset(`/portraits/${f.slug}-1086.jpg`)} 1086w`}
                    sizes="(min-width: 860px) 44vw, 92vw"
                    width={1086}
                    height={1448}
                    loading="lazy"
                    decoding="async"
                    alt={`${f.name}, ${f.role} of Brand Atelier`}
                  />
                </picture>
              </span>
            </span>

            <h3 className="founder__name" data-reveal style={{ "--i": 1 } as CSSProperties}>
              <span>
                {f.name}
                <span className="founder__role">{f.role}</span>
              </span>
            </h3>

            <div className="founder__bio" data-reveal="fade" style={{ "--i": 2 } as CSSProperties}>
              <span>
                {f.bio.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p className="founder__pull">{f.pull}</p>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
