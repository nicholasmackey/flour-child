/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import type { SchemaTypeDefinition } from 'sanity';

import { aboutPage } from './aboutPage';
import { announcement } from './announcement';
import { featuredProduct } from './featuredProduct';
import { galleryImage } from './galleryImage';
import { homePage } from './homePage';
import { location } from './location';
import { menuCategory } from './menuCategory';
import { siteSettings } from './siteSettings';

/** Documents that should only ever exist once. */
export const SINGLETON_TYPES = ['siteSettings', 'homePage', 'aboutPage'] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homePage,
  aboutPage,
  announcement,
  menuCategory,
  featuredProduct,
  location,
  galleryImage
];
