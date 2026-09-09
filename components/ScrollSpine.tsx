"use client";

import { useEffect } from "react";

/** Reveal once the element's top passes 65% of the viewport height. */
const TRIGGER = 0.65;

/**
 * The scroll spine — SPEC.md §7 Chunk 2.
 *
 * Two jobs, mounted once for the whole page:
 *   1. Smoothed scroll (Lenis), off under reduced motion, native on touch.
 *   2. The reveal primitive every section uses.
 *
 * The reveal is opt-IN: markup ships visible, and the hidden start state only
 * exists once this component has confirmed JS ran and motion is wanted. If
 * anything here fails, content is simply there. SPEC.md §6.
 *
 * Deliberately NOT an IntersectionObserver. With the negative bottom
 * rootMargin the 35% trigger needs, a fast scroll (a jump link, a restored
 * scroll position, a flung trackpad) can move an element from below the
 * trigger line to above the viewport between two frames. The intersection
 * ratio reads 0 both times, so no callback fires and that content stays
 * hidden permanently. A position sweep cannot strand anything: it reveals
 * whatever is above the line, however it got there.
 */
export default function ScrollSpine() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const root = document.documentElement;
    root.classList.add("js-reveal");

    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let ticking = false;

    function sweep() {
      ticking = false;
      const line = window.innerHeight * TRIGGER;
      // Anything in the last screenful can sit below the trigger line with no
      // scroll left to bring it up. At the bottom of the document, everything
      // still pending is revealed — otherwise the closing contact link, which
      // lives there, would never appear.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      pending = pending.filter((el) => {
        if (!atBottom && el.getBoundingClientRect().top > line) return true;
        el.classList.add("is-in");
        return false;
      });
      // The list only shrinks; once it is empty this stops costing anything.
      if (pending.length === 0) detach();
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    }

    function detach() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sweep(); // anything already above the line on load

    let lenis: { raf(t: number): void; destroy(): void } | null = null;
    let raf = 0;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.1,
        // Matches --ease-out. Nothing bounces.
        easing: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        syncTouch: false, // native momentum survives on mobile — SPEC.md §6
      });
      const tick = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      detach();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
