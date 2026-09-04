/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { defineCliConfig } from 'sanity/cli';

// The Sanity CLI loads `.env` files into `process.env` before reading this file.
export default defineCliConfig({
  api: {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET
  }
});
