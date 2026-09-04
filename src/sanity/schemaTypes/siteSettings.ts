/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { CogIcon } from '@sanity/icons/Cog';
import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name:  'siteSettings',
  title: 'Site Settings',
  type:  'document',
  icon:  CogIcon,
  groups: [
    { name: 'business', title: 'Business', default: true },
    { name: 'ordering', title: 'Ordering' },
    { name: 'social', title: 'Social' },
    { name: 'seo', title: 'Search & Sharing' },
    { name: 'footer', title: 'Footer' }
  ],
  fields: [
    defineField({
      name:        'businessName',
      title:       'Business name',
      type:        'string',
      group:       'business',
      description: 'The full name of the bakery. Used in the page title and in search results.',
      validation:  (rule) => rule.required().error('Please add the business name.')
    }),
    defineField({
      name:        'shortName',
      title:       'Short name',
      type:        'string',
      group:       'business',
      description: 'The shorter version used in tight spaces, such as the footer.',
      validation:  (rule) => rule.required().error('Please add a short name.')
    }),
    defineField({
      name:        'locationLabel',
      title:       'Where you are based',
      type:        'string',
      group:       'business',
      description: 'Shown under the logo and in search results. For example: Forney, Texas.',
      validation:  (rule) => rule.required().error('Please add the town and state.')
    }),
    defineField({
      name:  'orderUrl',
      title: 'Ordering link (Bakesy)',
      type:  'url',
      group: 'ordering',
      description:
        'Customers are sent here when they click Order Online anywhere on the website. ' +
        'Paste your Bakesy shop link.',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
    }),
    defineField({
      name:        'orderMinimum',
      title:       'Order minimum (dollars)',
      type:        'number',
      group:       'ordering',
      description: 'Shown on the menu page. Enter just the number, without a dollar sign.',
      validation:  (rule) => rule.required().min(0).max(500).error('Enter a dollar amount between 0 and 500.')
    }),
    defineField({
      name:        'depositPercent',
      title:       'Deposit percentage',
      type:        'number',
      group:       'ordering',
      description: 'How much of the order is collected up front. Enter 100 for a full deposit.',
      validation:  (rule) => rule.required().min(0).max(100).error('Enter a number between 0 and 100.')
    }),
    defineField({
      name:        'typicalLeadTimeDays',
      title:       'Typical lead time (days)',
      type:        'number',
      group:       'ordering',
      description: 'How far ahead people usually need to order. Shown as a typical time, not a promise.',
      validation:  (rule) => rule.required().min(0).max(60).integer().error('Enter a whole number of days.')
    }),
    defineField({
      name:        'instagramUrl',
      title:       'Instagram link',
      type:        'url',
      group:       'social',
      description: 'Leave this empty and the Instagram link stays hidden on the website.',
      validation:  (rule) => rule.uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
    }),
    defineField({
      name:        'facebookUrl',
      title:       'Facebook link',
      type:        'url',
      group:       'social',
      description: 'Leave this empty and the Facebook link stays hidden on the website.',
      validation:  (rule) => rule.uri({ scheme: ['http', 'https'] }).error('Please paste a full link that starts with https.')
    }),
    defineField({
      name:        'defaultSeoTitle',
      title:       'Default page title',
      type:        'string',
      group:       'seo',
      description: 'The title Google shows for pages that do not have their own. Aim for under 60 characters.',
      validation:  (rule) => rule.max(70).warning('Titles longer than about 60 characters get cut off in Google.')
    }),
    defineField({
      name:        'defaultSeoDescription',
      title:       'Default page description',
      type:        'text',
      rows:        3,
      group:       'seo',
      description: 'The short paragraph Google shows under the title. Aim for about 150 characters.',
      validation:  (rule) => rule.max(200).warning('Descriptions longer than about 160 characters get cut off in Google.')
    }),
    defineField({
      name:        'footerText',
      title:       'Footer message',
      type:        'text',
      rows:        3,
      group:       'footer',
      description: 'A short line at the bottom of every page.'
    })
  ],
  preview: {
    select: { title: 'businessName', subtitle: 'locationLabel' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Site Settings', subtitle })
  }
});
