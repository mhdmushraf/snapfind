/**
 * QR code generator — pure JS, no dependency.
 * Byte mode, error correction level M, automatic version selection.
 * Returns a 2D boolean matrix; the caller renders it however it likes.
 */

const EC_BLOCKS = {
  // version: [ecCodewordsPerBlock, group1Blocks, group1DataCodewords, group2Blocks, group2DataCodewords]
  1: [10, 1, 16, 0, 0], 2: [16, 1, 28, 0, 0], 3: [26, 1, 44, 0, 0],
  4: [18, 2, 32, 0, 0], 5: [24, 2, 43, 0, 0], 6: [16, 4, 27, 0, 0],
  7: [18, 4, 31, 0, 0], 8: [22, 2, 38, 2, 39], 9: [22, 3, 36, 2, 37],
  10: [26, 4, 43, 1, 44],
};

const ALIGN = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};

// Galois field tables for Reed–Solomon
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

function rsGenerator(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= mul(poly[j], 1);
      next[j + 1] ^= mul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data, ecLen) {
  const gen = rsGenerator(ecLen);
  const res = new Array(ecLen).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    for (let i = 0; i < gen.length - 1; i++) res[i] ^= mul(gen[i + 1], factor);
  }
  return res;
}

export function qrMatrix(text) {
  const bytes = Array.from(new TextEncoder().encode(text));

  // pick the smallest version that fits
  let version = 0;
  for (let v = 1; v <= 10; v++) {
    const [ec, g1, d1, g2, d2] = EC_BLOCKS[v];
    const capacity = g1 * d1 + g2 * d2;
    const lenBits = v < 10 ? 8 : 16;
    if (4 + lenBits + bytes.length * 8 <= capacity * 8) { version = v; break; }
  }
  if (!version) throw new Error('QR payload too long');

  const [ecLen, g1, d1, g2, d2] = EC_BLOCKS[version];
  const totalData = g1 * d1 + g2 * d2;

  // ---- bit stream ----
  const bits = [];
  const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
  push(0b0100, 4);                       // byte mode
  push(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((b) => push(b, 8));
  push(0, Math.min(4, totalData * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const dataCw = [];
  for (let i = 0; i < bits.length; i += 8) {
    dataCw.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  }
  const PAD = [0xec, 0x11];
  let p = 0;
  while (dataCw.length < totalData) dataCw.push(PAD[p++ % 2]);

  // ---- split into blocks, add EC ----
  const blocks = [];
  let off = 0;
  for (let i = 0; i < g1; i++) { blocks.push(dataCw.slice(off, off + d1)); off += d1; }
  for (let i = 0; i < g2; i++) { blocks.push(dataCw.slice(off, off + d2)); off += d2; }
  const ecBlocks = blocks.map((b) => rsEncode(b, ecLen));

  const interleaved = [];
  const maxData = Math.max(...blocks.map((b) => b.length));
  for (let i = 0; i < maxData; i++) blocks.forEach((b) => { if (i < b.length) interleaved.push(b[i]); });
  for (let i = 0; i < ecLen; i++) ecBlocks.forEach((b) => interleaved.push(b[i]));

  // ---- build matrix ----
  const size = version * 4 + 17;
  const m = Array.from({ length: size }, () => new Array(size).fill(null));

  const finder = (r, c) => {
    for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
      const rr = r + i, cc = c + j;
      if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
      const on = i >= 0 && i <= 6 && (j === 0 || j === 6)
        || j >= 0 && j <= 6 && (i === 0 || i === 6)
        || i >= 2 && i <= 4 && j >= 2 && j <= 4;
      m[rr][cc] = on;
    }
  };
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

  for (const r of ALIGN[version]) for (const c of ALIGN[version]) {
    if (m[r][c] !== null) continue;
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
      m[r + i][c + j] = Math.max(Math.abs(i), Math.abs(j)) !== 1;
    }
  }

  for (let i = 8; i < size - 8; i++) {
    if (m[6][i] === null) m[6][i] = i % 2 === 0;
    if (m[i][6] === null) m[i][6] = i % 2 === 0;
  }
  m[size - 8][8] = true; // dark module

  // reserve format areas
  const reserved = [];
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === null) { m[8][i] = false; reserved.push([8, i]); }
    if (m[i][8] === null) { m[i][8] = false; reserved.push([i, 8]); }
  }
  for (let i = size - 8; i < size; i++) {
    if (m[8][i] === null) { m[8][i] = false; reserved.push([8, i]); }
    if (m[i][8] === null) { m[i][8] = false; reserved.push([i, 8]); }
  }

  // ---- place data with mask 0 ----
  let bitIdx = 0;
  const nextBit = () => {
    const byte = interleaved[bitIdx >> 3];
    const bit = byte === undefined ? 0 : (byte >> (7 - (bitIdx & 7))) & 1;
    bitIdx++;
    return bit;
  };
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let k = 0; k < size; k++) {
      const row = upward ? size - 1 - k : k;
      for (const c of [col, col - 1]) {
        if (m[row][c] !== null) continue;
        let v = nextBit() === 1;
        if ((row + c) % 2 === 0) v = !v;   // mask pattern 0
        m[row][c] = v;
      }
    }
    upward = !upward;
  }

  // ---- format info (EC level M = 0b00, mask 0) ----
  let fmt = 0b00000;
  let rem = fmt;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >> 9) * 0x537);
  const format = ((fmt << 10) | rem) ^ 0x5412;
  for (let i = 0; i <= 5; i++) m[8][i] = ((format >> i) & 1) === 1;
  m[8][7] = ((format >> 6) & 1) === 1;
  m[8][8] = ((format >> 7) & 1) === 1;
  m[7][8] = ((format >> 8) & 1) === 1;
  for (let i = 9; i < 15; i++) m[14 - i][8] = ((format >> i) & 1) === 1;
  for (let i = 0; i < 8; i++) m[size - 1 - i][8] = ((format >> i) & 1) === 1;
  for (let i = 8; i < 15; i++) m[8][size - 15 + i] = ((format >> i) & 1) === 1;

  return m.map((row) => row.map((v) => v === true));
}

/** Render a QR matrix as an SVG string. */
export function qrSvg(text, { size = 240, margin = 4, dark = '#0f1a1a', light = '#ffffff' } = {}) {
  const m = qrMatrix(text);
  const n = m.length;
  const total = n + margin * 2;
  const cell = size / total;
  let path = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (m[r][c]) {
      path += `M${((c + margin) * cell).toFixed(2)} ${((r + margin) * cell).toFixed(2)}h${cell.toFixed(2)}v${cell.toFixed(2)}h-${cell.toFixed(2)}z`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${light}"/><path d="${path}" fill="${dark}"/></svg>`;
}
