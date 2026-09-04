/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

/*
 * Turns the font files in src/assets/fonts/source/ into web fonts.
 *
 *   node scripts/build-fonts.mjs        (or: pnpm fonts)
 *
 * It reads what each file actually says about itself rather than trusting the
 * filename, converts it to WOFF2, and writes matching @font-face rules to
 * src/styles/fonts.css. Nothing is renamed, no weight is invented and no
 * italic is synthesised: whatever is in the folder is what gets declared.
 *
 * Source files stay in src/assets/fonts/source/ and are never published. The
 * generated WOFF2 files are bundled by Astro, so they are served with a hashed
 * filename from this site's own origin.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import * as fontkit from 'fontkit';
import { compress } from 'wawoff2';

const root      = path.resolve(import.meta.dirname, '..');
const sourceDir = path.join(root, 'src/assets/fonts/source');
const webDir    = path.join(root, 'src/assets/fonts/web');
const cssFile   = path.join(root, 'src/styles/fonts.css');
const configFile = path.join(root, 'src/assets/fonts/fonts.config.json');

const HEADER = '/*\n * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved\n */\n';
const SUPPORTED = new Set(['.otf', '.ttf']);

const kebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

async function listSourceFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listSourceFiles(full)));
    } else if (SUPPORTED.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    } else if (path.extname(entry.name).toLowerCase() === '.ttc') {
      process.stdout.write(
        `Skipped ${path.relative(root, full)}: font collections (.ttc) hold several fonts in one file. ` +
          'Export the individual weights as .otf or .ttf first.\n'
      );
    }
  }

  return files.sort();
}

/** Everything below comes out of the font file itself, not the filename. */
function describe(file) {
  const font = fontkit.openSync(file);
  const axes = font.variationAxes ?? {};
  const weightAxis = axes.wght;

  // Name ID 16 is the typographic family, which is what several static weights
  // of the same family should share in CSS. It is only present when it differs
  // from the basic family name.
  const family = font.name?.records?.preferredFamily
    ? Object.values(font.name.records.preferredFamily)[0]
    : font.familyName;

  const italic = Boolean(font['OS/2']?.fsSelection?.italic) || (font.italicAngle ?? 0) !== 0;

  return {
    file,
    family,
    // Some families report a stale subfamily, so the full name is what gets shown.
    subfamily:  (font.fullName ?? font.subfamilyName ?? '').replace(family, '').trim() || 'Regular',
    postscript: font.postscriptName || path.basename(file, path.extname(file)),
    variable:   Boolean(weightAxis),
    weight:     weightAxis
      ? `${Math.round(weightAxis.min)} ${Math.round(weightAxis.max)}`
      : String(font['OS/2']?.usWeightClass ?? 400),
    style: italic ? 'italic' : 'normal',
    axes:  Object.keys(axes)
  };
}

async function readMapping(families) {
  const configured = await fs
    .readFile(configFile, 'utf8')
    .then((raw) => JSON.parse(raw))
    .catch(() => null);

  if (configured?.display || configured?.body) {
    return { display: configured.display, body: configured.body, source: 'fonts.config.json' };
  }

  if (families.length === 1) {
    return { display: families[0], body: families[0], source: 'the only family found' };
  }

  return { display: null, body: null, source: null };
}

const sources = await listSourceFiles(sourceDir);

if (sources.length === 0) {
  await fs.writeFile(
    cssFile,
    `${HEADER}\n/*\n * No custom fonts yet. Drop .otf or .ttf files into\n` +
      ' * src/assets/fonts/source/ and run `pnpm fonts` to fill this file in.\n' +
      ' * Until then the site uses the open source fallbacks named in global.css.\n */\n',
    'utf8'
  );
  process.stdout.write(
    'No font files found in src/assets/fonts/source/.\n' +
      'src/styles/fonts.css was reset, so the site keeps using its fallback fonts.\n'
  );
  process.exit(0);
}

await fs.rm(webDir, { recursive: true, force: true });
await fs.mkdir(webDir, { recursive: true });

const faces = [];

for (const file of sources) {
  const info = describe(file);
  const outputName = `${kebab(info.postscript)}.woff2`;
  const outputPath = path.join(webDir, outputName);

  await fs.writeFile(outputPath, await compress(await fs.readFile(file)));

  faces.push({ ...info, outputName });
}

const families = [...new Set(faces.map((face) => face.family))].sort();
const mapping = await readMapping(families);

const rules = faces
  .map((face) => {
    const label = [face.family, face.subfamily].filter(Boolean).join(' ');
    return (
      `/* ${label}${face.variable ? ` (variable: ${face.axes.join(', ')})` : ''} */\n` +
      '@font-face {\n' +
      `  font-family: '${face.family}';\n` +
      `  src: url('../assets/fonts/web/${face.outputName}') format('woff2');\n` +
      `  font-weight: ${face.weight};\n` +
      `  font-style: ${face.style};\n` +
      '  font-display: swap;\n' +
      '}'
    );
  })
  .join('\n\n');

const assignment =
  mapping.display || mapping.body
    ? ':root {\n' +
      (mapping.display ? `  --font-custom-display: '${mapping.display}';\n` : '') +
      (mapping.body ? `  --font-custom-body: '${mapping.body}';\n` : '') +
      '}\n'
    : '/*\n' +
      ` * Found more than one family: ${families.join(', ')}.\n` +
      ' * Create src/assets/fonts/fonts.config.json to say which does which, then run this again:\n' +
      ` *   { "display": "${families[0]}", "body": "${families[1] ?? families[0]}" }\n` +
      ' */\n';

await fs.writeFile(
  cssFile,
  `${HEADER}\n/* Generated by scripts/build-fonts.mjs. Run \`pnpm fonts\` after changing the source files. */\n\n` +
    `${rules}\n\n${assignment}`,
  'utf8'
);

process.stdout.write(`Converted ${faces.length} font file(s) to WOFF2 in src/assets/fonts/web/\n\n`);
for (const face of faces) {
  process.stdout.write(
    `  ${face.family} ${face.subfamily}`.padEnd(44) +
      `weight ${face.weight}`.padEnd(20) +
      `${face.style}${face.variable ? ` variable(${face.axes.join(',')})` : ''}\n`
  );
}
process.stdout.write(
  `\nFamilies: ${families.join(', ')}\n` +
    (mapping.source
      ? `Display and body assigned from ${mapping.source}.\n`
      : 'Add src/assets/fonts/fonts.config.json to choose the display and body families, then run again.\n')
);
