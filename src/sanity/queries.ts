/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { sanityClient } from 'sanity:client';

import {
  ABOUT_DEFAULTS,
  HOME_DEFAULTS,
  LOCATION_DEFAULTS,
  MENU_CATEGORY_DEFAULTS,
  SITE_DEFAULTS
} from './defaults';
import type {
  AboutPage,
  Announcement,
  FeaturedProduct,
  GalleryPhoto,
  HomePage,
  Location,
  MenuCategory,
  SiteSettings
} from './types';

/*
 * Every GROQ string lives here. Pages ask for what they need and get either the
 * published content or the shipped defaults, so an empty dataset still renders
 * a real website.
 */

const IMAGE_FIELDS = '{ _type, asset, hotspot, crop, alt, caption }';

const MENU_CATEGORY_FIELDS = `{
  _id,
  name,
  'slug': slug.current,
  description,
  'image': image ${IMAGE_FIELDS},
  orderUrl,
  sortOrder
}`;

const SITE_SETTINGS_QUERY = `*[_type == 'siteSettings' && _id == 'siteSettings'][0]{
  businessName,
  shortName,
  locationLabel,
  orderUrl,
  orderMinimum,
  depositPercent,
  typicalLeadTimeDays,
  instagramUrl,
  facebookUrl,
  defaultSeoTitle,
  defaultSeoDescription,
  footerText
}`;

const HOME_PAGE_QUERY = `*[_type == 'homePage' && _id == 'homePage'][0]{
  heroEyebrow,
  heroHeading,
  heroBody,
  'heroImage': heroImage ${IMAGE_FIELDS},
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  introHeading,
  introBody,
  menuHeading,
  menuBody,
  'featuredCategories': featuredCategories[]->${MENU_CATEGORY_FIELDS},
  storyHeading,
  storyBody,
  'storyImage': storyImage ${IMAGE_FIELDS},
  locationsHeading,
  locationsBody,
  galleryHeading,
  closingHeading,
  closingBody,
  closingCtaLabel,
  closingCtaUrl,
  seoTitle,
  seoDescription
}`;

const ABOUT_PAGE_QUERY = `*[_type == 'aboutPage' && _id == 'aboutPage'][0]{
  heading,
  intro,
  'portrait': portrait ${IMAGE_FIELDS},
  story,
  'supportingImages': supportingImages[] ${IMAGE_FIELDS},
  closingHeading,
  closingBody,
  seoTitle,
  seoDescription
}`;

const ANNOUNCEMENT_QUERY = `*[_type == 'announcement' && enabled == true]
  | order(coalesce(priority, 0) desc, _updatedAt desc){
    _id,
    headline,
    message,
    linkLabel,
    linkUrl,
    tone,
    priority,
    startsAt,
    endsAt
  }`;

const MENU_CATEGORIES_QUERY = `*[_type == 'menuCategory' && active == true]
  | order(coalesce(sortOrder, 999) asc, name asc)${MENU_CATEGORY_FIELDS}`;

const FEATURED_PRODUCTS_QUERY = `*[_type == 'featuredProduct' && active == true]
  | order(coalesce(sortOrder, 999) asc, name asc){
    _id,
    name,
    description,
    'image': image ${IMAGE_FIELDS},
    priceDisplay,
    'categoryName': category->name,
    badge,
    orderUrl,
    sortOrder
  }`;

const LOCATIONS_QUERY = `*[_type == 'location' && active == true]
  | order(coalesce(sortOrder, 999) asc, name asc){
    _id,
    name,
    locationType,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    approximateArea,
    publicAddressNote,
    deliveryDay,
    deliveryTime,
    restrictions,
    preordersAllowed,
    productsAvailableNote,
    sortOrder
  }`;

const GALLERY_QUERY = `*[_type == 'galleryImage' && defined(image.asset)]
  | order(coalesce(sortOrder, 999) asc, _createdAt desc){
    _id,
    'image': image ${IMAGE_FIELDS},
    'aspectRatio': image.asset->metadata.dimensions.aspectRatio,
    altText,
    caption,
    featured,
    sortOrder
  }`;

/**
 * A failed request means the project id, dataset or CORS setup is wrong, and
 * that is worth stopping the build for. An empty result is not an error.
 */
async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  try {
    return await sanityClient.fetch<T>(groq, params);
  } catch (cause) {
    throw new Error(
      'Could not read content from Sanity. Check PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET in .env, ' +
        'and that this origin is allowed under Sanity API settings. See docs/SANITY.md.',
      { cause }
    );
  }
}

/** Drops null and undefined so published fields win and empty ones fall back. */
function withDefaults<T extends object>(defaults: T, published: Partial<T> | null): T {
  if (!published) {
    return defaults;
  }

  const merged = { ...defaults };
  for (const [key, value] of Object.entries(published)) {
    if (value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)) {
      merged[key as keyof T] = value as T[keyof T];
    }
  }

  return merged;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const published = await query<Partial<SiteSettings> | null>(SITE_SETTINGS_QUERY);
  return withDefaults(SITE_DEFAULTS, published);
}

export async function getHomePage(): Promise<HomePage> {
  const published = await query<Partial<HomePage> | null>(HOME_PAGE_QUERY);
  return withDefaults(HOME_DEFAULTS, published);
}

export async function getAboutPage(): Promise<AboutPage> {
  const published = await query<Partial<AboutPage> | null>(ABOUT_PAGE_QUERY);
  return withDefaults(ABOUT_DEFAULTS, published);
}

interface ScheduledAnnouncement extends Announcement {
  startsAt?: string | null;
  endsAt?: string | null;
}

/**
 * The highest priority announcement that is enabled and inside its own date
 * window, or null when there is nothing to say.
 */
export async function getActiveAnnouncement(now: Date = new Date()): Promise<Announcement | null> {
  const candidates = await query<ScheduledAnnouncement[]>(ANNOUNCEMENT_QUERY);
  const current = candidates.find(({ startsAt, endsAt }) => {
    const started = !startsAt || new Date(startsAt) <= now;
    const ended = Boolean(endsAt) && new Date(endsAt as string) <= now;
    return started && !ended;
  });

  if (!current) {
    return null;
  }

  const { startsAt: _startsAt, endsAt: _endsAt, ...announcement } = current;
  return announcement;
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const published = await query<MenuCategory[]>(MENU_CATEGORIES_QUERY);
  return published.length > 0 ? published : MENU_CATEGORY_DEFAULTS;
}

export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  return query<FeaturedProduct[]>(FEATURED_PRODUCTS_QUERY);
}

export async function getLocations(): Promise<Location[]> {
  const published = await query<Location[]>(LOCATIONS_QUERY);
  return published.length > 0 ? published : LOCATION_DEFAULTS;
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  return query<GalleryPhoto[]>(GALLERY_QUERY);
}

/** The categories chosen for the home page, falling back to all of them. */
export async function getHomeCategories(home: HomePage): Promise<MenuCategory[]> {
  if (home.featuredCategories && home.featuredCategories.length > 0) {
    return home.featuredCategories;
  }
  return getMenuCategories();
}
