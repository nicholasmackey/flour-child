/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { BellIcon } from '@sanity/icons/Bell';
import { defineField, defineType } from 'sanity';

export const announcement = defineType({
  name:  'announcement',
  title: 'Website Update',
  type:  'document',
  icon:  BellIcon,
  description: 'A short message that sits at the very top of every page.',
  fields: [
    defineField({
      name:        'internalTitle',
      title:       'Name it for yourself',
      type:        'string',
      description: 'Only you see this. It is how you will find this update again later.',
      validation:  (rule) => rule.required().error('Please give this update a name so you can find it later.')
    }),
    defineField({
      name:        'enabled',
      title:       'Show this on the website',
      type:        'boolean',
      initialValue: false,
      description: 'Turn this on when you want the message to appear. Turn it off to hide it without deleting it.'
    }),
    defineField({
      name:        'headline',
      title:       'Short headline',
      type:        'string',
      description: 'A few words in bold. For example: Holiday preorders are open.',
      validation:  (rule) => rule.required().max(70).error('Please keep the headline to 70 characters or fewer.')
    }),
    defineField({
      name:        'message',
      title:       'Extra detail',
      type:        'string',
      description: 'Optional. One short sentence after the headline.',
      validation:  (rule) => rule.max(140).warning('Long messages get cut off on phones.')
    }),
    defineField({
      name:        'linkLabel',
      title:       'Button text',
      type:        'string',
      description: 'Optional. For example: Order now.'
    }),
    defineField({
      name:        'linkUrl',
      title:       'Button link',
      type:        'string',
      description: 'Where the button goes. A page on this website such as /menu, or a full link starting with https.'
    }),
    defineField({
      name:        'tone',
      title:       'Color',
      type:        'string',
      initialValue: 'plum',
      description: 'The background color of the bar.',
      options: {
        layout: 'radio',
        list: [
          { title: 'Plum', value: 'plum' },
          { title: 'Pink', value: 'pink' },
          { title: 'Green', value: 'green' },
          { title: 'Cream', value: 'cream' }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name:        'startsAt',
      title:       'Start showing on',
      type:        'datetime',
      description:
        'Optional. Leave empty to start as soon as you turn it on. A future date only takes effect the ' +
        'next time the website rebuilds.'
    }),
    defineField({
      name:        'endsAt',
      title:       'Stop showing on',
      type:        'datetime',
      description:
        'Optional. Leave empty and it stays up until you turn it off. Like the start date, an end date ' +
        'takes effect at the next rebuild.',
      validation: (rule) =>
        rule.custom((endsAt, context) => {
          const startsAt = (context.document as { startsAt?: string } | undefined)?.startsAt;
          if (!endsAt || !startsAt) {
            return true;
          }
          return new Date(endsAt) > new Date(startsAt) || 'The end date needs to come after the start date.';
        })
    }),
    defineField({
      name:        'priority',
      title:       'Priority',
      type:        'number',
      initialValue: 0,
      description: 'If more than one update is turned on, the one with the highest number is the one people see.',
      validation:  (rule) => rule.min(0).max(100).integer().error('Enter a whole number between 0 and 100.')
    })
  ],
  orderings: [
    {
      title: 'Priority, highest first',
      name:  'priorityDesc',
      by:    [{ field: 'priority', direction: 'desc' }]
    }
  ],
  preview: {
    select: { title: 'internalTitle', headline: 'headline', enabled: 'enabled' },
    prepare: ({ title, headline, enabled }) => ({
      title:    title || headline,
      subtitle: enabled ? `Showing now: ${headline}` : `Hidden: ${headline}`
    })
  }
});
