/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import { stripBase } from './paths';

export interface NavLink {
  href: string;
  label: string;
}

/** The five pages in the header, the footer and the mobile menu. */
export const NAV_LINKS: NavLink[] = [
  { href: '/menu', label: 'Menu' },
  { href: '/about-us', label: 'Our Story' },
  { href: '/find-us', label: 'Find Us' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' }
];

/*
 * The header sets the same links either side of the centred logo, so it needs
 * them in two groups rather than one list. Labels stay single sourced above.
 */
const link = (href: string): NavLink => {
  const match = NAV_LINKS.find((item) => item.href === href);
  if (!match) {
    throw new Error(`No navigation link is defined for ${href}`);
  }
  return match;
};

export const HEADER_LEFT_LINKS: NavLink[] = ['/menu', '/gallery', '/about-us'].map(link);

export const HEADER_RIGHT_LINKS: NavLink[] = ['/find-us', '/contact'].map(link);

export function isCurrent(pathname: string, href: string): boolean {
  return stripBase(pathname) === href;
}
