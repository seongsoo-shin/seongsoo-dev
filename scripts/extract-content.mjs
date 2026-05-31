// Deterministic extractor: reads the original static portfolio-site HTML,
// pulls per-page <head> meta + <main> inner HTML, rewrites internal links and
// asset paths to clean Next routes, and emits src/data/content.json.
// This guarantees zero copy drift — every word comes straight from the source.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../../portfolio-site');
const OUT = path.resolve(__dirname, '../src/data/content.json');

function read(p) {
  return fs.readFileSync(path.join(SRC, p), 'utf8');
}

function pick(re, html) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

// Extract <head> meta we care about (per-page SEO/OG). URL fields get the
// same .html -> clean-route rewrite so canonical/og:url match the new routes.
function rewriteUrl(u) {
  if (!u) return u;
  return u
    .replace(/\/projects\/([a-z0-9-]+)\.html/g, '/projects/$1/')
    .replace(/\/index\.html$/, '/')
    .replace(/\/career\.html$/, '/career/')
    .replace(/\/projects\.html$/, '/projects/')
    .replace(/\/contact\.html$/, '/contact/');
}

function extractMeta(html) {
  return {
    title: pick(/<title>([\s\S]*?)<\/title>/, html),
    description: pick(/<meta name="description" content="([\s\S]*?)"\s*\/?>/, html),
    canonical: rewriteUrl(pick(/<link rel="canonical" href="([\s\S]*?)"\s*\/?>/, html)),
    ogTitle: pick(/<meta property="og:title" content="([\s\S]*?)"\s*\/?>/, html),
    ogDescription: pick(/<meta property="og:description" content="([\s\S]*?)"\s*\/?>/, html),
    ogUrl: rewriteUrl(pick(/<meta property="og:url" content="([\s\S]*?)"\s*\/?>/, html)),
    ogImage: pick(/<meta property="og:image" content="([\s\S]*?)"\s*\/?>/, html),
  };
}

// Pull inner HTML of <main id="main">...</main>
function extractMain(html) {
  const m = html.match(/<main id="main">([\s\S]*?)<\/main>/);
  if (!m) throw new Error('no <main> found');
  return m[1];
}

// Rewrite asset paths and internal links to clean Next routes.
function rewrite(htmlFragment) {
  let s = htmlFragment;
  // assets: ../assets/  and  assets/  -> /assets/
  s = s.replace(/\.\.\/assets\//g, '/assets/');
  s = s.replace(/(src|href)="assets\//g, '$1="/assets/');
  // project detail links: projects/SLUG.html -> /projects/SLUG/
  s = s.replace(/(?:\.\.\/)?projects\/([a-z0-9-]+)\.html/g, '/projects/$1/');
  // top-level pages (both ../foo.html and foo.html forms)
  s = s.replace(/(?:\.\.\/)?index\.html/g, '/');
  s = s.replace(/(?:\.\.\/)?career\.html/g, '/career/');
  s = s.replace(/(?:\.\.\/)?projects\.html/g, '/projects/');
  s = s.replace(/(?:\.\.\/)?contact\.html/g, '/contact/');
  // remaining sibling SLUG.html (proj-nav inside a project page) -> /projects/SLUG/
  s = s.replace(/href="([a-z0-9-]+)\.html"/g, 'href="/projects/$1/"');
  return s;
}

function buildPage(file) {
  const html = read(file);
  return { meta: extractMeta(html), main: rewrite(extractMain(html)) };
}

// Discover project slugs from the projects/ dir
const projectDir = path.join(SRC, 'projects');
const slugs = fs
  .readdirSync(projectDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  .sort();

const data = {
  index: buildPage('index.html'),
  career: buildPage('career.html'),
  projects: buildPage('projects.html'),
  contact: buildPage('contact.html'),
  projectDetails: {},
};

for (const slug of slugs) {
  data.projectDetails[slug] = buildPage(path.join('projects', `${slug}.html`));
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data, null, 2));

console.log(`Extracted: index, career, projects, contact + ${slugs.length} project pages`);
console.log('Slugs:', slugs.join(', '));
console.log(`Wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
