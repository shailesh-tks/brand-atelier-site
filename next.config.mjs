/**
 * PAGES_BASE_PATH is set by the GitHub Pages workflow to "/<repo>", because
 * project Pages are served from a subdirectory. Locally it's empty and the
 * site runs at the root as normal.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  ...(process.env.STATIC_EXPORT ? { output: "export" } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  trailingSlash: true,
};
