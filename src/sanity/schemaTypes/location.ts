/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { PinIcon } from '@sanity/icons/Pin';
import { defineArrayMember, defineField, defineType } from 'sanity';

const isPorchPickup = (context: { document?: { locationType?: string } }) =>
  context.document?.locationType === 'porch';

export const location = defineType({
  name:  'location',
  title: 'Pickup & Retail Location',
  type:  'document',
  icon:  PinIcon,
  description: 'Everywhere people can pick up Flour Child. These appear on the Find Us page.',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'address', title: 'Address' },
    { name: 'schedule', title: 'Day & time' }
  ],
  fields: [
    defineField({
      name:        'name',
      title:       'Name',
      type:        'string',
      group:       'basics',
      description: 'The name customers will recognize, such as the name of the shop.',
      validation:  (rule) => rule.required().error('Please add a name.')
    }),
    defineField({
      name:         'locationType',
      title:        'What kind of place is this',
      type:         'string',
      group:        'basics',
      initialValue: 'retailer',
      options: {
        layout: 'radio',
        list: [
          { title: 'Porch Pickup', value: 'porch' },
          { title: 'Retailer', value: 'retailer' },
          { title: 'Market', value: 'market' }
        ]
      },
      description: 'Porch Pickup is your own pickup spot. Retailers and markets are places that carry your baking.',
      validation:  (rule) => rule.required()
    }),
    defineField({
      name:         'active',
      title:        'Show this on the website',
      type:         'boolean',
      group:        'basics',
      initialValue: true,
      description:  'Turn this off to temporarily hide this location without deleting it.'
    }),
    defineField({
      name:        'addressLine1',
      title:       'Street address',
      type:        'string',
      group:       'address',
      description: 'Leave this empty for Porch Pickup. Your home address never goes on the website.',
      hidden:      ({ document }) => isPorchPickup({ document: document as { locationType?: string } }),
      validation: (rule) =>
        rule.custom((value, context) => {
          if (isPorchPickup(context as { document?: { locationType?: string } })) {
            return true;
          }
          return value ? true : 'Please add the street address for this shop.';
        })
    }),
    defineField({
      name:        'addressLine2',
      title:       'Suite or unit',
      type:        'string',
      group:       'address',
      description: 'Optional.',
      hidden:      ({ document }) => isPorchPickup({ document: document as { locationType?: string } })
    }),
    defineField({
      name:   'city',
      title:  'City',
      type:   'string',
      group:  'address',
      hidden: ({ document }) => isPorchPickup({ document: document as { locationType?: string } }),
      validation: (rule) =>
        rule.custom((value, context) => {
          if (isPorchPickup(context as { document?: { locationType?: string } })) {
            return true;
          }
          return value ? true : 'Please add the city.';
        })
    }),
    defineField({
      name:         'state',
      title:        'State',
      type:         'string',
      group:        'address',
      initialValue: 'TX',
      hidden:       ({ document }) => isPorchPickup({ document: document as { locationType?: string } })
    }),
    defineField({
      name:   'postalCode',
      title:  'ZIP code',
      type:   'string',
      group:  'address',
      hidden: ({ document }) => isPorchPickup({ document: document as { locationType?: string } })
    }),
    defineField({
      name:        'approximateArea',
      title:       'General area',
      type:        'string',
      group:       'address',
      description:
        'For Porch Pickup only. A rough area such as a town or a nearby intersection. ' +
        'Never put your street address here.',
      hidden: ({ document }) => !isPorchPickup({ document: document as { locationType?: string } })
    }),
    defineField({
      name:        'publicAddressNote',
      title:       'What customers see instead of an address',
      type:        'string',
      group:       'address',
      description: 'For Porch Pickup only. For example: the address is sent to you after you order.',
      hidden:      ({ document }) => !isPorchPickup({ document: document as { locationType?: string } })
    }),
    defineField({
      name:        'deliveryDay',
      title:       'Delivery day',
      type:        'string',
      group:       'schedule',
      description: 'The day you drop off at this shop. Leave empty for Porch Pickup.',
      options: {
        list: [
          { title: 'Monday', value: 'Monday' },
          { title: 'Tuesday', value: 'Tuesday' },
          { title: 'Wednesday', value: 'Wednesday' },
          { title: 'Thursday', value: 'Thursday' },
          { title: 'Friday', value: 'Friday' },
          { title: 'Saturday', value: 'Saturday' },
          { title: 'Sunday', value: 'Sunday' }
        ]
      }
    }),
    defineField({
      name:        'deliveryTime',
      title:       'Delivery time',
      type:        'string',
      group:       'schedule',
      description: 'Written the way you want it to appear, such as 5:00 PM.'
    }),
    defineField({
      name:        'restrictions',
      title:       'Things customers need to know',
      type:        'array',
      group:       'schedule',
      description: 'Short notes shown as small labels. For example: No pre-orders, or Rolls only.',
      of:          [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'No pre-orders', value: 'No pre-orders' },
          { title: 'Rolls only', value: 'Rolls only' }
        ]
      },
      validation: (rule) => rule.unique()
    }),
    defineField({
      name:         'preordersAllowed',
      title:        'Can people pre-order for this location',
      type:         'boolean',
      group:        'schedule',
      initialValue: true,
      description:  'Turn this off for shops where people simply buy whatever is on the shelf.'
    }),
    defineField({
      name:        'productsAvailableNote',
      title:       'Note about what this shop carries',
      type:        'string',
      group:       'schedule',
      description: 'Optional. One short sentence, such as which items this shop usually has.'
    }),
    defineField({
      name:         'sortOrder',
      title:        'Order on the page',
      type:         'number',
      group:        'basics',
      initialValue: 100,
      description:  'Lower numbers appear first. Porch Pickup is always shown on its own at the top.',
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
    select: {
      name:         'name',
      city:         'city',
      area:         'approximateArea',
      day:          'deliveryDay',
      time:         'deliveryTime',
      active:       'active',
      locationType: 'locationType'
    },
    prepare: ({ name, city, area, day, time, active, locationType }) => {
      const place = city || area || '';
      const when = [day, time].filter(Boolean).join(' at ');
      const parts = [place, when].filter(Boolean).join(' | ');
      const label = locationType === 'porch' ? 'Porch Pickup' : parts;

      return {
        title:    active ? name : `${name} (hidden)`,
        subtitle: locationType === 'porch' ? [label, place].filter(Boolean).join(' | ') : parts
      };
    }
  }
});
