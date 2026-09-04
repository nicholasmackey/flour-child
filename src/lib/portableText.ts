/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

import type { PortableTextBlock, PortableTextSpan } from '../sanity/types';

import { escapeHtml } from './text';

/*
 * The Our Story field only allows paragraphs, one heading level, quotes,
 * bullets, bold, italic and links, so a focused renderer is enough here and
 * saves pulling in a rendering library.
 */

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
}

const isSafeHref = (href: string): boolean => /^(https?:\/\/|mailto:|\/)/i.test(href);

function renderSpan(span: PortableTextSpan, markDefs: MarkDef[]): string {
  let html = escapeHtml(span.text ?? '');

  for (const mark of span.marks ?? []) {
    if (mark === 'strong') {
      html = `<strong>${html}</strong>`;
      continue;
    }

    if (mark === 'em') {
      html = `<em>${html}</em>`;
      continue;
    }

    const definition = markDefs.find((markDef) => markDef._key === mark);
    if (definition?.href && isSafeHref(definition.href)) {
      const external = /^https?:\/\//i.test(definition.href);
      const attributes = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      html = `<a href="${escapeHtml(definition.href)}"${attributes}>${html}</a>`;
    }
  }

  return html;
}

const renderChildren = (block: PortableTextBlock): string =>
  (block.children ?? []).map((span) => renderSpan(span, (block.markDefs ?? []) as MarkDef[])).join('');

/** Turns the Studio's rich text into the markup the story pages render. */
export function portableTextToHtml(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks || blocks.length === 0) {
    return '';
  }

  const html: string[] = [];
  let openList = false;

  const closeList = () => {
    if (openList) {
      html.push('</ul>');
      openList = false;
    }
  };

  for (const block of blocks) {
    if (block._type !== 'block') {
      continue;
    }

    const content = renderChildren(block);
    if (!content) {
      continue;
    }

    if (block.listItem === 'bullet') {
      if (!openList) {
        html.push('<ul>');
        openList = true;
      }
      html.push(`<li>${content}</li>`);
      continue;
    }

    closeList();

    if (block.style === 'h2') {
      html.push(`<h2>${content}</h2>`);
    } else if (block.style === 'blockquote') {
      html.push(`<blockquote>${content}</blockquote>`);
    } else {
      html.push(`<p>${content}</p>`);
    }
  }

  closeList();

  return html.join('');
}
