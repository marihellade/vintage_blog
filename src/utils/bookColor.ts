/**
 * Deterministically assigns a vintage cover colour to a book based on its title.
 * Each book always gets the same colour; no two adjacent palette entries look the same.
 */

const COVER_PALETTES = [
  // plum purple
  { from: '#3A1565', to: '#6B3FA0' },
  // forest green
  { from: '#1C3D10', to: '#4A7550' },
  // dusty rose
  { from: '#6B2040', to: '#A84A6A' },
  // warm amber
  { from: '#5A2C0A', to: '#9A5A2A' },
  // deep teal
  { from: '#0E3A42', to: '#2E7A8A' },
  // dusty blue-violet
  { from: '#1E2A5A', to: '#4A5BAA' },
  // burgundy
  { from: '#4A0E18', to: '#8A2E40' },
  // olive-sage
  { from: '#2A3A10', to: '#5A7030' },
  // lavender-purple
  { from: '#3A2060', to: '#7A5AB5' },
  // burnt sienna
  { from: '#5A2010', to: '#9A4525' },
];

export function bookCoverGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) & 0xffff;
  }
  const { from, to } = COVER_PALETTES[hash % COVER_PALETTES.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}
