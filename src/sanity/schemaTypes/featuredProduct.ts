/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { StarIcon } from '@sanity/icons/Star';
import { defineField, defineType } from 'sanity';

export const featuredProduct = defineType({
  name:  'featuredProduct',
  title: 'Featured Product',
  type:  'document',
  icon:  StarIcon,
  description:
    'Use this to highlight something on the website. Bakesy remains the source of truth for current ' +
    'availability and pricing.',
  fields: [
    defineField({
      name:       'name',
      title:      'What is it',
      type:       'string',
      validation: (rule) => rule.required().error('Please add a name.')
    }),
    defineField({
      name:        'description',
      title:       'Short description',
      type:        'text',
      rows:        3,
      description: 'A sentence or two about why you are highlighting it right now.'
    }),
    defineField({
      name:    'image',
      title:   'Photo',
      type:    'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name:       'alt',
          title:      'Photo description',
          type:       'string',
          validation: (rule) => rule.required().error('Please describe the photo.')
        })
      ]
    }),
    defineField({
      name:        'priceDisplay',
      title:       'Price to show',
      type:        'string',
      description: 'Optional, and only if you want it here. Bakesy is still where the real price lives.'
    }),
    defineField({
      name:        'category',
      title:       'Menu category',
      type:        'reference',
      to:          [{ type: 'menuCategory' }],
      description: 'Optional. Which part of the menu this belongs to.'
    }),
    defineField({
      name:        'badge',
      title:       'Small label',
      type:        'string',
      description: 'Optional. A couple of words shown on the photo, such as Back this week.',
      validation:  (rule) => rule.max(28).warning('Short labels fit best.')
    }),
    defineField({
      name:        'orderUrl',
      title:       'Link for this item',
      type:        'url',
      description: 'Optional. Leave empty to use your usual Bakesy link from Site Settings.',
      validation:  (rule) => rule.uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
    }),
    defineField({
      name:         'active',
      title:        'Show this on the website',
      type:         'boolean',
      initialValue: true,
      description:  'Turn this off when you stop featuring it. You can turn it back on later.'
    }),
    defineField({
      name:         'sortOrder',
      title:        'Order on the page',
      type:         'number',
      initialValue: 100,
      description:  'Lower numbers appear first.',
      validation:   (rule) => rule.min(0).max(999).integer().error('Enter a whole number between 0 and 999.')
    })
  ],
  orderings: [
    {
      title: 'Order on the page',
      name:  'sortOrderAsc',
      by:    [{ field: 'sortOrder', direction: 'asc' }]
    }
  ],
  preview: {
    select: { title: 'name', subtitle: 'description', media: 'image', active: 'active' },
    prepare: ({ title, subtitle, media, active }) => ({
      title:    active ? title : `${title} (hidden)`,
      subtitle,
      media
    })
  }
});
