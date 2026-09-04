# Sanity for Flour Child

This is the guide to the part of the website Hailey edits herself.

## What Sanity actually does here

The website is built from two things: the code in this repository, and the content in Sanity.

Sanity is the place where the words, photos, pickup locations and banners live. It has a friendly editor
built into the website itself at `/studio`. Nothing in Sanity is a database of orders or products for sale.
Bakesy stays in charge of what is available, what it costs and how people pay.

Every page also ships with a full set of default copy in `src/sanity/defaults.ts`. If Sanity is empty, or a
field is left blank, the site quietly uses that copy instead of breaking. That is also why the site looks
finished before anything has been imported.

## Running it locally

```sh
pnpm install
cp .env.example .env      # then fill in the two Sanity values
pnpm dev
```

- Website: http://localhost:4321
- Studio: http://localhost:4321/studio

The Studio asks you to log in with the Sanity account that has access to the project.

## Environment variables

| Variable | What it is | Secret |
| --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | The Sanity project the site reads from | No |
| `PUBLIC_SANITY_DATASET` | Always `production` | No |
| `PUBLIC_SITE_URL` | The real address of the site, used for canonical links and the sitemap | No |

Project ids and dataset names are public by design. A Sanity **write token** is a different thing entirely
and must never be put in a `PUBLIC_` variable, because anything with that prefix is shipped to the browser.
Nothing in this project needs a write token.

## CORS: letting the browser talk to Sanity

Sanity blocks browser requests from origins it does not know about. Add each origin at
https://www.sanity.io/manage, under the project, in **API → CORS origins**.

| Origin | Allow credentials | Why |
| --- | --- | --- |
| `http://localhost:4321` | Yes | Local Studio login |
| `https://your-production-domain` | Yes | The live Studio at `/studio` |
| Cloudflare preview URLs | Yes | Only if you plan to use the Studio from a preview build |

Credentials need to be allowed on any origin where someone logs into the Studio. The public website itself
only reads published content, which does not require a login.

If a page fails to build with a message about reading content from Sanity, the origin, the project id or the
dataset name is usually the reason.

## Seeding the starter content

`sanity/seed.ndjson` holds the site settings, the home page, the story, five menu categories, seven pickup
and retail locations, and one example update that is switched off.

```sh
pnpm sanity login                 # once per machine
pnpm seed                         # imports sanity/seed.ndjson into the production dataset
```

`pnpm seed` runs `sanity dataset import sanity/seed.ndjson production --replace`. The `--replace` flag means
documents with the same id are overwritten, so running it a second time resets those documents back to the
shipped copy. Anything Hailey has added separately, such as gallery photos, is untouched.

To regenerate the file after changing the default copy in `src/sanity/defaults.ts`:

```sh
pnpm seed:build
```

## Inviting Hailey

At https://www.sanity.io/manage, open the project, go to **Members**, and invite her email address as an
**Editor**. Editors can create, edit and publish content but cannot change billing or delete the project.
She then logs in at `/studio` on the live site with that same email.

## How publishing works

The website is built as static files. Every page is rendered once, at build time, with whatever content
Sanity had at that moment. That is what makes it fast and cheap to host, and it is also why:

**Clicking Publish in the Studio does not change the live site on its own. The site has to be rebuilt.**

The intended flow is:

1. Hailey edits and clicks Publish in the Studio.
2. A Sanity webhook calls a Cloudflare Pages deploy hook.
3. Cloudflare rebuilds the Astro site.
4. The new content is live, usually within a couple of minutes.

To wire that up once the site is hosted:

1. In Cloudflare Pages, open the project, then **Settings → Builds & deployments → Deploy hooks**. Create a
   hook and copy its URL.
2. In https://www.sanity.io/manage, open the project, then **API → Webhooks → Create webhook**.
   - URL: the Cloudflare deploy hook URL
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: leave empty to rebuild on any change
   - HTTP method: `POST`
3. Publish something in the Studio and confirm a new Cloudflare deployment starts.

Until that exists, a new deployment can be triggered by hand from the Cloudflare dashboard.

## Where to change things

| What Hailey wants to do | Where it is |
| --- | --- |
| Post a temporary message at the top of the site | Updates → Website Updates |
| Change the homepage headline or photo | Website → Home Page |
| Rewrite her story or swap the portrait | Website → Our Story |
| Change where Order Online goes | Website → Site Settings → Ordering |
| Change the order minimum, deposit or lead time | Website → Site Settings → Ordering |
| Add an Instagram or Facebook link | Website → Site Settings → Social |
| Add, hide or reorder a pickup or retail location | Find Us → Pickup & Retail Locations |
| Change a delivery day or time | Find Us → Pickup & Retail Locations → the shop → Day & time |
| Edit a menu category description or photo | Menu → Menu Categories |
| Highlight one specific item for a while | Menu → Featured Products |
| Add bakery photos | Photos → Gallery |

### Posting an update banner

Updates → Website Updates → Create. Give it a name only you will see, write the headline, pick a color, then
turn **Show this on the website** on. The banner appears at the top of every page after the next deploy.
Turning it off hides it again without deleting it, so the same banner can be reused next year.

If more than one update is turned on, the one with the highest **Priority** number is the one people see.
Start and end dates are optional, and leaving both empty means it shows until it is turned off.

One thing worth knowing: because the site is built as static files, start and end dates are checked when the
site is built, not while someone is reading it. A banner set to start next Tuesday appears at the first
rebuild after next Tuesday. For anything time sensitive, turning the banner on and off by hand is the more
predictable option.

### Hiding a shop temporarily

Find Us → Pickup & Retail Locations → the shop → **Show this on the website** → off. The shop disappears
from the Find Us page but the record and all its details stay put for when it comes back.

### Adding gallery photos

Photos → Gallery → Create, choose a photo, describe it in the photo description box, and publish. The
description is what someone using a screen reader hears, so it is required. Photos marked as highlights are
the ones that show up on the home page.

## The Bakesy link

It lives in one place: **Website → Site Settings → Ordering → Ordering link (Bakesy)**. Every Order Online
button on the site reads from it.

In code, the fallback used before Sanity is seeded is `BAKESY_ORDER_URL` in `src/sanity/defaults.ts`.
Individual menu categories and featured products can each override it if a specific item ever needs its own
link, but leaving those empty is the normal case.

## How the code is organised

```
src/sanity/
  schemaTypes/   the shape of each kind of document, and every label Hailey sees
  structure.ts   the Studio sidebar
  queries.ts     every GROQ query, in one file
  types.ts       the TypeScript shape of each query result
  image.ts       the one place Sanity image URLs are built
  defaults.ts    the copy the site ships with, and the source of the seed file
sanity.config.ts the Studio itself
sanity.cli.ts    the Sanity command line tool
```

Pages never write GROQ inline. They call a function from `queries.ts`, which returns published content or
the shipped default.
