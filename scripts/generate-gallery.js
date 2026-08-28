#!/usr/bin/env node
/**
 * Scans images/gallery/<Event Name>/ and writes gallery.json.
 * Folder name = event name shown on the site.
 *
 * Usage: node scripts/generate-gallery.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GALLERY_ROOT = path.join(ROOT, 'images', 'gallery');
const META_FILE = path.join(GALLERY_ROOT, 'gallery-meta.json');
const OUT = path.join(ROOT, 'gallery.json');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function isImage(filename) {
  return IMAGE_EXTS.has(path.extname(filename).toLowerCase());
}

function loadMeta() {
  if (!fs.existsSync(META_FILE)) {
    return { displayNames: {}, order: [] };
  }

  const meta = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
  return {
    displayNames: meta.displayNames || {},
    order: Array.isArray(meta.order) ? meta.order : [],
  };
}

function sortEventDirs(dirs, order) {
  const rank = new Map(order.map((name, index) => [name, index]));

  return dirs.slice().sort((a, b) => {
    const aRank = rank.has(a.name) ? rank.get(a.name) : Number.MAX_SAFE_INTEGER;
    const bRank = rank.has(b.name) ? rank.get(b.name) : Number.MAX_SAFE_INTEGER;

    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name);
  });
}

if (!fs.existsSync(GALLERY_ROOT)) {
  console.error('Missing folder:', GALLERY_ROOT);
  process.exit(1);
}

const meta = loadMeta();

const events = sortEventDirs(
  fs.readdirSync(GALLERY_ROOT, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('.')),
  meta.order
)
  .map((dir) => {
    const folder = path.join(GALLERY_ROOT, dir.name);
    const photos = fs
      .readdirSync(folder)
      .filter(isImage)
      .sort()
      .map((file) => `images/gallery/${dir.name}/${file}`);

    if (!photos.length) return null;

    return {
      name: meta.displayNames[dir.name] || dir.name,
      photos,
    };
  })
  .filter(Boolean);

fs.writeFileSync(OUT, JSON.stringify({ events }, null, 2) + '\n');
console.log(`Wrote ${OUT} (${events.length} event(s), ${events.reduce((n, e) => n + e.photos.length, 0)} photo(s))`);
