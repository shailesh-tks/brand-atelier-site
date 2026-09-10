/**
 * PAGES_BASE_PATH is set by the GitHub Pages workflow to "/<repo>", because
 * project Pages are served from a subdirectory. Locally it's empty and the
 * site runs at the root as normal.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,

  // The host OOM-killed the build after 15 minutes. Next fans static
  // generation out across one worker process per CPU, and each carries its own
  // V8 heap, so a per-process --max-old-space-size cap does nothing to bound
  // the total. One worker trades build speed for a memory ceiling that fits.
  experimental: { cpus: 1, workerThreads: false },
  ...(process.env.STATIC_EXPORT ? { output: "export" } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  trailingSlash: true,
};
