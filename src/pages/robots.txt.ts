/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('http://localhost:4321');

  // The Studio is an editing tool, not a page anyone should find in search.
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /studio',
    '',
    `Sitemap: ${new URL('/sitemap.xml', base).href}`,
    ''
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
