/**
 * Public site config.
 *
 * PUBLIC_BASE_URL is what goes into QR codes and shared gallery links.
 * It must be the PUBLISHED domain — not window.location.origin, because in
 * the Base44 editor that resolves to a preview-sandbox URL guests cannot open.
 */
export const PUBLIC_BASE_URL = 'https://snapfind.base44.app';

/**
 * Slugs that can never belong to a studio, because the marketing site and
 * app already use them. Checked when a studio picks its handle.
 */
export const RESERVED_SLUGS = new Set([
  'about', 'admin', 'api', 'assets', 'blog', 'contact', 'dashboard', 'event',
  'features', 'forgot-password', 'g', 'gallery', 'help', 'how-it-works',
  'journal', 'login', 'logout', 'pricing', 'privacy', 'register', 'services',
  'settings', 'signin', 'signup', 'static', 'studio', 'studio-settings',
  'support', 'terms', 'guest-consent', 'for-photographers', 'www',
]);

export const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

export const isValidSlug = (s) =>
  Boolean(s) && s.length >= 3 && !RESERVED_SLUGS.has(s) && /^[a-z0-9-]+$/.test(s);

const baseFor = (studio) => {
  const host = studio?.custom_domain?.trim();
  return host
    ? `https://${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}`
    : PUBLIC_BASE_URL;
};

/**
 * Guest gallery URL.
 * Studios with a handle get the branded form: /menon-studio/anjali-rahul
 * Everyone else falls back to /g/<slug>, which keeps already-printed QR
 * codes working forever.
 */
export const guestUrl = (eventSlug, studio) =>
  studio?.slug
    ? `${baseFor(studio)}/${studio.slug}/${eventSlug}`
    : `${baseFor(studio)}/g/${eventSlug}`;

/** Public studio page URL. */
export const studioUrl = (studio) =>
  studio?.slug ? `${baseFor(studio)}/${studio.slug}` : null;
