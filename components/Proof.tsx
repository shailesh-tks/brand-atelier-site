import type { CSSProperties } from "react";
import { getCaseStudies, getClients, getTestimonials, urlFor } from "@/lib/sanity";

/**
 * S5 · Proof — SPEC.md §3.
 *
 * Entirely CMS-driven. If Sanity returns nothing — because it isn't connected
 * yet, or because there's genuinely no work published — this renders null.
 * No placeholder, no "coming soon": an empty proof section is worse than none.
 */
export default async function Proof() {
  const [cases, clients, quotes] = await Promise.all([
    getCaseStudies(),
    getClients(),
    getTestimonials(),
  ]);

  if (!cases.length && !clients.length && !quotes.length) return null;

  return (
    <section className="section proof" aria-labelledby="proof-label">
      <p className="label" id="proof-label" data-reveal style={{ "--i": 0 } as CSSProperties}>
        <span>Selected work</span>
      </p>

      {cases.length > 0 && (
        <ul className="proof__cases">
          {cases.map((c, i) => (
            <li className="proof__case" key={c._id}>
              <span className="proof__media" data-reveal="clip" style={{ "--i": i } as CSSProperties}>
                <span>
                  {urlFor(c.cover, 860) ? (
                    <img
                      src={urlFor(c.cover, 860)!}
                      srcSet={`${urlFor(c.cover, 600)} 600w, ${urlFor(c.cover, 860)} 860w, ${urlFor(c.cover, 1200)} 1200w`}
                      sizes="(min-width: 860px) 40vw, 88vw"
                      alt={c.cover?.alt ?? ""}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
              </span>
              <h3 className="proof__title" data-reveal style={{ "--i": i + 1 } as CSSProperties}>
                <span>
                  {c.title}
                  {(c.sector || c.year) && (
                    <span className="proof__meta">
                      {[c.sector, c.year].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </span>
              </h3>
              {c.summary && (
                <p className="proof__summary" data-reveal="fade" style={{ "--i": i + 2 } as CSSProperties}>
                  <span>{c.summary}</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {quotes.length > 0 && (
        <div className="proof__quotes">
          {quotes.map((q, i) => (
            <blockquote className="proof__quote" key={q._id} data-reveal="fade" style={{ "--i": i } as CSSProperties}>
              <span>
                <p>{q.quote}</p>
                <cite>
                  {q.author}
                  {q.role && <span>{q.role}</span>}
                </cite>
              </span>
            </blockquote>
          ))}
        </div>
      )}

      {clients.length > 0 && (
        <div className="proof__clients" data-reveal="fade" style={{ "--i": 0 } as CSSProperties}>
          <span>
            <ul>
              {clients.map((cl) => (
                <li key={cl._id}>
                  {urlFor(cl.logo, 240) ? (
                    <img src={urlFor(cl.logo, 240)!} alt={cl.logo?.alt ?? cl.name} loading="lazy" decoding="async" />
                  ) : (
                    cl.name
                  )}
                </li>
              ))}
            </ul>
          </span>
        </div>
      )}
    </section>
  );
}
