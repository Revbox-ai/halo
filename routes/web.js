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

// ─── USŁUGI (service pages) ──────────────────────────────
router.get('/uslugi/:slug', (req, res, next) => {
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

module.exports = router;
