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

/**
 * Full guest gallery URL for an event slug.
 * Pass the studio to use its connected custom domain instead of the default.
 */
export const guestUrl = (slug, studio) => {
  const host = studio?.custom_domain?.trim();
  const base = host ? `https://${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : PUBLIC_BASE_URL;
  return `${base}/g/${slug}`;
};
