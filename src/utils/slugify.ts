/**
 * Converts a string into a URL-friendly slug
 * @param text The text to convert into a slug
 * @returns A URL-friendly slug
 */
export function createSlug(text: string): string {
  return encodeURIComponent(
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  );
}

/**
 * Creates a slug for an artist name
 * @param artistName The artist name to slugify
 * @returns A URL-friendly slug for the artist name
 */
export function createArtistSlug(artistName: string | undefined | null): string {
  return createSlug(artistName || 'unknown-artist');
}


export function createAlbumSlug(albumName: string): string {
  return createSlug(albumName);
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters except word characters and spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
} 