/**
 * Site imagery — Wikimedia Commons (Creative Commons / public domain).
 * Served via the stable Special:FilePath redirect. Replace with the studio's
 * own licensed photos before launch; keep the credit line in the footer until then.
 */
const wm = (file, w = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;

export const IMG = {
  hero:        wm('A Hindu bride in Sari being led to mandapa wedding.jpg'),
  garland:     wm('R&A (22).jpg'),
  baraat:      wm('Dancing in Baarat.jpg'),
  keralaBoys:  wm('Kerala boys walking for marriage ceremony.jpg'),
  groomRites:  wm('Hindu rituals groom wedding rites of passage.jpg'),
  muhurtam:    wm('Hindu Marriage muhurtam (YS).jpg'),
  jewelry:     wm('Jewelry for Indian Wedding.jpg'),
  entrance:    wm('Wedding Traditional Entrance Decoration.jpg', 1200),
  decoration:  wm('Decoration of a marriage ceremony in Badagam.jpg'),
};

export const GALLERY = [
  { src: IMG.hero,       alt: 'Bride being led to the mandapam' },
  { src: IMG.garland,    alt: 'Bride and groom exchanging garlands at a Tamil wedding' },
  { src: IMG.muhurtam,   alt: 'Muhurtam ceremony with family gathered' },
  { src: IMG.jewelry,    alt: 'Bridal jewellery detail' },
  { src: IMG.groomRites, alt: 'Groom during wedding rites' },
  { src: IMG.keralaBoys, alt: 'Kerala wedding party walking to the ceremony' },
];

export const IMAGE_CREDIT = 'Photos: Wikimedia Commons contributors, CC BY-SA.';
