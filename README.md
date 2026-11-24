# Bubblebss

Static site with one build step (regenerates manifests from Markdown). Structure:

```
index.html             homepage, renders every section below from its manifest.json
style.css              shared styles
data/settings.json      site-wide settings (hero text, WhatsApp, email, socials)
berita/                 list + detail (artikel.html?slug=...), content in berita/content/*.md
tutorial/               same pattern as berita/
game/                   list, content in game/content/*.md
worksheet/              list, content in worksheet/content/*.md
ai-agent/               list (pricing cards), content in ai-agent/content/*.md
website/                list (pricing cards), content in website/content/*.md
portofolio/             list (project cards), content in portofolio/content/*.md
assets/articles.js      shared markdown/manifest loader (used by every section above)
assets/settings.js      injects data/settings.json into [data-settings] / [data-settings-href] elements on every page
assets/uploads/         images uploaded via the admin dashboard land here
assets/logo-bl.png, logo-bl-white.png   the BL logo mark (dark/light), used in every header/footer
scripts/build-manifests.js   reads every section's content/*.md frontmatter, writes its manifest.json
admin/                  Decap CMS dashboard (config.yml + index.html)
```

## Add content by hand

1. Drop a `.md` file into `<section>/content/` with frontmatter matching the other files in that folder (title, order, image, plus section-specific fields — category/date for berita, level/duration for tutorial, chip/status/cta_label/link for game, price/link for worksheet, excerpt/price/cta_label/style for ai-agent and website, tags/tools/link for portofolio). For `ai-agent` and `website`, the markdown **body** is the feature checklist — one feature per line.
2. Run `node scripts/build-manifests.js` to regenerate that section's `manifest.json` (Netlify/Vercel also run this automatically on every deploy — see `netlify.toml` / `vercel.json`).

If `excerpt` is left blank, the build script fills it in from the markdown's first paragraph.

## Site settings

`data/settings.json` holds the hero badge/title/description plus the WhatsApp number, email, and Instagram/TikTok links used across the whole site. Edit it directly, or through the "Pengaturan Situs" collection in `/admin/`. `assets/settings.js` fetches it on every page load and fills in any element with a `data-settings="<key>"` (text) or `data-settings-href="<key>"` (link) attribute.

## Dashboard konten (admin)

`/admin/` is a [Decap CMS](https://decapcms.org) dashboard — login, fill a form, upload an image — for Berita, Tutorial, Game, Worksheet, AI Agent, Website, Portofolio, and the site Settings singleton. It writes straight to the files above through Git (`backend: github`, using Netlify as the OAuth proxy — **not** Netlify Identity, which is deprecated for new sites), so **it only works once the site is deployed on Netlify**.

One-time setup:

1. Push this project to a GitHub repo.
2. Netlify dashboard → "Add new site" → import that repo (build command and publish dir are already set in `netlify.toml`).
3. Site configuration → **Security** → **OAuth** → **Install provider** → GitHub. Create a GitHub OAuth App with the callback URL Netlify shows you, paste its Client ID/Secret back into Netlify.
4. Open `https://<your-site>.netlify.app/admin/` and log in with GitHub.

After that, saving an entry in `/admin/` commits a file to the repo, Netlify rebuilds (running `build-manifests.js`), and the new content shows up on the live site a few seconds later.

## Placeholders

Search for `[HARGA]`, `[NOMOR]`, `[TANGGAL]`, `[DURASI]`, `[JUMLAH]`, `[NAMA PROJECT]`, `[HASIL]`, `[EMAIL]`, `[INSTAGRAM]`, `[TIKTOK]` across the project and replace with real values before going live.

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
