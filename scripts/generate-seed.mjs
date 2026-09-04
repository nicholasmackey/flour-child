/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

/*
 * Writes sanity/seed.ndjson from the copy the website already ships with, so
 * importing it puts exactly what you see on the site into the Studio.
 *
 *   node scripts/generate-seed.mjs
 *
 * Then import it with the command in docs/SANITY.md.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import {
  ABOUT_DEFAULTS,
  HOME_DEFAULTS,
  LOCATION_DEFAULTS,
  MENU_CATEGORY_DEFAULTS,
  SITE_DEFAULTS
} from '../src/sanity/defaults.ts';

const root = path.resolve(import.meta.dirname, '..');

/** Empty fields are left out so the editor sees a clean document. */
const withoutEmpty = (document) =>
  Object.fromEntries(
    Object.entries(document).filter(
      ([, value]) => value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)
    )
  );

const documents = [
  withoutEmpty({ _id: 'siteSettings', _type: 'siteSettings', ...SITE_DEFAULTS }),

  withoutEmpty({ _id: 'homePage', _type: 'homePage', ...HOME_DEFAULTS }),

  withoutEmpty({ _id: 'aboutPage', _type: 'aboutPage', ...ABOUT_DEFAULTS }),

  ...MENU_CATEGORY_DEFAULTS.map(({ _id, slug, ...category }) =>
    withoutEmpty({
      _id,
      _type:  'menuCategory',
      ...category,
      slug:   { _type: 'slug', current: slug },
      active: true
    })
  ),

  ...LOCATION_DEFAULTS.map(({ _id, ...location }) =>
    withoutEmpty({ _id, _type: 'location', ...location, active: true })
  ),

  // Turned off on purpose. It is here so the announcement editor is not empty
  // the first time it is opened.
  {
    _id:           'announcement.example',
    _type:         'announcement',
    internalTitle: 'Example update (turned off)',
    enabled:       false,
    headline:      'Write your update here',
    message:       'Turn this on when you want it to show at the top of every page.',
    tone:          'plum',
    priority:      0
  }
];

const ndjson = `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`;
const output = path.join(root, 'sanity/seed.ndjson');

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, ndjson, 'utf8');

process.stdout.write(`Wrote ${documents.length} documents to ${path.relative(root, output)}\n`);
