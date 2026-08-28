# School gallery photos

## Folder structure

Create one folder per event inside `images/gallery/`:

```
images/gallery/
  Cross Country/
    photo1.jpg
    photo2.jpg
  Prize Giving/
    ...
```

The **folder name** is the event name shown on the website banner and gallery.

## After adding photos

Run this from the project root to refresh `gallery.json`:

```bash
node scripts/generate-gallery.js
```

If you use GitHub, pushing new photos under `images/gallery/` will auto-update `gallery.json` via GitHub Actions (once the workflow is enabled on the repo).

You do **not** need to rename individual image files.
