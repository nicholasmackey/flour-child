/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import type { APIRoute } from 'astro';

import { absoluteUrl } from '../lib/paths';

const ROUTES = ['/', '/menu', '/about-us', '/find-us', '/gallery', '/contact'];

export const GET: APIRoute = ({ site }) => {
  const lastModified = new Date().toISOString().slice(0, 10);

  const urls = ROUTES.map((route) => {
    const location = absoluteUrl(route, site);
    return `  <url>\n    <loc>${location}</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
