/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { HomeIcon } from '@sanity/icons/Home';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
  name:  'homePage',
  title: 'Home Page',
  type:  'document',
  icon:  HomeIcon,
  groups: [
    { name: 'hero', title: 'Top of the page', default: true },
    { name: 'intro', title: 'Introduction' },
    { name: 'menu', title: 'Menu' },
    { name: 'story', title: 'Story' },
    { name: 'locations', title: 'Where to find you' },
    { name: 'closing', title: 'Bottom of the page' },
    { name: 'seo', title: 'Search & Sharing' }
  ],
  fields: [
    defineField({
      name:        'heroEyebrow',
      title:       'Small line above the headline',
      type:        'string',
      group:       'hero',
      description: 'A few words in small capitals, such as your town.'
    }),
    defineField({
      name:        'heroHeading',
      title:       'Headline',
      type:        'string',
      group:       'hero',
      description: 'The first thing people read. Short and plain works best.',
      validation:  (rule) => rule.required().max(90).error('Please add a headline of 90 characters or fewer.')
    }),
    defineField({
      name:        'heroBody',
      title:       'Paragraph under the headline',
      type:        'text',
      rows:        3,
      group:       'hero',
      description: 'One or two sentences about what you bake and where people can get it.'
    }),
    defineField({
      name:        'heroImage',
      title:       'Main photo',
      type:        'image',
      group:       'hero',
      options:     { hotspot: true },
      description: 'The big photo at the top of the page. A tall photo works best here.',
      fields: [
        defineField({
          name:        'alt',
          title:       'Photo description',
          type:        'string',
          description: 'Describe the photo for people using a screen reader. For example: Hailey in her kitchen.',
          validation:  (rule) => rule.required().error('Please describe the photo.')
        })
      ]
    }),
    defineField({
      name:        'primaryCtaLabel',
      title:       'Main button text',
      type:        'string',
      group:       'hero',
      description: 'For example: Order Online.'
    }),
    defineField({
      name:        'primaryCtaUrl',
      title:       'Main button link',
      type:        'url',
      group:       'hero',
      description: 'Leave this empty to use your Bakesy link from Site Settings.',
      validation:  (rule) => rule.uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
    }),
    defineField({
      name:        'secondaryCtaLabel',
      title:       'Second button text',
      type:        'string',
      group:       'hero',
      description: 'For example: See the Menu.'
    }),
    defineField({
      name:        'secondaryCtaUrl',
      title:       'Second button link',
      type:        'string',
      group:       'hero',
      description: 'A page on this website, such as /menu, or a full link to somewhere else.'
    }),
    defineField({
      name:        'introHeading',
      title:       'Introduction statement',
      type:        'string',
      group:       'intro',
      description:
        'The big sentence under the top of the page, saying what Flour Child is. ' +
        'Put *asterisks* around a few words to set them in pink.'
    }),
    defineField({
      name:        'introBody',
      title:       'Introduction paragraph',
      type:        'text',
      rows:        6,
      group:       'intro',
      description:
        'The smaller copy under the statement. Leave a blank line between paragraphs; ' +
        'two short ones is plenty.'
    }),
    defineField({
      name:        'menuHeading',
      title:       'Menu section heading',
      type:        'string',
      group:       'menu'
    }),
    defineField({
      name:        'menuBody',
      title:       'Menu section paragraph',
      type:        'text',
      rows:        3,
      group:       'menu'
    }),
    defineField({
      name:  'featuredCategories',
      title: 'Categories to show on the home page',
      type:  'array',
      group: 'menu',
      description:
        'Pick which menu categories appear here, and drag them into the order you want. ' +
        'Leave this empty to show every active category.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'menuCategory' }] })],
      validation: (rule) => rule.unique().max(6).error('Please choose no more than six categories.')
    }),
    defineField({
      name:  'storyHeading',
      title: 'Story heading',
      type:  'string',
      group: 'story'
    }),
    defineField({
      name:        'storyBody',
      title:       'Story paragraph',
      type:        'text',
      rows:        5,
      group:       'story',
      description: 'A short version of your story. The full version lives on the Our Story page.'
    }),
    defineField({
      name:        'storyImage',
      title:       'Story photo',
      type:        'image',
      group:       'story',
      options:     { hotspot: true },
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
      name:  'locationsHeading',
      title: 'Where to find you heading',
      type:  'string',
      group: 'locations'
    }),
    defineField({
      name:  'locationsBody',
      title: 'Where to find you paragraph',
      type:  'text',
      rows:  3,
      group: 'locations'
    }),
    defineField({
      name:        'galleryHeading',
      title:       'Photos section heading',
      type:        'string',
      group:       'closing',
      description: 'Sits above the small row of photos near the bottom of the page.'
    }),
    defineField({
      name:  'closingHeading',
      title: 'Closing heading',
      type:  'string',
      group: 'closing'
    }),
    defineField({
      name:  'closingBody',
      title: 'Closing paragraph',
      type:  'text',
      rows:  3,
      group: 'closing'
    }),
    defineField({
      name:  'closingCtaLabel',
      title: 'Closing button text',
      type:  'string',
      group: 'closing'
    }),
    defineField({
      name:        'closingCtaUrl',
      title:       'Closing button link',
      type:        'url',
      group:       'closing',
      description: 'Leave this empty to use your Bakesy link from Site Settings.',
      validation:  (rule) => rule.uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
    }),
    defineField({
      name:        'seoTitle',
      title:       'Page title for Google',
      type:        'string',
      group:       'seo',
      validation:  (rule) => rule.max(70).warning('Titles longer than about 60 characters get cut off in Google.')
    }),
    defineField({
      name:       'seoDescription',
      title:      'Page description for Google',
      type:       'text',
      rows:       3,
      group:      'seo',
      validation: (rule) => rule.max(200).warning('Descriptions longer than about 160 characters get cut off in Google.')
    })
  ],
  preview: {
    select: { title: 'heroHeading', media: 'heroImage' },
    prepare: ({ title, media }) => ({ title: 'Home Page', subtitle: title, media })
  }
});
