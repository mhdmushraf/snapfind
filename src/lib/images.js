/**
 * Site imagery — Snapfind.
 *
 * AI-generated (Gemini / Nano Banana Pro) and hosted on Base44 media.
 * Synthetic people, so no model releases or stock licences are needed and the
 * images are free to use commercially. Never caption them as a real studio's
 * client work.
 *
 * Every frame was checked for warped faces and hands before being added here.
 * If you add more, check at 100% zoom first — this is a face-search product
 * and a mangled face on the homepage is the one mistake that can't be undone.
 */
const B = 'https://media.base44.com/images/public/6aa2678950d35eb675a74451';

export const IMG = {
  /** Reception, three generations together, 8 clear faces. Hero / crowd. */
  groupPortrait: `${B}/28348faca_Gemini_Generated_Image_s0v3c1s0v3c1s0v3.jpg`,
  /** PORTRAIT orientation. Bride with mother, cousins, grandmother. */
  bridalPrep:    `${B}/eaae88294_Gemini_Generated_Image_nquloonquloonqul.jpg`,
  /** Kerala Hindu mandapam, tying the thali, nilavilakku, family watching. */
  thali:         `${B}/b98c2127d_Gemini_Generated_Image_qqtzjoqqtzjoqqtz.jpg`,
  /** Syro-Malabar church, crowning at the altar, full congregation. */
  church:        `${B}/67f567d0a_Gemini_Generated_Image_11xsnf11xsnf11xs.jpg`,
  /** Oppana — Kerala Muslim wedding, women in green and gold, 7 faces. */
  oppana:        `${B}/ff133b1a7_Gemini_Generated_Image_5pgwbh5pgwbh5pgw.jpg`,
  /** Sadya on banana leaves, long rows, dozens of faces at depth. */
  sadya:         `${B}/484216b87_Gemini_Generated_Image_gs87k2gs87k2gs87.jpg`,
  /** Haldi in a courtyard, turmeric, 5 laughing faces. */
  haldi:         `${B}/be7c7a7d7_Gemini_Generated_Image_8h8ss48h8ss48h8s.jpg`,
  /** Christian reception, cake cutting, guests with phones up. */
  cakeCutting:   `${B}/53de34f95_Gemini_Generated_Image_yuw9hlyuw9hlyuw9.jpg`,
  /** Photographer crouching with a DSLR mid-shot at a reception. */
  photographer:  `${B}/250eb94df_Gemini_Generated_Image_g4iyw3g4iyw3g4iy.jpg`,
  /** Two guests scanning a QR card at a reception table. The product moment. */
  qrTable:       `${B}/e0f26cf19_Gemini_Generated_Image_pozbg5pozbg5pozb.jpg`,
};

/** Faces clearly visible — safe anywhere the design implies face detection. */
export const FACES = [
  IMG.sadya, IMG.groupPortrait, IMG.oppana, IMG.cakeCutting,
  IMG.thali, IMG.haldi, IMG.church, IMG.qrTable,
];

/** Ordered so adjacent frames differ in tradition, setting and colour. */
export const GALLERY = [
  { src: IMG.groupPortrait, alt: 'Three generations together at a Kerala wedding reception' },
  { src: IMG.oppana,        alt: 'Oppana ceremony at a Kerala Muslim wedding' },
  { src: IMG.church,        alt: 'Crowning at a Syro-Malabar church wedding in Kerala' },
  { src: IMG.haldi,         alt: 'Haldi ceremony in a Kerala courtyard' },
  { src: IMG.thali,         alt: 'Tying the thali at a Kerala Hindu wedding mandapam' },
  { src: IMG.cakeCutting,   alt: 'Cake cutting at a Kerala Christian wedding reception' },
  { src: IMG.sadya,         alt: 'Guests eating a wedding sadya from banana leaves' },
  { src: IMG.qrTable,       alt: 'Guests finding their photos by scanning a QR code at the table' },
];

/** Deal n distinct photos from an offset so a page never repeats a frame. */
export const pick = (n, offset = 0) =>
  Array.from({ length: n }, (_, i) => GALLERY[(offset + i) % GALLERY.length]);

/** All imagery is AI-generated (Gemini / Nano Banana Pro) — no stock credits required. */
export const IMAGE_CREDIT = 'Imagery AI-generated — no stock credits.';