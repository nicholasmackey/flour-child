/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import type { APIRoute } from 'astro';

import { absoluteUrl, withBase } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  // The Studio is an editing tool, not a page anyone should find in search.
  const body = [
    'User-agent: *',
    `Allow: ${withBase('/')}`,
    `Disallow: ${withBase('/studio')}`,
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml', site)}`,
    ''
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
