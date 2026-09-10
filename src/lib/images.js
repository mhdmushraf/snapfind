/**
 * Site imagery — Wikimedia Commons (Creative Commons / public domain).
 * Deliberately spans Hindu, Muslim and regional Indian wedding traditions:
 * Snapfind serves every community, and the site should look like it.
 * Replace with studios' own licensed photos as they come in; keep the
 * credit line in the footer until then.
 */
const wm = (file, w = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;

export const IMG = {
  // Muslim / Nikah
  nikah:        wm('An Islamic wedding for a new Bride and groom.jpg'),
  walima:       wm('Ishtiaq and Mashqura Reception (14791734476).jpg'),
  imamZamin:    wm('Band, known as Imam Zamin.jpg'),
  // Hindu
  hero:         wm('A Hindu bride in Sari being led to mandapa wedding.jpg'),
  garland:      wm('R&A (22).jpg'),
  jaymal:       wm('DSC 6070 Indian cultural wedding JAYMAL ceremony new married couple happiness.jpg'),
  muhurtam:     wm('Hindu Marriage muhurtam (YS).jpg'),
  groomRites:   wm('Hindu rituals groom wedding rites of passage.jpg'),
  // Kerala / regional / celebration
  keralaBoys:   wm('Kerala boys walking for marriage ceremony.jpg'),
  familyDance:  wm("Groom's family dancing at wedding ceremony.jpg"),
  baraat:       wm('Dancing in Baarat.jpg'),
  jewelry:      wm('Jewelry for Indian Wedding.jpg'),
  entrance:     wm('Wedding Traditional Entrance Decoration.jpg', 1200),
  decoration:   wm('Decoration of a marriage ceremony in Badagam.jpg'),
};

/** Mixed-tradition set — used wherever a grid or strip of faces is shown. */
export const GALLERY = [
  { src: IMG.nikah,       alt: 'Bride and groom at a Nikah ceremony' },
  { src: IMG.hero,        alt: 'Hindu bride being led to the mandapam' },
  { src: IMG.walima,      alt: 'Guests at a Muslim wedding reception' },
  { src: IMG.garland,     alt: 'Garland exchange at a South Indian wedding' },
  { src: IMG.keralaBoys,  alt: 'Kerala wedding party walking to the ceremony' },
  { src: IMG.familyDance, alt: "Groom's family dancing at the wedding" },
  { src: IMG.muhurtam,    alt: 'Muhurtam ceremony with family gathered' },
  { src: IMG.imamZamin,   alt: 'Imam Zamin ritual at a Muslim wedding' },
];

export const IMAGE_CREDIT = 'Photos: Wikimedia Commons contributors, CC BY-SA.';
