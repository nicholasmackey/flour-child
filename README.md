# Flour Child NTX

The website for Flour Child NTX, a small gluten-free bakery in Forney, Texas.

It is a marketing site, not a store. Ordering, current availability, pricing and checkout all stay on
Bakesy, and every Order Online button on the site sends people there.

Built with Astro, Tailwind CSS and Sanity, and published as static files.

## Getting started

```sh
pnpm install
cp .env.example .env
pnpm dev
```

- Website: http://localhost:4321
- Sanity Studio: http://localhost:4321/studio

Node 22.12 or newer is required.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the local dev server |
| `pnpm build` | Build the static site into `dist/` |
| `pnpm preview` | Serve the built site locally |
| `pnpm check` | Type check the Astro and TypeScript files |
| `pnpm fonts` | Convert the font files in `src/assets/fonts/source/` to WOFF2 and regenerate the `@font-face` rules |
| `pnpm seed:build` | Regenerate `sanity/seed.ndjson` from the default copy |
| `pnpm seed` | Import the starter content into the Sanity dataset |
| `pnpm brand:images` | Rebuild the touch icon and the link sharing image from the logos |

## Environment

Copy `.env.example` to `.env`.

| Variable | Notes |
| --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | Public Sanity project id |
| `PUBLIC_SANITY_DATASET` | `production` |
| `PUBLIC_SITE_URL` | The real domain, used for canonical links, the sitemap and sharing cards. Falls back to `http://localhost:4321` |

None of these are secrets. A Sanity write token is a secret, is not needed by this project, and must never
be given a `PUBLIC_` prefix.

## Sanity

The full guide, including CORS setup, seeding, inviting Hailey and wiring publishing to a rebuild, is in
[docs/SANITY.md](docs/SANITY.md).

Short version:

```sh
pnpm sanity login
pnpm seed
```

Then open `/studio`. The sidebar is organised as Website, Updates, Menu, Find Us and Photos.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/menu` | The menu, ordering basics and any featured products |
| `/about-us` | Hailey's story |
| `/find-us` | Porch pickup and the local shops that carry Flour Child |
| `/gallery` | Photos |
| `/contact` | How to reach the bakery |
| `/studio` | The Sanity Studio |
| `/404` | Not found |
| `/robots.txt`, `/sitemap.xml` | Generated from `PUBLIC_SITE_URL` |

## Where things live

```
public/brand/            logo files, plus the generated link sharing image
public/favicon.png       the 32px monogram tile shown in the browser tab
src/assets/fonts/source/ the supplied font files, never published
src/assets/fonts/web/    the generated WOFF2 files
src/assets/images/       photographs, optimised at build time by Astro
src/components/          the site's components
src/layouts/             the shared page shell
src/pages/               one file per route
src/sanity/              schemas, Studio structure, queries, types, default copy
src/styles/global.css    design tokens: colors, type scale, shared classes
sanity/seed.ndjson       the starter content for Sanity
scripts/                 font, seed and brand image generators
docs/SANITY.md           the guide for maintaining the site
```

### Brand colors and type

All of it is in `src/styles/global.css`, inside the `@theme` block: plum, pink, dusty pink, garden green,
pistachio, buttercream, cream and ink, plus the fluid type scale. Change a value there and it changes
everywhere.

The design leans on photography, type and space rather than blocks of colour. Cream is the page, plum does
the talking, and pink shows up as large type and small accents rather than as filled panels.

### Fonts

Two families, both supplied with the project:

- **Hamburg Hand** for display type. It is a capitals only face, so it is used for headlines and category
  names and never for body copy. It has no `$` or `%` glyph, which is why prices and percentages are set in
  Acumin.
- **Acumin Pro** for everything else: body copy, navigation, labels, captions and buttons. Regular, italic,
  bold and bold italic.

The originals live in `src/assets/fonts/source/` and are never published. Running `pnpm fonts`:

1. reads each file's own metadata rather than trusting the filename,
2. converts it to WOFF2 into `src/assets/fonts/web/`,
3. writes accurate `@font-face` rules to `src/styles/fonts.css`, with `font-display: swap`.

No weight is synthesised and no italic is faked: whatever is in the source folder is what gets declared.
`src/assets/fonts/fonts.config.json` says which family is the display face and which is the body face. To
swap a family, drop the new files in, update that file and run `pnpm fonts` again. If the folder is empty the
site falls back to the stacks named in `global.css`.

The generated WOFF2 files are committed so a build does not need the font toolchain, and Astro serves them
hashed from this site's own origin.

### The Bakesy link

One place: Site Settings in the Studio, with `BAKESY_ORDER_URL` in `src/sanity/defaults.ts` as the fallback
used before Sanity is seeded.

### Photographs

Photographs live in `src/assets/images/`, are referenced through Astro's image handling, and are resized and
converted at build time by Sharp. Photos uploaded to the Studio are served from Sanity's image pipeline
instead. Anywhere a photo does not exist yet, the site shows a branded panel rather than a broken image or a
stock photo.

## Deployment

The site builds to static files with `pnpm build`, so any static host works. The plan is Cloudflare Pages:

- Build command: `pnpm build`
- Output directory: `dist`
- Node version: 22.12 or newer
- Environment variables: the three listed above, with `PUBLIC_SITE_URL` set to the real domain

Because the site is static, publishing in Sanity does not change the live site until it is rebuilt. Wiring a
Sanity webhook to a Cloudflare deploy hook is covered in [docs/SANITY.md](docs/SANITY.md).
