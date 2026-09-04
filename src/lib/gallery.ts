/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import type { ImageMetadata } from 'astro';

import type { GalleryPhoto, SanityImage } from '../sanity/types';

export type PlaceholderTone = 'plum' | 'pink' | 'garden' | 'buttercream' | 'dusty' | 'pistachio' | 'cream';

export interface GalleryItem {
  key: string;
  image?: SanityImage | null;
  fallback?: ImageMetadata | null;
  alt: string;
  caption?: string | null;
  aspectRatio: number;
  placeholderLabel?: string;
  placeholderTone?: PlaceholderTone;
}

export interface LocalPhoto {
  key: string;
  image: ImageMetadata;
  alt: string;
  caption?: string;
}

const PLACEHOLDER_TONES: PlaceholderTone[] = ['plum', 'pink', 'garden', 'buttercream', 'dusty', 'pistachio'];
const PLACEHOLDER_RATIOS = [4 / 5, 1, 3 / 4, 1, 4 / 5, 5 / 4];

/**
 * Photos published in the Studio come first, then the photographs that ship with
 * the repository, then branded panels standing in for shots not taken yet.
 */
export function buildGalleryItems(
  photos: GalleryPhoto[],
  locals: LocalPhoto[],
  placeholderLabels: string[]
): GalleryItem[] {
  const published: GalleryItem[] = photos.map((photo) => ({
    key:         photo._id,
    image:       photo.image,
    alt:         photo.altText,
    caption:     photo.caption,
    aspectRatio: photo.aspectRatio ?? 4 / 5
  }));

  const shipped: GalleryItem[] = locals.map((local) => ({
    key:         local.key,
    fallback:    local.image,
    alt:         local.alt,
    caption:     local.caption,
    aspectRatio: local.image.width / local.image.height
  }));

  const waiting: GalleryItem[] = placeholderLabels.map((label, index) => ({
    key:              `placeholder-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    alt:              '',
    aspectRatio:      PLACEHOLDER_RATIOS[index % PLACEHOLDER_RATIOS.length],
    placeholderLabel: label,
    placeholderTone:  PLACEHOLDER_TONES[index % PLACEHOLDER_TONES.length]
  }));

  return published.length > 0 ? [...published, ...shipped] : [...shipped, ...waiting];
}
