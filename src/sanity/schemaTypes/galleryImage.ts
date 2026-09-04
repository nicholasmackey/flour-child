/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { ImagesIcon } from '@sanity/icons/Images';
import { defineField, defineType } from 'sanity';

export const galleryImage = defineType({
  name:  'galleryImage',
  title: 'Gallery Photo',
  type:  'document',
  icon:  ImagesIcon,
  description: 'Photos for the gallery page. Add as many as you like and drag the order around.',
  fields: [
    defineField({
      name:       'image',
      title:      'Photo',
      type:       'image',
      options:    { hotspot: true },
      validation: (rule) => rule.required().error('Please choose a photo.')
    }),
    defineField({
      name:        'altText',
      title:       'Photo description',
      type:        'string',
      description: 'Describe what is in the photo. People using a screen reader hear this instead of seeing it.',
      validation:  (rule) => rule.required().max(160).error('Please describe the photo.')
    }),
    defineField({
      name:        'caption',
      title:       'Caption',
      type:        'string',
      description: 'Optional. Shown under the photo on the gallery page.'
    }),
    defineField({
      name:         'featured',
      title:        'Use this as one of the highlights',
      type:         'boolean',
      initialValue: false,
      description:  'Highlighted photos are the ones that show up on the home page.'
    }),
    defineField({
      name:         'sortOrder',
      title:        'Order in the gallery',
      type:         'number',
      initialValue: 100,
      description:  'Lower numbers appear first.',
      validation:   (rule) => rule.min(0).max(999).integer().error('Enter a whole number between 0 and 999.')
    })
  ],
  orderings: [
    {
      title: 'Order in the gallery',
      name:  'sortOrderAsc',
      by:    [{ field: 'sortOrder', direction: 'asc' }]
    }
  ],
  preview: {
    select: { title: 'altText', subtitle: 'caption', media: 'image', featured: 'featured' },
    prepare: ({ title, subtitle, media, featured }) => ({
      title:    title || 'Gallery photo',
      subtitle: featured ? ['Highlighted', subtitle].filter(Boolean).join(' | ') : subtitle,
      media
    })
  }
});
