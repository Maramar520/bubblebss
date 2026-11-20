function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  });
  return { meta, body: match[2] };
}

async function loadManifest(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Gagal memuat manifest: ' + path);
  return res.json();
}

async function loadArticleSource(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Artikel tidak ditemukan: ' + path);
  return res.text();
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
