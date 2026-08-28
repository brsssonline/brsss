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
const OUT = path.join(ROOT, 'gallery.json');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function isImage(filename) {
  return IMAGE_EXTS.has(path.extname(filename).toLowerCase());
}

if (!fs.existsSync(GALLERY_ROOT)) {
  console.error('Missing folder:', GALLERY_ROOT);
  process.exit(1);
}

const events = fs
  .readdirSync(GALLERY_ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((dir) => {
    const folder = path.join(GALLERY_ROOT, dir.name);
    const photos = fs
      .readdirSync(folder)
      .filter(isImage)
      .sort()
      .map((file) => `images/gallery/${dir.name}/${file}`);

    return photos.length ? { name: dir.name, photos } : null;
  })
  .filter(Boolean);

fs.writeFileSync(OUT, JSON.stringify({ events }, null, 2) + '\n');
console.log(`Wrote ${OUT} (${events.length} event(s), ${events.reduce((n, e) => n + e.photos.length, 0)} photo(s))`);
