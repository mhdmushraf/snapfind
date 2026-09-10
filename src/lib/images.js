/**
 * Site imagery — Wikimedia Commons only (Creative Commons / public domain).
 * Spans Muslim, Hindu and Kerala Christian traditions on purpose.
 *
 * NOTE: only photos that actually look like wedding coverage are listed here.
 * Weak frames (ritual close-ups, object shots, roadside candids) were removed
 * rather than padded in. The set is small — that is why `pick()` exists, so a
 * page never shows the same photo twice.
 *
 * Replace with studios' own licensed photos as they come in; keep the credit
 * line in the footer until then. Do NOT add photos from Google Images,
 * Instagram or studio blogs — those are copyrighted.
 */
const wm = (file, w = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;

export const IMG = {
  // Muslim
  nikah:       wm('An Islamic wedding for a new Bride and groom.jpg'),
  walima:      wm('Ishtiaq and Mashqura Reception (14791734476).jpg'),
  mehndi:      wm('Band, known as Imam Zamin.jpg'),
  // Kerala Christian (Syro-Malabar Nasrani)
  crowning:    wm('Crowning in Syro-Malabar Nasrani Wedding by Mar Gregory Karotemprel.jpg'),
  // Hindu
  mandapam:    wm('A Hindu bride in Sari being led to mandapa wedding.jpg'),
  garland:     wm('R&A (22).jpg'),
  jaymal:      wm('DSC 6070 Indian cultural wedding JAYMAL ceremony new married couple happiness.jpg'),
  familyDance: wm("Groom's family dancing at wedding ceremony.jpg"),
  baraat:      wm('Dancing in Baarat.jpg'),
};

/** Ordered so adjacent frames are from different traditions. */
export const GALLERY = [
  { src: IMG.nikah,       alt: 'Bride and groom at a Nikah ceremony' },
  { src: IMG.crowning,    alt: 'Crowning at a Kerala Syro-Malabar Christian wedding' },
  { src: IMG.mandapam,    alt: 'Hindu bride being led to the mandapam' },
  { src: IMG.walima,      alt: 'Guests at a Muslim wedding reception' },
  { src: IMG.garland,     alt: 'Garland exchange at a South Indian wedding' },
  { src: IMG.familyDance, alt: "The groom's family dancing at the wedding" },
  { src: IMG.jaymal,      alt: 'Newly married couple at the jaymal ceremony' },
  { src: IMG.mehndi,      alt: 'Bride and groom during a Muslim wedding ritual' },
];

/**
 * Deal n distinct photos starting at an offset, so different sections of the
 * same page never repeat a frame.
 */
export const pick = (n, offset = 0) =>
  Array.from({ length: n }, (_, i) => GALLERY[(offset + i) % GALLERY.length]);

export const IMAGE_CREDIT = 'Photos: Wikimedia Commons contributors, CC BY-SA.';
