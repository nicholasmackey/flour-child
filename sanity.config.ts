/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { SINGLETON_TYPES, schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

// The embedded Studio is bundled by Astro, which exposes `PUBLIC_`-prefixed
// variables from `.env` on `import.meta.env`.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

const singletons: string[] = [...SINGLETON_TYPES];

// Note: `basePath` is intentionally omitted. The studio route is owned by the
// `studioBasePath` option in `astro.config.mjs`.
export default defineConfig({
  name:      'flour-child',
  title:     'Flour Child',
  projectId,
  dataset,
  plugins:   [structureTool({ structure })],
  schema: { types: schemaTypes },
  document: {
    // There is one Home Page, one Our Story and one Site Settings, so they are
    // opened directly from the sidebar and kept out of the create menu. The
    // initial value templates are deliberately left in place, since the
    // structure needs them to open a singleton that has not been created yet.
    newDocumentOptions: (previous) =>
      previous.filter(({ templateId }) => !singletons.includes(templateId ?? '')),
    // There is only ever one Home Page, so duplicating or deleting it makes no sense.
    actions: (previous, { schemaType }) =>
      singletons.includes(schemaType)
        ? previous.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : previous
  }
});
