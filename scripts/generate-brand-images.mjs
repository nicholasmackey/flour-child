/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

/*
 * Rebuilds the two raster brand files that cannot be SVG:
 *
 *   public/apple-touch-icon.png       the home screen icon on iOS
 *   public/brand/flour-child-share.png the image used when a link is shared
 *
 * Both are drawn from the supplied logo files, so run this again if a logo
 * is ever replaced:  node scripts/generate-brand-images.mjs
 *
 * The touch icon needs the monogram the favicon uses, at a size that survives
 * being drawn at 180px.  public/favicon.png is only 32px, so keep a full size
 * copy of that artwork at one of the MONOGRAM_SOURCES paths below.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const PLUM = { r: 0x57, g: 0x2a, b: 0x3a, alpha: 1 };

const MONOGRAM_SOURCES = ['public/brand/flour-child-monogram.svg', 'public/brand/flour-child-monogram.png'];

async function monogram() {
  for (const file of MONOGRAM_SOURCES) {
    try {
      return await fs.readFile(path.join(root, file));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  throw new Error(`no monogram to draw the touch icon from: add ${MONOGRAM_SOURCES.join(' or ')}`);
}

async function appleTouchIcon() {
  const output = path.join(root, 'public/apple-touch-icon.png');

  await sharp(await monogram(), { density: 384 }).resize(180, 180).png().toFile(output);
  return output;
}

async function shareImage() {
  const logo = await sharp(path.join(root, 'public/brand/flour-child-primary-white.svg'), { density: 300 })
    .resize({ width: 760 })
    .png()
    .toBuffer();

  const output = path.join(root, 'public/brand/flour-child-share.png');

  await sharp({ create: { width: 1200, height: 630, channels: 4, background: PLUM } })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toFile(output);

  return output;
}

/* One missing source should not cost us the file the other one draws. */
const results = await Promise.allSettled([appleTouchIcon(), shareImage()]);

const written = results.filter((result) => result.status === 'fulfilled');
const failed = results.filter((result) => result.status === 'rejected');

for (const { value } of written) process.stdout.write(`${path.relative(root, value)}\n`);
for (const { reason } of failed) process.stderr.write(`${reason.message}\n`);

if (failed.length) process.exitCode = 1;
