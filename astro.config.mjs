/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

// @ts-check
import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sanity from '@sanity/astro';
import react from '@astrojs/react';

// Astro does not load `.env` files into `process.env` for this config file, so
// read the local `.env` here. Values already set in the environment (CI, hosting
// provider) are left untouched, so this is a no-op in deployed builds.
const envFile = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity environment variables. Set PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET in .env (see .env.example).'
  );
}

// Canonical URLs, OpenGraph tags, the sitemap and robots.txt are all built from
// this. Set PUBLIC_SITE_URL to the real domain before deploying.
const site = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site,

  vite: {
    plugins: [tailwindcss()]
  },


  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2026-03-01',
      // The site is built statically, so read fresh data rather than the CDN.
      useCdn: false,
      studioBasePath: '/studio'
    }),
    react()
  ]
});
