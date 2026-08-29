# School gallery photos

## Folder structure

Create one folder per event inside `images/gallery/`:

```
images/gallery/
  CrossCountry/
    photo1.jpg
    photo2.jpg
  Prize/
    ...
```

## Display names and order

Folder names are used internally, but the site can show friendly titles via `gallery-meta.json`:

```json
{
  "displayNames": {
    "Prize": "Prize Giving Day 2026"
  },
  "order": ["Prize"]
}
```

Events listed in `order` appear first on the banner and filters.

## Photos only — no videos in GitHub

- Put **photos only** in `images/gallery/<Event>/`
- Upload **videos to YouTube** — do not commit `.mp4`, `.mov`, etc.
- A local `Prize/` folder at the repo root (if present) is for your own staging and is gitignored

## After adding photos

Run this from the project root to refresh `gallery.json`:

```bash
node scripts/generate-gallery.js
```

If the display name was customized in `gallery-meta.json`, it is preserved automatically.

Pushing new photos under `images/gallery/` will auto-update `gallery.json` via GitHub Actions.

You do **not** need to rename individual image files.

## Git workflow

Work on feature branches with the `cursor/` prefix:

```bash
git checkout -b cursor/short-description
# make changes, then:
git add <specific files>
git commit -m "Brief message"
git push -u origin cursor/short-description
```

Live site: https://brsssonline.github.io/brsss/
