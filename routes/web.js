'use strict';
const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

// Helper to get settings as object
function getSettings() {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM settings').all();
  db.close();
  const s = {};
  for (const row of rows) s[row.key] = row.value;
  return s;
}

// ─── HOME ───────────────────────────────────────────────
router.get('/', (req, res) => {
  const db = getDb();
  const settings = getSettings();
  const opinie = db.prepare('SELECT * FROM opinie WHERE published = 1 ORDER BY id DESC LIMIT 6').all();
  const realizacje = db.prepare('SELECT * FROM realizacje WHERE published = 1 ORDER BY id DESC LIMIT 3').all();
  db.close();
  res.render('index', { title: settings.site_name + ' — ' + settings.tagline, settings, opinie, realizacje });
});

// ─── O MNIE ─────────────────────────────────────────────
router.get('/o-mnie', (req, res) => {
  const settings = getSettings();
  res.render('o-mnie', { title: 'O mnie — Kamil | Halo', settings });
});

// ─── KONTAKT ────────────────────────────────────────────
router.get('/kontakt', (req, res) => {
  const settings = getSettings();
  res.render('kontakt', { title: 'Kontakt — Halo Tarnobrzeg', settings, success: false });
});

router.post('/kontakt', (req, res) => {
  const settings = getSettings();
  // Just show success - no email sending
  res.render('kontakt', { title: 'Kontakt — Halo Tarnobrzeg', settings, success: true });
});

// ─── REALIZACJE ──────────────────────────────────────────
router.get('/realizacje', (req, res) => {
  const db = getDb();
  const settings = getSettings();
  const realizacje = db.prepare('SELECT * FROM realizacje WHERE published = 1 ORDER BY id DESC').all();
  db.close();
  res.render('realizacje', { title: 'Realizacje — Halo Tarnobrzeg', settings, realizacje });
});

router.get('/realizacje/:slug', (req, res) => {
  const db = getDb();
  const settings = getSettings();
  const realizacja = db.prepare('SELECT * FROM realizacje WHERE slug = ? AND published = 1').get(req.params.slug);
  if (!realizacja) { db.close(); return res.status(404).render('404', { title: '404', settings }); }
  // Parse JSON fields
  realizacja.dzialanieArr = JSON.parse(realizacja.dzialania || '[]');
  realizacja.efektyArr = JSON.parse(realizacja.efekty || '[]');
  const inne = db.prepare('SELECT * FROM realizacje WHERE published = 1 AND id != ? LIMIT 3').all(realizacja.id);
  db.close();
  res.render('realizacja', { title: realizacja.title + ' — Halo', settings, realizacja, inne });
});

// ─── BLOG ───────────────────────────────────────────────
router.get('/blog', (req, res) => {
  const db = getDb();
  const settings = getSettings();
  const posts = db.prepare('SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC').all();
  db.close();
  res.render('blog', { title: 'Blog — Halo Tarnobrzeg', settings, posts });
});

router.get('/blog/:slug', (req, res) => {
  const db = getDb();
  const settings = getSettings();
  const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ? AND published = 1').get(req.params.slug);
  if (!post) { db.close(); return res.status(404).render('404', { title: '404', settings }); }
  const related = db.prepare('SELECT * FROM blog_posts WHERE published = 1 AND id != ? ORDER BY RANDOM() LIMIT 2').all(post.id);
  db.close();
  res.render('blog-post', { title: post.title + ' — Blog Halo', settings, post, related });
});

// ─── MAPA STRONY ─────────────────────────────────────────
router.get('/mapa-strony', (req, res) => {
  const settings = getSettings();
  res.render('mapa-strony', { title: 'Mapa strony — Halo', settings });
});

// ─── LOKALIZACJE ─────────────────────────────────────────
router.get('/lokalizacje', (req, res) => {
  const db = getDb();
  const settings = getSettings();
  const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get('lokalizacje');
  db.close();
  if (!page) return res.render('lokalizacje', { title: 'Obsługiwane lokalizacje — Halo', settings });
  let content = {};
  try { content = JSON.parse(page.content_json || '{}'); } catch(e) {}
  res.render('lokalizacje', { title: page.title, settings, page, content });
});

// ─── USŁUGI (service pages) — 301 redirect na kanoniczne /:miasto/:usluga ───
const USLUGI_REDIRECTS = {
  'strony-internetowe-tarnobrzeg': '/tarnobrzeg/strony-internetowe',
  'seo-tarnobrzeg': '/tarnobrzeg/seo',
  'google-ads-tarnobrzeg': '/tarnobrzeg/google-ads',
  'grafika-reklamowa-tarnobrzeg': '/tarnobrzeg/grafika-reklamowa',
  'automatyzacje-firmy-tarnobrzeg': '/tarnobrzeg/automatyzacje',
  'marketing-internetowy-tarnobrzeg': '/tarnobrzeg/marketing-internetowy',
  'social-media-tarnobrzeg': '/tarnobrzeg/social-media',
  'content-marketing-tarnobrzeg': '/tarnobrzeg/content-marketing',
  'analityka-doradztwo-tarnobrzeg': '/tarnobrzeg/analityka-doradztwo',
};

router.get('/uslugi/:slug', (req, res, next) => {
  const canonical = USLUGI_REDIRECTS[req.params.slug];
  if (canonical) return res.redirect(301, canonical);

  const db = getDb();
  const settings = getSettings();
  const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
  if (!page) { db.close(); return next(); }

  let content = {};
  try { content = JSON.parse(page.content_json || '{}'); } catch(e) {}

  // Get related case studies (match by branza or just latest)
  const realizacje = db.prepare('SELECT * FROM realizacje WHERE published = 1 ORDER BY id DESC LIMIT 3').all();

  // Get related service pages
  const relatedSlugs = content.powiazane_uslugi || [];
  let relatedPages = [];
  if (relatedSlugs.length > 0) {
    const placeholders = relatedSlugs.map(() => '?').join(',');
    relatedPages = db.prepare(`SELECT * FROM pages WHERE slug IN (${placeholders})`).all(...relatedSlugs);
  }

  db.close();
  res.render('usluga', {
    title: page.title + ' — Halo',
    settings,
    page,
    content,
    realizacje,
    relatedPages
  });
});

// ─── PODSTRONY POZIOMU 3 /miasto/usluga/podstrona ────────
router.get('/:miasto/:usluga/:podstrona', (req, res, next) => {
  const db = getDb();
  const settings = getSettings();
  const slug = `${req.params.miasto}/${req.params.usluga}/${req.params.podstrona}`;
  const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
  if (!page) { db.close(); return next(); }

  let content = {};
  try { content = JSON.parse(page.content_json || '{}'); } catch(e) {}

  // Get parent category page for breadcrumb / related links
  const parentSlug = `${req.params.miasto}/${req.params.usluga}`;
  const parentPage = db.prepare('SELECT * FROM pages WHERE slug = ?').get(parentSlug);

  // Get sibling subpages (same parent category)
  const siblings = db.prepare("SELECT slug, title FROM pages WHERE slug LIKE ? AND slug != ? ORDER BY slug").all(`${parentSlug}/%`, slug);

  db.close();
  res.render('usluga-sub', {
    title: page.title + ' — Halo',
    settings, page, content, parentPage, siblings,
    miasto: req.params.miasto,
    usluga: req.params.usluga,
    podstrona: req.params.podstrona
  });
});

// ─── STRONY LOKALIZACYJNE /miasto/usluga ─────────────────
router.get('/:miasto/:usluga', (req, res, next) => {
  const db = getDb();
  const settings = getSettings();
  const slug = `${req.params.miasto}/${req.params.usluga}`;
  const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
  if (!page) { db.close(); return next(); }

  let content = {};
  try { content = JSON.parse(page.content_json || '{}'); } catch(e) {}

  const realizacje = db.prepare('SELECT * FROM realizacje WHERE published = 1 ORDER BY id DESC LIMIT 3').all();
  const relatedSlugs = content.powiazane_uslugi || [];
  let relatedPages = [];
  if (relatedSlugs.length > 0) {
    const placeholders = relatedSlugs.map(() => '?').join(',');
    relatedPages = db.prepare(`SELECT * FROM pages WHERE slug IN (${placeholders})`).all(...relatedSlugs);
  }

  db.close();
  res.render('usluga', { title: page.title + ' — Halo', settings, page, content, realizacje, relatedPages });
});

// ─── CONTACT FORM (AJAX / from service pages) ───────────
router.post('/kontakt-form', (req, res) => {
  res.json({ success: true, message: 'Dziękujemy! Odezwiemy się w ciągu 24 godzin.' });
});

// ─── STRONY MIAST /miasto ──────────────────────────────────
const KNOWN_CITIES = ['tarnobrzeg', 'stalowa-wola', 'sandomierz', 'mielec', 'rzeszow', 'nowa-deba'];
router.get('/:miasto', (req, res, next) => {
  if (!KNOWN_CITIES.includes(req.params.miasto)) return next();
  const db = getDb();
  const settings = getSettings();
  const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.miasto);
  if (!page) { db.close(); return next(); }

  let content = {};
  try { content = JSON.parse(page.content_json || '{}'); } catch(e) {}

  // Get all category pages for this city
  const categoryPages = db.prepare("SELECT slug, title, h1, hero_subtitle FROM pages WHERE slug LIKE ? AND slug NOT LIKE ?")
    .all(`${req.params.miasto}/%`, `${req.params.miasto}/%/%`);

  db.close();
  res.render('miasto', {
    title: page.title,
    settings, page, content, categoryPages,
    miasto: req.params.miasto
  });
});

module.exports = router;
