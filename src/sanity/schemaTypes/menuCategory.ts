/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { TagIcon } from '@sanity/icons/Tag';
import { defineField, defineType } from 'sanity';

export const menuCategory = defineType({
  name:  'menuCategory',
  title: 'Menu Category',
  type:  'document',
  icon:  TagIcon,
  description: 'The kinds of things you bake. These appear on the home page and the menu page.',
  fields: [
    defineField({
      name:       'name',
      title:      'Category name',
      type:       'string',
      validation: (rule) => rule.required().error('Please add a name.')
    }),
    defineField({
      name:        'slug',
      title:       'Web address',
      type:        'slug',
      description: 'Click Generate. This is only used to link to the category on the menu page.',
      options:     { source: 'name', maxLength: 60 },
      validation:  (rule) => rule.required().error('Click Generate to create the web address.')
    }),
    defineField({
      name:        'description',
      title:       'Short description',
      type:        'text',
      rows:        3,
      description: 'One or two sentences. This is the copy people read next to the category.',
      validation:  (rule) => rule.max(280).warning('Shorter descriptions read better on the page.')
    }),
    defineField({
      name:        'image',
      title:       'Photo',
      type:        'image',
      options:     { hotspot: true },
      description: 'A photo of this kind of baking. Without one, the website shows a colored panel instead.',
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
      name:         'active',
      title:        'Show this on the website',
      type:         'boolean',
      initialValue: true,
      description:  'Turn this off to hide a category without deleting it.'
    }),
    defineField({
      name:         'sortOrder',
      title:        'Order on the page',
      type:         'number',
      initialValue: 100,
      description:  'Lower numbers appear first.',
      validation:   (rule) => rule.min(0).max(999).integer().error('Enter a whole number between 0 and 999.')
    }),
    defineField({
      name:        'orderUrl',
      title:       'Link for this category',
      type:        'url',
      description: 'Optional. Leave empty to use your usual Bakesy link from Site Settings.',
      validation:  (rule) => rule.uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
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
