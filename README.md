# Brand Atelier

Marketing site for Brand Atelier — brand positioning consultancy.

## Running it

```bash
npm install
npm run dev
```

## Structure

One scrolling page, seven sections, in `components/`:

| Section | File | Notes |
|---|---|---|
| Hero | `Hero.tsx`, `PointField.tsx`, `HeroStill.tsx` | The only WebGL on the site. Three.js is dynamically imported and never loads under reduced motion or without WebGL — `HeroStill.tsx` renders instead. |
| Proposition | `Proposition.tsx` | |
| Positioning | `Positioning.tsx` | Deliberately unanimated beyond a single fade. |
| The Offer | `Offer.tsx` | |
| Proof | `Proof.tsx` | CMS-driven. Renders nothing when empty. |
| Founders | `Founders.tsx` | |
| Close | `Close.tsx` | |

`ScrollSpine.tsx` provides smoothed scroll and the reveal primitive for the
whole page. Reveals are opt-in: markup ships visible and the hidden start state
only applies once JS has confirmed motion is wanted, so nothing can be stranded
invisible.

All copy lives in the components. Design tokens are at the top of
`app/globals.css`.

## Content management

Sanity is optional. Without `NEXT_PUBLIC_SANITY_PROJECT_ID` the queries return
empty and the Proof section doesn't render. Copy `.env.example` to `.env.local`
to connect it.

The editing studio is **not** embedded in this app. `next-sanity` drags the
whole studio toolchain in as a dependency — 113MB of `node_modules` and a 288MB
build — for what is, at read time, a GET request with a GROQ query string.
`lib/sanity.ts` calls the HTTP API with plain `fetch` instead, so Next's own
cache handles revalidation and the app carries no Sanity dependency at all.

Use Sanity's free hosted studio for editing. The content model lives in
`sanity/schemas/index.ts` — copy those definitions into a studio project and
run `npx sanity deploy`, which publishes it at `<project>.sanity.studio`.

## Deploying

Pushing to `main` builds a static export and publishes it to GitHub Pages
(`.github/workflows/pages.yml`). For a Node host instead, drop `STATIC_EXPORT`
and deploy normally — `/studio` needs a server to be useful.
