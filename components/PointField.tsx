"use client";

/**
 * The hero scene — SPEC.md §3 "S1 · Hero — the crowded market resolves".
 *
 * A field of identical points is a crowded market. One point resolving into
 * focus is positioning. The whole sequence is time-driven, not scroll-driven:
 * it completes whether or not the visitor scrolls.
 *
 * This module is dynamically imported and is the ONLY thing that pulls in
 * three.js. It is never imported on the reduced-motion or no-WebGL paths.
 */

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

const FOV = 35;
const CAM_Z = 6;
const FOCUS_Z = -2; // the focal plane the resolve settles on

/** SPEC.md §6 "Low-power tier". Same scene, fewer points, no separate build. */
function tier() {
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const low = cores < 8 || mem < 4;
  const mobile = window.innerWidth < 768;
  return {
    count: low ? 225 : mobile ? 450 : 900,
    dpr: low ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    driftScale: low ? 0.5 : 1, // doubled periods = halved speed
    parallax: !mobile,
  };
}

const VERT = `
uniform float uTime;
uniform float uResolve;
uniform float uSize;

attribute vec3 aSeed;   // x: phase, y: speed, z: isFocus

varying float vAlpha;
varying float vBlur;

float expoOut(float x) {
  return x >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x);
}

void main() {
  float isFocus = aSeed.z;

  // Ambient drift — per-point sine, amplitude 0.15u, randomised period.
  // The focused point drifts too, just more slowly; it is part of the field.
  vec3 p = position;
  float amp = mix(0.15, 0.05, isFocus);
  p.x += sin(uTime * 0.55 * aSeed.y + aSeed.x) * amp;
  p.y += cos(uTime * 0.42 * aSeed.y + aSeed.x) * amp;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  // Entrance, t=0.3s over 1100ms, staggered far to near.
  float delay = (12.0 + position.z) / 14.0 * 0.5;
  float fade = expoOut(clamp((uTime - 0.3 - delay) / 1.1, 0.0, 1.0));

  float k = 6.0 / (6.0 - position.z);   // perspective factor, for depth alpha
  float size = uSize / -mv.z;
  float alpha = 0.12 + 0.07 * k;

  // Depth of field: the focal plane tightens from infinity onto FOCUS_Z.
  float blur = uResolve * clamp(abs(position.z - ${FOCUS_Z}.0) / 6.0, 0.0, 1.0) * (1.0 - isFocus);
  size *= 1.0 + blur * 3.4;
  alpha *= 1.0 - blur * 0.72;

  // The resolve itself: 1x -> 3.2x, opacity 0.12 -> 1.0.
  size = mix(size, size * (1.0 + uResolve * 3.4), isFocus);
  alpha = mix(alpha, 0.12 + uResolve * 0.88, isFocus);

  vAlpha = alpha * fade;
  vBlur = blur;

  gl_Position = projectionMatrix * mv;
  gl_PointSize = size;
}
`;

const FRAG = `
precision mediump float;

varying float vAlpha;
varying float vBlur;

void main() {
  float d = length(gl_PointCoord - 0.5);
  // Blurred points get a wider, softer falloff — bokeh, not a scaled dot.
  float soft = 0.18 + vBlur * 0.30;
  float a = smoothstep(0.5, 0.5 - soft, d) * vAlpha;
  if (a <= 0.001) discard;
  gl_FragColor = vec4(0.949, 0.941, 0.925, a); // --cream #F2F0EC
}
`;

function expoOut(x: number) {
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export default function PointField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const t = tier();

    const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(t.dpr);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAM_Z;

    // ── geometry ────────────────────────────────────────────────────
    const positions = new Float32Array(t.count * 3);
    const seeds = new Float32Array(t.count * 3);

    // Index 0 is the point that resolves. Its x/y are set in layout()
    // because where it can sit depends on the aspect ratio.
    seeds[0] = 0;
    seeds[1] = 0.35;
    seeds[2] = 1;
    positions[2] = FOCUS_Z;

    for (let i = 1; i < t.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -12 + Math.random() * 14;
      seeds[i * 3] = Math.random() * Math.PI * 2;
      seeds[i * 3 + 1] = (0.45 + Math.random() * 0.75) * t.driftScale;
      seeds[i * 3 + 2] = 0;
    }

    const geometry = new BufferGeometry();
    const posAttr = new BufferAttribute(positions, 3);
    geometry.setAttribute("position", posAttr);
    geometry.setAttribute("aSeed", new BufferAttribute(seeds, 3));

    const material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolve: { value: 0 },
        uSize: { value: 52 * t.dpr },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });

    const points = new Points(geometry, material);
    scene.add(points);

    // ── layout ──────────────────────────────────────────────────────
    function layout() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Park the focused point in negative space: right of the headline,
      // below its centre. Clamped to the visible frustum at FOCUS_Z so it
      // never drifts off-screen on a narrow portrait viewport.
      const halfH = Math.tan((FOV * Math.PI) / 360) * (CAM_Z - FOCUS_Z);
      const halfW = halfH * camera.aspect;
      positions[0] = halfW * 0.52;
      positions[1] = -halfH * 0.34;
      posAttr.needsUpdate = true;
    }
    layout();

    // ── mouse parallax (desktop only) ───────────────────────────────
    let mx = 0, my = 0, cx = 0, cy = 0;
    function onMove(e: PointerEvent) {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      my = (e.clientY / window.innerHeight - 0.5) * 0.5;
    }
    if (t.parallax) window.addEventListener("pointermove", onMove, { passive: true });

    // ── loop ────────────────────────────────────────────────────────
    const start = performance.now();
    let raf = 0;
    let running = false;

    function frame(now: number) {
      const time = (now - start) / 1000;

      material.uniforms.uTime.value = time;
      material.uniforms.uResolve.value = expoOut(Math.min(Math.max((time - 2.6) / 1.6, 0), 1));

      // Ambient camera sway, ±0.4u x / ±0.2u y over a 20s period, plus the
      // lerped mouse offset. Lerp factor 0.04 — everything lags a beat behind.
      cx += (mx - cx) * 0.04;
      cy += (my - cy) * 0.04;
      camera.position.x = Math.sin((time / 20) * Math.PI * 2) * 0.4 + cx;
      camera.position.y = Math.cos((time / 26) * Math.PI * 2) * 0.2 - cy;
      camera.lookAt(0, 0, FOCUS_Z);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    // SPEC.md §3 "Exit" — the loop stops when the hero leaves the viewport.
    // This is the entire performance story for the rest of the page.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(host);

    const ro = new ResizeObserver(layout);
    ro.observe(host);

    // Measurement hook. Stripped from production builds — SPEC.md §8 needs a
    // frame-cost number, and rAF is throttled whenever the tab is hidden.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __ba?: unknown }).__ba = {
        render: () => renderer.render(scene, camera),
        count: t.count,
        dpr: t.dpr,
        info: renderer.info,
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      if (t.parallax) window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="hero__scene" aria-hidden="true" role="presentation" />;
}
