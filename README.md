# Bubblebss

Static site with one build step (regenerates manifests from Markdown). Structure:

```
index.html             homepage
style.css              shared styles
berita/                list + detail (artikel.html?slug=...), content in berita/content/*.md, listed in berita/manifest.json
tutorial/              same pattern as berita/
game/                  list, content in game/content/*.md
worksheet/             list, content in worksheet/content/*.md
assets/articles.js     shared markdown/manifest loader (used by all 4 sections)
assets/uploads/        images uploaded via the admin dashboard land here
scripts/build-manifests.js   reads every section's content/*.md frontmatter, writes its manifest.json
admin/                 Decap CMS dashboard (config.yml + index.html)
```

## Add content by hand

1. Drop a `.md` file into `<section>/content/` with frontmatter matching the other files in that folder (title, order, image, plus section-specific fields — category/date for berita, level/duration for tutorial, chip/status/cta_label for game, price for worksheet).
2. Run `node scripts/build-manifests.js` to regenerate that section's `manifest.json` (Netlify/Vercel also run this automatically on every deploy — see `netlify.toml` / `vercel.json`).

If `excerpt` is left blank, the build script fills it in from the markdown's first paragraph.

## Dashboard konten (admin)

`/admin/` is a [Decap CMS](https://decapcms.org) dashboard — login, fill a form, upload an image — for Berita, Tutorial, Game Edukasi, Worksheet, and Project. It writes straight to the `.md` files above through Git, so **it only works once the site is deployed on Netlify** (it uses Netlify Identity + Git Gateway; Vercel/manual hosting can't run it — host the public site anywhere, but keep a Netlify deploy around just for `/admin/`, or just deploy everything on Netlify).

One-time setup:

1. Push this project to a GitHub repo.
2. Netlify dashboard → "Add new site" → import that repo (build command and publish dir are already set in `netlify.toml`).
3. Site settings → Identity → **Enable Identity**. Under Registration, set "Invite only".
4. Identity → Services → **Enable Git Gateway**.
5. Identity → Invite users → invite yourself (your own email).
6. Open the invite email, set a password, then go to `https://<your-site>.netlify.app/admin/` and log in.

After that, saving an entry in `/admin/` commits a `.md` file to the repo, Netlify rebuilds (running `build-manifests.js`), and the new content shows up on the live site a few seconds later.

## Placeholders

Search for `[HARGA]`, `[NOMOR]`, `[TANGGAL]`, `[DURASI]` across the project and replace with real values before going live.

## Deploy — Netlify

```bash
npx netlify-cli deploy --prod --dir .
```

Or: Netlify dashboard → "Add new site" → import from Git (recommended, needed for the admin dashboard above). Build command `node scripts/build-manifests.js`, publish directory `.` — both already set in `netlify.toml`.

## Deploy — Vercel

```bash
npx vercel --prod
```

Or: Vercel dashboard → "Add New Project" → import this folder. Build command and output directory are set in `vercel.json`. Note: `/admin/` (the CMS) won't work on Vercel — see the dashboard section above.
