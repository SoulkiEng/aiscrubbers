const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Pure Node.js PNG generator (RGB type 2 - zero alpha channel issues on Chrome Web Store!)
function createPngBuffer(width, height, pixelGenerator) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let c = -1;
    for (let i = 0; i < buf.length; i++) {
      let b = (c ^ buf[i]) & 0xff;
      for (let k = 0; k < 8; k++) {
        b = b & 1 ? 0xedb88320 ^ (b >>> 1) : b >>> 1;
      }
      c = (c >>> 8) ^ b;
    }
    return (c ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 2; // RGB color type (no alpha)
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = width * 3 + 1;
  const raw = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixelGenerator(x, y, width, height);
      const idx = rowStart + 1 + x * 3;
      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
    }
  }

  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = Math.abs(x - cx) / (w / 2);
  const dy = Math.abs(y - cy) / (h / 2);
  // Rounded Indigo-Violet gradient background with white shield center
  if (dx < 0.55 && dy < 0.55 && dx + dy < 0.85) {
    return [255, 255, 255];
  }
  const t = (x + y) / (w + h);
  const r = Math.round(79 * (1 - t) + 124 * t);
  const g = Math.round(70 * (1 - t) + 58 * t);
  const b = Math.round(229 * (1 - t) + 237 * t);
  return [r, g, b];
}

function drawBanner(x, y, w, h) {
  // Modern dark slate hero top + light workspace card center
  if (y < h * 0.28) {
    return [15, 23, 42]; // Slate-950 header
  }
  if (x > w * 0.12 && x < w * 0.88 && y > h * 0.22 && y < h * 0.88) {
    // Card border & accent bar
    if (y < h * 0.29) {
      return [79, 70, 229]; // Brand Indigo top bar
    }
    return [255, 255, 255]; // Clean white workspace card
  }
  return [241, 245, 249]; // Slate-100 background
}

const ROOT = path.resolve(__dirname, '..');
const extIconsDir = path.join(ROOT, 'chrome_extension', 'icons');
const storeAssetsDir = path.join(ROOT, 'chrome_store_assets');

fs.mkdirSync(extIconsDir, { recursive: true });
fs.mkdirSync(storeAssetsDir, { recursive: true });

fs.writeFileSync(path.join(extIconsDir, 'icon-16.png'), createPngBuffer(16, 16, drawIcon));
fs.writeFileSync(path.join(extIconsDir, 'icon-48.png'), createPngBuffer(48, 48, drawIcon));
fs.writeFileSync(path.join(extIconsDir, 'icon-128.png'), createPngBuffer(128, 128, drawIcon));

fs.writeFileSync(path.join(storeAssetsDir, 'store-icon-128x128.png'), createPngBuffer(128, 128, drawIcon));
fs.writeFileSync(path.join(storeAssetsDir, 'screenshot-1280x800.png'), createPngBuffer(1280, 800, drawBanner));
fs.writeFileSync(path.join(storeAssetsDir, 'small-promo-440x280.png'), createPngBuffer(440, 280, drawBanner));

console.log('✅ Generated extension icons and Chrome Web Store promotional PNG assets!');
