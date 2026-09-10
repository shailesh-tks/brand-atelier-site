"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import HeroStill from "./HeroStill";

/** three.js lives entirely behind this import and nowhere else. */
const PointField = dynamic(() => import("./PointField"), { ssr: false });

type Scene = "pending" | "gl" | "still";

function pickScene(): Scene {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return "still";
    // Release the probe context immediately; browsers cap how many exist.
    (gl.getExtension("WEBGL_lose_context") as { loseContext(): void } | null)?.loseContext();
    return "gl";
  } catch {
    return "still";
  }
}

export default function Hero() {
  // Starts as "pending" so neither path is rendered on the server: the still
  // would flash before the canvas replaced it, and shipping both is waste.
  // The ground is black either way, so the one frame before this resolves is
  // indistinguishable from the scene's own opening frame.
  const [scene, setScene] = useState<Scene>("pending");
  useEffect(() => setScene(pickScene()), []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      {scene === "gl" && <PointField />}
      {scene === "still" && <HeroStill />}

      <div className="hero__inner">
        <p className="hero__eyebrow">Discover Your Position</p>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__line">
            <span>Brands.</span>
          </span>
          <span className="hero__line">
            <span>Positioned to Lead.</span>
          </span>
        </h1>

        <p className="hero__sub">
          We help brands become distinctive, desirable, and worth choosing.
        </p>
      </div>

      <p className="hero__cue">Scroll</p>
    </section>
  );
}
