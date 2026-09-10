/**
 * Site imagery.
 *
 * HONEST STATUS: Wikimedia Commons has almost no usable Indian wedding
 * photography. Most of what is there is amateur snapshots, detail crops, or
 * weddings from other countries. Three photos were removed for exactly that
 * reason (a West African nikah, a roadside crowd shot, a Western bride in a
 * sari) — they read as wrong to any Indian photographer.
 *
 * What remains below is the small set that is genuinely Indian, genuinely
 * wedding coverage, and free to use. Sections without a good photo use the
 * design-led treatment instead of a bad picture — an empty, well-designed
 * block beats a wrong one.
 *
 * TO FIX PROPERLY: replace ALL of these with the studio's own licensed photos
 * (or Adobe Stock). Never add photos from Google Images, Instagram, Pinterest
 * or studio blogs — those are copyrighted and this is a commercial site.
 */
const wm = (file, w = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;

export const IMG = {
  garland:   wm('R&A (22).jpg'),                          // South Indian garland exchange, outdoors
  baraat:    wm('Dancing in Baarat.jpg'),                 // baraat procession, crowd of faces
  walima:    wm('Ishtiaq and Mashqura Reception (14791734476).jpg'), // Muslim reception
  crowning:  wm('Crowning in Syro-Malabar Nasrani Wedding by Mar Gregory Karotemprel.jpg'), // Kerala Christian
  jaymal:    wm('DSC 6070 Indian cultural wedding JAYMAL ceremony new married couple happiness.jpg'),
};

/** Photos with clearly visible faces — safe for anything implying face detection. */
export const FACES = [IMG.baraat, IMG.garland, IMG.walima, IMG.jaymal, IMG.crowning];

export const GALLERY = [
  { src: IMG.baraat,   alt: 'Guests dancing in the baraat procession' },
  { src: IMG.crowning, alt: 'Crowning at a Kerala Syro-Malabar Christian wedding' },
  { src: IMG.garland,  alt: 'Garland exchange at a South Indian wedding' },
  { src: IMG.walima,   alt: 'Bride and groom at a Muslim wedding reception' },
  { src: IMG.jaymal,   alt: 'Newly married couple at the jaymal ceremony' },
];

/** Deal n distinct photos from an offset so a page never repeats a frame. */
export const pick = (n, offset = 0) =>
  Array.from({ length: n }, (_, i) => GALLERY[(offset + i) % GALLERY.length]);

export const IMAGE_CREDIT = 'Photos: Wikimedia Commons contributors, CC BY-SA.';
