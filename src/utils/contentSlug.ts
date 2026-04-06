export function contentSlugFromId(id: string): string {
  return id.replace(/\.(md|mdx)$/i, '');
}
