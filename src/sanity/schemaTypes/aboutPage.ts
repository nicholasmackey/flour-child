/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { HeartIcon } from '@sanity/icons/Heart';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name:  'aboutPage',
  title: 'Our Story',
  type:  'document',
  icon:  HeartIcon,
  groups: [
    { name: 'intro', title: 'Introduction', default: true },
    { name: 'story', title: 'Your story' },
    { name: 'photos', title: 'Photos' },
    { name: 'closing', title: 'Closing' },
    { name: 'seo', title: 'Search & Sharing' }
  ],
  fields: [
    defineField({
      name:        'heading',
      title:       'Page heading',
      type:        'string',
      group:       'intro',
      validation:  (rule) => rule.required().max(80).error('Please add a heading of 80 characters or fewer.')
    }),
    defineField({
      name:        'intro',
      title:       'Opening paragraph',
      type:        'text',
      rows:        4,
      group:       'intro',
      description: 'The larger paragraph that sits at the top of the page, before the full story.'
    }),
    defineField({
      name:        'portrait',
      title:       'Main photo of you',
      type:        'image',
      group:       'photos',
      options:     { hotspot: true },
      description: 'The large photo beside your story.',
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
      name:  'story',
      title: 'Your story',
      type:  'array',
      group: 'story',
      description:
        'Write in your own words. Use the paragraph style for most of it, and a heading if you want to break it up.',
      of: [
        defineArrayMember({
          type:   'block',
          styles: [
            { title: 'Paragraph', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [{ title: 'Bullets', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' }
            ],
            annotations: [
              {
                name:   'link',
                title:  'Link',
                type:   'object',
                fields: [
                  defineField({
                    name:       'href',
                    title:      'Link address',
                    type:       'url',
                    validation: (rule) =>
                      rule.uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
                  })
                ]
              }
            ]
          }
        })
      ]
    }),
    defineField({
      name:        'supportingImages',
      title:       'More photos',
      type:        'array',
      group:       'photos',
      description: 'Extra photos shown further down the page. Drag to reorder.',
      of: [
        defineArrayMember({
          type:    'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name:       'alt',
              title:      'Photo description',
              type:       'string',
              validation: (rule) => rule.required().error('Please describe the photo.')
            }),
            defineField({
              name:        'caption',
              title:       'Caption',
              type:        'string',
              description: 'Optional. Shown under the photo.'
            })
          ]
        })
      ],
      validation: (rule) => rule.max(8).warning('More than eight photos makes the page very long.')
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
      rows:  4,
      group: 'closing'
    }),
    defineField({
      name:       'seoTitle',
      title:      'Page title for Google',
      type:       'string',
      group:      'seo',
      validation: (rule) => rule.max(70).warning('Titles longer than about 60 characters get cut off in Google.')
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
    select: { title: 'heading', media: 'portrait' },
    prepare: ({ title, media }) => ({ title: 'Our Story', subtitle: title, media })
  }
});
