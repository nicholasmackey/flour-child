/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import type {
  AboutPage,
  HomePage,
  Location,
  MenuCategory,
  PortableTextBlock,
  SiteSettings
} from './types';

/*
 * This file is the single source of truth for the copy the site ships with.
 * Two things read it:
 *
 *   1. The pages, which use it whenever Sanity has nothing to say yet.
 *   2. `scripts/generate-seed.mjs`, which turns it into `sanity/seed.ndjson`.
 *
 * So the website you see before seeding is the same website you see after.
 */

/**
 * Where every Order Online button points until Site Settings says otherwise.
 * The link Facebook hands out carries a `fbclid` tracking parameter; this is
 * the plain shop address underneath it.
 */
export const BAKESY_ORDER_URL = 'https://bakesy.shop/b/flour-child-ntx';

/**
 * The baked goods order request on Bakesy: this week's actual list, with
 * pricing. Where "See What's Available" points, rather than the shop front.
 */
export const BAKESY_BAKED_GOODS_URL =
  'https://bakesy.shop/order-request/1b431535-3211-409e-8774-1b754c4e6921/baked-goods';

export const SITE_DEFAULTS: SiteSettings = {
  businessName:          'Flour Child NTX',
  shortName:             'Flour Child',
  locationLabel:         'Forney, Texas',
  orderUrl:              BAKESY_ORDER_URL,
  orderMinimum:          15,
  depositPercent:        100,
  typicalLeadTimeDays:   3,
  instagramUrl:          'https://www.instagram.com/flourchildntx/',
  facebookUrl:           'https://www.facebook.com/profile.php?id=61578260984340',
  defaultSeoTitle:       'Flour Child NTX | Gluten-Free Bakery in Forney, Texas',
  defaultSeoDescription:
    'Flour Child NTX is a small gluten-free bakery in Forney, Texas. Bread, cinnamon rolls, cookies, scones and ' +
    'kolache, made from scratch for local pickup.',
  footerText:
    'Gluten-free baking out of a kitchen in Forney, Texas. Order online, then pick up on the porch or from a local ' +
    'shop that carries Flour Child.'
};

export const HOME_DEFAULTS: HomePage = {
  heroEyebrow: 'Forney, Texas',
  heroHeading: 'Gluten-free, made from scratch',
  heroBody:    'A small bakery run by Hailey out of her kitchen.',
  heroImage:         null,
  primaryCtaLabel:   'Order Online',
  primaryCtaUrl:     null,
  secondaryCtaLabel: 'See the Menu',
  secondaryCtaUrl:   '/menu',

  introHeading: 'Good baking happens in *small batches*.',
  /* Blank lines split the paragraphs the home page sets under the statement. */
  introBody:
    'Flour Child makes gluten-free bread, cinnamon rolls, cookies, kolache, and rotating weekly ' +
    'favorites from scratch in Forney, Texas.\n\n' +
    'What\u2019s available changes from week to week. Order online for porch pickup or find Flour ' +
    'Child at local shops around North Texas.',

  menuHeading:        'What comes out of the oven',
  menuBody:           'What is available changes week to week. Bakesy always has the current list.',
  featuredCategories: null,

  storyHeading: 'Meet Hailey',
  storyBody:
    'I grew up in the Arizona desert. My mom is gluten intolerant, which is how all of this started. We moved ' +
    'to Texas in the fall of 2024, and the people who order from me are why it feels like home.',
  storyImage: null,

  locationsHeading: 'Find us around North Texas',
  locationsBody:    'Porch pickup in Forney, plus the local shops that carry Flour Child during the week.',

  galleryHeading: 'From the kitchen',

  closingHeading:  'Ready when you are',
  closingBody:     'Ordering happens on Bakesy, where this week\u2019s list and current pricing live.',
  closingCtaLabel: 'Order Online',
  closingCtaUrl:   null,

  seoTitle: 'Flour Child NTX | Gluten-Free Bakery in Forney, Texas',
  seoDescription:
    'A small gluten-free bakery in Forney, Texas. Bread, cinnamon rolls, cookies, muffins, scones and kolache, ' +
    'made from scratch. Order online for local pickup.'
};

/** Small helper so the seeded story keeps stable keys between imports. */
const block = (key: string, text: string, style: 'normal' | 'h2' = 'normal'): PortableTextBlock => ({
  _key:     key,
  _type:    'block',
  style,
  markDefs: [],
  children: [{ _key: `${key}-text`, _type: 'span', text, marks: [] }]
});

export const ABOUT_DEFAULTS: AboutPage = {
  heading: 'From Arizona to Forney',
  intro:
    'I\u2019m Hailey. I bake gluten-free out of my kitchen in Forney, Texas. It started because of my mom, and ' +
    'it kept going because of the people here.',
  portrait: null,
  story: [
    block(
      'story-a',
      'I was born and raised in the Arizona desert. I met my husband right before I turned 21. He is from Texas ' +
        'and was passing through Arizona for work, and we ended up staying out west for about eight more years.'
    ),
    block(
      'story-b',
      'In the fall of 2024 we decided it was time for a new chapter, so we packed up and moved to Texas.'
    ),
    block(
      'story-c',
      'I am an only child, so leaving my mom was the hardest part of it. She is gluten intolerant, and she is the ' +
        'reason I started baking gluten-free in the first place. Once I figured out how to make bread and ' +
        'cinnamon rolls she could actually eat, I could not really stop.'
    ),
    block('story-d', 'Texas did not feel like home right away.', 'h2'),
    block(
      'story-e',
      'Flour Child is what changed that. The people who ordered from me early on encouraged me, welcomed me, ' +
        'celebrated the good weeks and stuck around through the harder ones. A lot of them are friends now. The ' +
        'community that grew up around this bakery is the reason Texas feels like home.'
    ),
    block(
      'story-f',
      'When I am not baking I am usually in the garden, at the gym, on a softball field, at a concert, or ' +
        'wherever my husband is. I love animals of every shape and size. I cook from scratch, I buy local when I ' +
        'can, and I love that Texas takes farming and ranching seriously.'
    ),
    block(
      'story-g',
      'Pink is my favorite color and green is right behind it, which is probably obvious the second you see my ' +
        'kitchen.'
    )
  ],
  supportingImages: null,
  closingHeading:   'Thank you for being part of it',
  closingBody:
    'Every order, every shelf and every market table keeps this going. If you have ordered from Flour Child, you ' +
    'are part of the reason it works.',
  seoTitle: 'Our Story | Flour Child NTX',
  seoDescription:
    'How Flour Child started: Hailey moved from Arizona to Forney, Texas, and began baking gluten-free for her ' +
    'mom. The community here is what kept it going.'
};

export const MENU_CATEGORY_DEFAULTS: MenuCategory[] = [
  {
    _id:         'menuCategory.bread',
    name:        'Bread',
    slug:        'bread',
    description:
      'Soft, sliceable loaves and rolls for sandwiches and toast.',
    sortOrder: 10
  },
  {
    _id:         'menuCategory.cinnamon-rolls',
    name:        'Cinnamon Rolls',
    slug:        'cinnamon-rolls',
    description: 'Big, soft rolls with plenty of cinnamon and icing.',
    sortOrder:   20
  },
  {
    _id:         'menuCategory.cookies-and-cakes',
    name:        'Cookies & Cakes',
    slug:        'cookies-and-cakes',
    description: 'Cookies for right now, cakes for the occasions that matter.',
    sortOrder:   30
  },
  {
    _id:         'menuCategory.muffins-and-scones',
    name:        'Muffins & Scones',
    slug:        'muffins-and-scones',
    description: 'Breakfast that travels well, in the car or on the table.',
    sortOrder:   40
  },
  {
    _id:         'menuCategory.kolache',
    name:        'Kolache',
    slug:        'kolache',
    description: 'A Texas staple that is usually off the table. Not here.',
    sortOrder:   50
  }
];

export const LOCATION_DEFAULTS: Location[] = [
  {
    _id:               'location.porch-pickup',
    name:              'Porch Pickup',
    locationType:      'porch',
    approximateArea:   'Forney, Texas, near FM 548 and University',
    publicAddressNote: 'Address provided after your order is placed.',
    preordersAllowed:  true,
    sortOrder:         10
  },
  {
    _id:              'location.wylie-urban-farm-and-market',
    name:             'Wylie Urban Farm & Market',
    locationType:     'retailer',
    addressLine1:     '2315 E Stone Rd',
    city:             'Wylie',
    state:            'TX',
    postalCode:       '75098',
    deliveryDay:      'Tuesday',
    deliveryTime:     '5 PM',
    preordersAllowed: true,
    sortOrder:        20
  },
  {
    _id:              'location.chisholm-country-store',
    name:             'Chisholm Country Store',
    locationType:     'retailer',
    addressLine1:     '1251 S State Hwy 205',
    city:             'Rockwall',
    state:            'TX',
    postalCode:       '75032',
    deliveryDay:      'Wednesday',
    deliveryTime:     '8 AM',
    restrictions:     ['No pre-orders'],
    preordersAllowed: false,
    sortOrder:        30
  },
  {
    _id:              'location.rooted-etx-local-grocer',
    name:             'Rooted ETX Local Grocer',
    locationType:     'retailer',
    addressLine1:     '9502 FM773',
    city:             'Murchison',
    state:            'TX',
    postalCode:       '75778',
    deliveryDay:      'Wednesday',
    deliveryTime:     '5:30 PM',
    preordersAllowed: true,
    sortOrder:        40
  },
  {
    _id:              'location.tree-of-life-olive-oil',
    name:             'Tree of Life Olive Oil',
    locationType:     'retailer',
    addressLine1:     '3805 Main St',
    city:             'Rowlett',
    state:            'TX',
    postalCode:       '75088',
    deliveryDay:      'Thursday',
    deliveryTime:     '10 AM',
    restrictions:     ['Rolls only', 'No pre-orders'],
    preordersAllowed: false,
    sortOrder:        50
  },
  {
    _id:              'location.the-picket-fence',
    name:             'The Picket Fence',
    locationType:     'retailer',
    addressLine1:     '1001 N Trade Days Blvd',
    city:             'Canton',
    state:            'TX',
    postalCode:       '75103',
    deliveryDay:      'Thursday',
    deliveryTime:     '10 AM',
    preordersAllowed: true,
    sortOrder:        60
  },
  {
    _id:              'location.the-front-porch',
    name:             'The Front Porch',
    locationType:     'retailer',
    addressLine1:     '1605 S Washington St',
    city:             'Kaufman',
    state:            'TX',
    postalCode:       '75142',
    deliveryDay:      'Thursday',
    deliveryTime:     '10 AM',
    preordersAllowed: true,
    sortOrder:        70
  }
];
