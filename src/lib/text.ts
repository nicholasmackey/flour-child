/*
 * Copyright (c) 2026 CalAmp Corp.  All Rights Reserved
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Browsers happily break a line straight after a hyphen, which leaves headlines
 * reading "Gluten-" on one line and "free" on the next. Hyphenated words are
 * held together so large display type wraps between words instead.
 */
export function keepHyphenatedWordsWhole(text: string): string {
  return escapeHtml(text)
    .split(/(\s+)/)
    .map((part) =>
      part.trim() && part.includes('-') ? `<span class="whitespace-nowrap">${part}</span>` : part
    )
    .join('');
}

/**
 * Statements set at display size want a word or two picked out in the accent
 * colour, and that decision belongs with whoever writes the sentence. Editors
 * mark the words the way they would in a message, with *asterisks* around them.
 *
 * The colour is decoration rather than emphasis, so this renders a span and
 * leaves what a screen reader announces exactly as it was written.
 */
export function markAccentedWords(text: string): string {
  return keepHyphenatedWordsWhole(text).replace(/\*([^*]+)\*/g, '<span class="accent">$1</span>');
}
