/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { BellIcon } from '@sanity/icons/Bell';
import { CogIcon } from '@sanity/icons/Cog';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { HeartIcon } from '@sanity/icons/Heart';
import { HomeIcon } from '@sanity/icons/Home';
import { ImagesIcon } from '@sanity/icons/Images';
import { PinIcon } from '@sanity/icons/Pin';
import { StarIcon } from '@sanity/icons/Star';
import { TagIcon } from '@sanity/icons/Tag';
import type { StructureResolver } from 'sanity/structure';

/*
 * The Studio sidebar is organised the way Hailey thinks about the website:
 * pages first, then the things she changes most often. Nothing here shows a
 * schema name.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Flour Child')
    .items([
      S.listItem()
        .title('Website')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Website')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(HomeIcon)
                .child(S.document().schemaType('homePage').documentId('homePage').title('Home Page')),
              S.listItem()
                .title('Our Story')
                .icon(HeartIcon)
                .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('Our Story')),
              S.listItem()
                .title('Site Settings')
                .icon(CogIcon)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'))
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Updates')
        .icon(BellIcon)
        .child(
          S.list()
            .title('Updates')
            .items([
              S.listItem()
                .title('Website Updates')
                .icon(BellIcon)
                .child(
                  S.documentTypeList('announcement')
                    .title('Website Updates')
                    .defaultOrdering([{ field: 'priority', direction: 'desc' }])
                )
            ])
        ),

      S.listItem()
        .title('Menu')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Menu')
            .items([
              S.listItem()
                .title('Menu Categories')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('menuCategory')
                    .title('Menu Categories')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                ),
              S.listItem()
                .title('Featured Products')
                .icon(StarIcon)
                .child(
                  S.documentTypeList('featuredProduct')
                    .title('Featured Products')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                )
            ])
        ),

      S.listItem()
        .title('Find Us')
        .icon(PinIcon)
        .child(
          S.list()
            .title('Find Us')
            .items([
              S.listItem()
                .title('Pickup & Retail Locations')
                .icon(PinIcon)
                .child(
                  S.documentTypeList('location')
                    .title('Pickup & Retail Locations')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                )
            ])
        ),

      S.listItem()
        .title('Photos')
        .icon(ImagesIcon)
        .child(
          S.list()
            .title('Photos')
            .items([
              S.listItem()
                .title('Gallery')
                .icon(ImagesIcon)
                .child(
                  S.documentTypeList('galleryImage')
                    .title('Gallery')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                )
            ])
        )
    ]);
