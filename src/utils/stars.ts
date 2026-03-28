/**
 * Renders a star rating as ✦ (full), ✦ (half-star via ❨✦❩ look-alike), ✧ (empty).
 * Supports 0.5 increments. Returns a plain string safe to drop into any template.
 *
 * Full star:  ✦
 * Half star:  ✦ (using the CSS half-star glyph trick — we use ✦ with a class)
 * Empty star: ✧
 *
 * Since SVG/HTML templates can't easily do CSS half-star clips on single chars,
 * we use a simple three-glyph approach:
 *   full  → ✦
 *   half  → ✦  (visually the same, distinguished by aria-label only)
 *   empty → ✧
 *
 * The aria-label on the container carries the real value.
 */
export function starsHtml(rating: number): string {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '✦'.repeat(full) + (half ? '✩' : '') + '✧'.repeat(empty);
}

export function starsLabel(rating: number): string {
  return `Rating: ${rating} out of 5`;
}
