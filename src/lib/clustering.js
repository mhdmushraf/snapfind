/**
 * Face clustering — groups every face in an event into people.
 *
 * Powers "family sets" and the auto-built couple album. Runs on descriptors
 * already stored during indexing, so it needs no new model and no new pass
 * over the images. Pure arithmetic in the browser; a 500-photo event
 * clusters in well under a second.
 *
 * The algorithm is deliberately simple — greedy agglomerative clustering
 * against running centroids. Proper hierarchical clustering would be more
 * accurate, but at wedding scale the difference is not worth the complexity
 * or the wait.
 */
import { distance, THRESHOLD } from '@/lib/faces';

/** Slightly looser than search: grouping tolerates more variation than matching. */
export const CLUSTER_THRESHOLD = 0.56;

/** Ignore people who appear in fewer than this many photos. */
export const MIN_APPEARANCES = 3;

function centroidOf(descriptors) {
  const n = descriptors[0].length;
  const c = new Array(n).fill(0);
  for (const d of descriptors) for (let i = 0; i < n; i++) c[i] += d[i];
  for (let i = 0; i < n; i++) c[i] /= descriptors.length;
  return c;
}

/**
 * Cluster all faces across an event's photos.
 * Returns groups sorted by how often the person appears.
 *
 * Each group: { id, descriptor, photo_ids, count, cover }
 */
export function clusterFaces(photos, threshold = CLUSTER_THRESHOLD) {
  const clusters = [];

  for (const p of photos) {
    if (!p.face_data) continue;
    let faces;
    try { faces = JSON.parse(p.face_data); } catch { continue; }

    for (const face of faces) {
      let best = null;
      let bestDist = Infinity;
      for (const c of clusters) {
        const d = distance(face, c.centroid);
        if (d < bestDist) { bestDist = d; best = c; }
      }

      if (best && bestDist <= threshold) {
        best.descriptors.push(face);
        best.centroid = centroidOf(best.descriptors);
        if (!best.photoIds.includes(p.id)) {
          best.photoIds.push(p.id);
          best.photos.push(p);
        }
      } else {
        clusters.push({
          centroid: face,
          descriptors: [face],
          photoIds: [p.id],
          photos: [p],
        });
      }
    }
  }

  return clusters
    .filter((c) => c.photoIds.length >= MIN_APPEARANCES)
    .sort((a, b) => b.photoIds.length - a.photoIds.length)
    .map((c, i) => ({
      id: `g${i}`,
      descriptor: c.centroid,
      photo_ids: c.photoIds,
      count: c.photoIds.length,
      // Cover = the sharpest photo this person appears in
      cover: [...c.photos].sort((x, y) => (y.quality_score || 0) - (x.quality_score || 0))[0]?.r2_key || '',
    }));
}

/**
 * Photos containing BOTH of two people — the couple album.
 * Pass the two clusters that represent the bride and groom.
 */
export function photosWithBoth(groupA, groupB) {
  const setB = new Set(groupB.photo_ids);
  return groupA.photo_ids.filter((id) => setB.has(id));
}

/**
 * Split remaining groups into two sides, based on which of the couple they
 * appear alongside more often. A rough heuristic — a guest who appears with
 * both is assigned to whichever they share more frames with.
 */
export function splitSides(groups, coupleA, coupleB) {
  const setA = new Set(coupleA.photo_ids);
  const setB = new Set(coupleB.photo_ids);
  const sideA = [];
  const sideB = [];
  const neither = [];

  for (const g of groups) {
    if (g.id === coupleA.id || g.id === coupleB.id) continue;
    let withA = 0;
    let withB = 0;
    for (const id of g.photo_ids) {
      if (setA.has(id)) withA++;
      if (setB.has(id)) withB++;
    }
    if (withA === 0 && withB === 0) neither.push(g);
    else if (withA >= withB) sideA.push(g);
    else sideB.push(g);
  }
  return { sideA, sideB, neither };
}
