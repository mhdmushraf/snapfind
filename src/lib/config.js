/**
 * Public site config.
 *
 * PUBLIC_BASE_URL is what goes into QR codes and shared gallery links.
 * It must be the PUBLISHED domain — not window.location.origin, because in
 * the Base44 editor that resolves to a preview-sandbox URL that guests
 * cannot open. A QR code printed from the editor would otherwise be dead.
 *
 * Update this if you connect a custom domain (e.g. https://snapfind.in).
 */
export const PUBLIC_BASE_URL = 'https://snapfind.base44.app';

/** Full guest gallery URL for an event slug. */
export const guestUrl = (slug) => `${PUBLIC_BASE_URL}/g/${slug}`;
