/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { createImageUrlBuilder } from '@sanity/image-url';
import type { ImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

import type { SanityImage } from './types';

const builder = createImageUrlBuilder(sanityClient);

/** The one place Sanity image URLs are built. */
export function urlForImage(source: SanityImage): ImageUrlBuilder {
  return builder.image(source).auto('format').fit('max');
}

/** A single sized URL, cropped to the editor's hotspot when one is set. */
export function imageUrl(source: SanityImage, width: number, height?: number): string {
  const image = urlForImage(source).width(width).quality(82);
  return (height ? image.height(height).fit('crop').crop('focalpoint') : image).url();
}

/** A srcset across the widths a layout is likely to ask for. */
export function imageSrcSet(source: SanityImage, widths: number[], aspectRatio?: number): string {
  return widths
    .map((width) => {
      const height = aspectRatio ? Math.round(width / aspectRatio) : undefined;
      return `${imageUrl(source, width, height)} ${width}w`;
    })
    .join(', ');
}

/** True when an image field actually has an asset behind it. */
export function hasImage(source: SanityImage | null | undefined): source is SanityImage {
  return Boolean(source?.asset?._ref);
}
