/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

/** A Sanity image reference plus the alt text stored next to it. */
export interface SanityImage {
  _type?: string;
  asset?: { _ref?: string; _type?: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
}

export interface PortableTextSpan {
  _key?: string;
  _type: 'span';
  text: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _key?: string;
  _type: 'block';
  style?: string;
  listItem?: string;
  level?: number;
  children: PortableTextSpan[];
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
}

export interface SiteSettings {
  businessName: string;
  shortName: string;
  locationLabel: string;
  orderUrl: string;
  orderMinimum: number;
  depositPercent: number;
  typicalLeadTimeDays: number;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  footerText: string;
}

export type AnnouncementTone = 'plum' | 'pink' | 'green' | 'cream';

export interface Announcement {
  _id: string;
  headline: string;
  message?: string | null;
  linkLabel?: string | null;
  linkUrl?: string | null;
  tone: AnnouncementTone;
  priority?: number | null;
}

export interface MenuCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: SanityImage | null;
  orderUrl?: string | null;
  sortOrder?: number | null;
}

export interface FeaturedProduct {
  _id: string;
  name: string;
  description?: string | null;
  image?: SanityImage | null;
  priceDisplay?: string | null;
  categoryName?: string | null;
  badge?: string | null;
  orderUrl?: string | null;
  sortOrder?: number | null;
}

export type LocationType = 'porch' | 'retailer' | 'market';

export interface Location {
  _id: string;
  name: string;
  locationType: LocationType;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  approximateArea?: string | null;
  publicAddressNote?: string | null;
  deliveryDay?: string | null;
  deliveryTime?: string | null;
  restrictions?: string[] | null;
  preordersAllowed?: boolean | null;
  productsAvailableNote?: string | null;
  sortOrder?: number | null;
}

export interface GalleryPhoto {
  _id: string;
  image: SanityImage;
  altText: string;
  /** Width divided by height of the uploaded file, used for the masonry layout. */
  aspectRatio?: number | null;
  caption?: string | null;
  featured?: boolean | null;
  sortOrder?: number | null;
}

export interface HomePage {
  heroEyebrow?: string | null;
  heroHeading: string;
  heroBody?: string | null;
  heroImage?: SanityImage | null;
  primaryCtaLabel?: string | null;
  primaryCtaUrl?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  introHeading?: string | null;
  introBody?: string | null;
  menuHeading?: string | null;
  menuBody?: string | null;
  featuredCategories?: MenuCategory[] | null;
  storyHeading?: string | null;
  storyBody?: string | null;
  storyImage?: SanityImage | null;
  locationsHeading?: string | null;
  locationsBody?: string | null;
  galleryHeading?: string | null;
  closingHeading?: string | null;
  closingBody?: string | null;
  closingCtaLabel?: string | null;
  closingCtaUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface AboutPage {
  heading: string;
  intro?: string | null;
  portrait?: SanityImage | null;
  story?: PortableTextBlock[] | null;
  supportingImages?: SanityImage[] | null;
  closingHeading?: string | null;
  closingBody?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}
