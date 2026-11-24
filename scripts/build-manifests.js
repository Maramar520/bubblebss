const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SECTIONS = ['berita', 'tutorial', 'game', 'worksheet', 'ai-agent', 'website', 'portofolio'];
const INCLUDE_BODY = ['ai-agent', 'website'];

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

function firstParagraph(body) {
  const block = body.trim().split(/\r?\n\r?\n/)[0] || '';
  return block.replace(/^#+\s*/, '').trim();
}

SECTIONS.forEach(section => {
  const contentDir = path.join(ROOT, section, 'content');
  if (!fs.existsSync(contentDir)) return;

  const entries = fs.readdirSync(contentDir)
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const slug = name.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(contentDir, name), 'utf8');
      const { meta, body } = parseFrontmatter(raw);
      if (!meta.excerpt) meta.excerpt = firstParagraph(body);
      const extra = INCLUDE_BODY.includes(section) ? { features: body.trim().split(/\r?\n/).filter(Boolean) } : {};
      return { slug, file: `content/${name}`, ...meta, ...extra };
    })
    .sort((a, b) => {
      const orderA = Number(a.order) || 999;
      const orderB = Number(b.order) || 999;
      return orderA - orderB;
    });

  const manifestPath = path.join(ROOT, section, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(entries, null, 2) + '\n');
  console.log(`wrote ${entries.length} entries to ${section}/manifest.json`);
});
