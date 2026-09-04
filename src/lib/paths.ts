/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

/*
 * The site is served from a sub-path on GitHub Pages, so a link written as
 * `/menu` would leave it. Paths are still authored site-relative everywhere,
 * and these two put the deployment's base in front of them at the point they
 * are rendered. Astro normalises `base` into BASE_URL, so read it rather than
 * repeating the literal.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** `/menu` -> `/flour-child/menu`. External and anchor links pass through. */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) {
    return path;
  }
  return `${BASE}${path}` || '/';
}

/**
 * The full public URL of a site-relative path, for canonical tags, sharing
 * images and the sitemap. `new URL('/menu', site)` would drop the base, so the
 * path is put through `withBase` first.
 */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(withBase(path), site ?? 'http://localhost:4321').href;
}

/**
 * The reverse, for comparing the current URL against an authored path:
 * `Astro.url.pathname` arrives carrying the base and a possible trailing slash.
 */
export function stripBase(pathname: string): string {
  const atBoundary =
    BASE && (pathname === BASE || pathname.startsWith(`${BASE}/`));
  const withoutBase = atBoundary ? pathname.slice(BASE.length) : pathname;
  return withoutBase.replace(/\/+$/, '') || '/';
}
