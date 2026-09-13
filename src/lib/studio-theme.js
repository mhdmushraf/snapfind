/**
 * Studio website theming.
 *
 * Each studio's public page is themed from a small set of choices rather
 * than free-form CSS. Photographers want their site to look like *theirs*
 * without becoming web designers, and constrained choices produce better
 * results than a colour picker and a font dropdown.
 */

/**
 * Layout templates. These change STRUCTURE, not just colour — different
 * hero shapes, section rhythm, type scale and portfolio behaviour. A studio
 * picks one and gets a genuinely different-looking site.
 */
export const TEMPLATES = {
  editorial: {
    label: 'Editorial',
    blurb: 'Big type, generous space, magazine feel',
    heroPad: 'py-28 sm:py-44',
    titleSize: 'text-5xl sm:text-8xl',
    titleWeight: 'font-extrabold',
    sectionPad: 'py-20 sm:py-32',
    h2: 'text-3xl sm:text-5xl font-bold',
    rounded: 'rounded-2xl',
    uppercaseLabels: true,
  },
  gallery: {
    label: 'Gallery',
    blurb: 'Photos first, text stays out of the way',
    heroPad: 'py-20 sm:py-28',
    titleSize: 'text-4xl sm:text-6xl',
    titleWeight: 'font-bold',
    sectionPad: 'py-14 sm:py-20',
    h2: 'text-2xl sm:text-3xl font-semibold',
    rounded: 'rounded-none',
    uppercaseLabels: false,
  },
  bold: {
    label: 'Bold',
    blurb: 'Heavy type, strong colour blocks',
    heroPad: 'py-24 sm:py-36',
    titleSize: 'text-6xl sm:text-9xl',
    titleWeight: 'font-black',
    sectionPad: 'py-20 sm:py-28',
    h2: 'text-4xl sm:text-6xl font-black',
    rounded: 'rounded-3xl',
    uppercaseLabels: true,
  },
  quiet: {
    label: 'Quiet',
    blurb: 'Small type, lots of air, understated',
    heroPad: 'py-32 sm:py-48',
    titleSize: 'text-3xl sm:text-5xl',
    titleWeight: 'font-medium',
    sectionPad: 'py-24 sm:py-36',
    h2: 'text-xl sm:text-2xl font-medium',
    rounded: 'rounded-xl',
    uppercaseLabels: false,
  },
};

/** How the portfolio grid behaves. */
export const PORTFOLIO_LAYOUTS = {
  masonry:   'Masonry — mixed heights',
  grid:      'Grid — even squares',
  alternating: 'Alternating — large and small',
  filmstrip: 'Filmstrip — horizontal scroll',
};

export const ACCENTS = {
  coral:   { label: 'Coral',   hsl: '9 92% 62%',   ink: '0 0% 100%' },
  gold:    { label: 'Gold',    hsl: '38 78% 52%',  ink: '20 14% 11%' },
  sage:    { label: 'Sage',    hsl: '145 25% 42%', ink: '0 0% 100%' },
  rose:    { label: 'Rose',    hsl: '345 60% 55%', ink: '0 0% 100%' },
  ink:     { label: 'Ink',     hsl: '215 30% 25%', ink: '0 0% 100%' },
  terracotta: { label: 'Terracotta', hsl: '18 55% 48%', ink: '0 0% 100%' },
};

export const MODES = {
  light: {
    label: 'Light',
    bg: '0 0% 100%', fg: '200 30% 10%',
    muted: '200 20% 96%', mutedFg: '200 12% 42%', border: '200 18% 90%',
    band: '180 30% 96%',
  },
  warm: {
    label: 'Warm',
    bg: '40 33% 97%', fg: '20 14% 12%',
    muted: '38 30% 93%', mutedFg: '25 8% 42%', border: '30 16% 87%',
    band: '38 40% 94%',
  },
  dark: {
    label: 'Dark',
    bg: '200 20% 8%', fg: '0 0% 96%',
    muted: '200 15% 14%', mutedFg: '200 10% 65%', border: '200 12% 20%',
    band: '200 18% 11%',
  },
};

export const HEADINGS = {
  sans:  { label: 'Modern',   stack: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" },
  serif: { label: 'Classic',  stack: "'Fraunces', ui-serif, Georgia, serif" },
  mono:  { label: 'Editorial', stack: "ui-monospace, SFMono-Regular, Menlo, monospace" },
};

export const HEROES = {
  full:    'Full-bleed photo',
  split:   'Photo beside text',
  minimal: 'Text only, no photo',
};

export const ALL_SECTIONS = [
  ['about',        'About'],
  ['portfolio',    'Portfolio'],
  ['services',     'What we shoot'],
  ['packages',     'Packages'],
  ['testimonials', 'Reviews'],
  ['faqs',         'FAQ'],
  ['contact',      'Contact'],
];

export const DEFAULT_THEME = {
  accent: 'coral', mode: 'light', heading: 'sans', hero: 'full',
  template: 'editorial', portfolio: 'masonry', motion: true,
};
export const DEFAULT_SECTIONS = ['about', 'portfolio', 'services', 'packages', 'testimonials', 'contact'];

export const parseJson = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

export const templateOf = (theme) => TEMPLATES[theme?.template] || TEMPLATES.editorial;

export const themeOf = (studio) => ({ ...DEFAULT_THEME, ...parseJson(studio?.theme, {}) });

/**
 * CSS custom properties for a studio's theme. Applied to a wrapper element
 * so the studio site is themed without touching the rest of the app.
 */
export function themeVars(theme) {
  const accent = ACCENTS[theme.accent] || ACCENTS.coral;
  const mode = MODES[theme.mode] || MODES.light;
  const heading = HEADINGS[theme.heading] || HEADINGS.sans;
  return {
    '--s-accent': accent.hsl,
    '--s-accent-ink': accent.ink,
    '--s-bg': mode.bg,
    '--s-fg': mode.fg,
    '--s-muted': mode.muted,
    '--s-muted-fg': mode.mutedFg,
    '--s-border': mode.border,
    '--s-band': mode.band,
    '--s-heading': heading.stack,
  };
}
