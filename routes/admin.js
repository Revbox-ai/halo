'use strict';
const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.adminLoggedIn) return next();
  req.session.flash = { error: 'Zaloguj się, aby uzyskać dostęp.' };
  res.redirect('/admin/login');
}

function getSettings() {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM settings').all();
  db.close();
  const s = {};
  for (const row of rows) s[row.key] = row.value;
  return s;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
    .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
    .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── LOGIN ───────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.adminLoggedIn) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin — Logowanie', flash: res.locals.flash });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.adminLoggedIn = true;
    res.redirect('/admin');
  } else {
    req.session.flash = { error: 'Błędne dane logowania.' };
    res.redirect('/admin/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ─── DASHBOARD ───────────────────────────────────────────
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const counts = {
    posts: db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c,
    publishedPosts: db.prepare('SELECT COUNT(*) as c FROM blog_posts WHERE published=1').get().c,
    realizacje: db.prepare('SELECT COUNT(*) as c FROM realizacje').get().c,
    opinie: db.prepare('SELECT COUNT(*) as c FROM opinie').get().c,
    pages: db.prepare('SELECT COUNT(*) as c FROM pages').get().c
  };
  const recentPosts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 5').all();
  db.close();
  res.render('admin/dashboard', { title: 'Dashboard — Admin Halo', counts, recentPosts, flash: res.locals.flash });
});

// ─── STRONY ──────────────────────────────────────────────
router.get('/strony', requireAuth, (req, res) => {
  const db = getDb();
  const pages = db.prepare('SELECT * FROM pages ORDER BY id ASC').all();
  db.close();
  res.render('admin/strony', { title: 'Strony — Admin', pages, flash: res.locals.flash });
});

router.get('/strony/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);
  db.close();
  if (!page) return res.redirect('/admin/strony');
  let content = {};
  try { content = JSON.parse(page.content_json || '{}'); } catch(e) {}
  res.render('admin/strona-edit', { title: 'Edytuj stronę — Admin', page, content, flash: res.locals.flash });
});

router.post('/strony/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const { title, meta_description, h1, hero_subtitle, content_json } = req.body;
  // Validate JSON
  let parsedJson = {};
  try { parsedJson = JSON.parse(content_json); } catch(e) {
    req.session.flash = { error: 'Nieprawidłowy format JSON w polu treści.' };
    db.close();
    return res.redirect(`/admin/strony/${req.params.id}/edit`);
  }
  db.prepare(`
    UPDATE pages SET title=?, meta_description=?, h1=?, hero_subtitle=?, content_json=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(title, meta_description, h1, hero_subtitle, JSON.stringify(parsedJson), req.params.id);
  db.close();
  req.session.flash = { success: 'Strona zaktualizowana.' };
  res.redirect('/admin/strony');
});

// ─── BLOG ─────────────────────────────────────────────────
router.get('/blog', requireAuth, (req, res) => {
  const db = getDb();
  const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  db.close();
  res.render('admin/blog', { title: 'Blog — Admin', posts, flash: res.locals.flash });
});

router.get('/blog/new', requireAuth, (req, res) => {
  res.render('admin/blog-edit', { title: 'Nowy wpis — Admin', post: null, flash: res.locals.flash });
});

router.get('/blog/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  db.close();
  if (!post) return res.redirect('/admin/blog');
  res.render('admin/blog-edit', { title: 'Edytuj wpis — Admin', post, flash: res.locals.flash });
});

router.post('/blog/new', requireAuth, (req, res) => {
  const db = getDb();
  const { title, meta_description, excerpt, content, published } = req.body;
  const slug = slugify(title) + '-' + Date.now();
  db.prepare(`
    INSERT INTO blog_posts (slug, title, meta_description, excerpt, content, published)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(slug, title, meta_description, excerpt, content, published ? 1 : 0);
  db.close();
  req.session.flash = { success: 'Wpis dodany.' };
  res.redirect('/admin/blog');
});

router.post('/blog/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const { title, slug, meta_description, excerpt, content, published } = req.body;
  db.prepare(`
    UPDATE blog_posts SET title=?, slug=?, meta_description=?, excerpt=?, content=?, published=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(title, slug, meta_description, excerpt, content, published ? 1 : 0, req.params.id);
  db.close();
  req.session.flash = { success: 'Wpis zaktualizowany.' };
  res.redirect('/admin/blog');
});

router.post('/blog/:id/delete', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  db.close();
  req.session.flash = { success: 'Wpis usunięty.' };
  res.redirect('/admin/blog');
});

// ─── REALIZACJE ───────────────────────────────────────────
router.get('/realizacje', requireAuth, (req, res) => {
  const db = getDb();
  const realizacje = db.prepare('SELECT * FROM realizacje ORDER BY id DESC').all();
  db.close();
  res.render('admin/realizacje', { title: 'Realizacje — Admin', realizacje, flash: res.locals.flash });
});

router.get('/realizacje/new', requireAuth, (req, res) => {
  res.render('admin/realizacja-edit', { title: 'Nowa realizacja — Admin', realizacja: null, flash: res.locals.flash });
});

router.get('/realizacje/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const realizacja = db.prepare('SELECT * FROM realizacje WHERE id = ?').get(req.params.id);
  db.close();
  if (!realizacja) return res.redirect('/admin/realizacje');
  res.render('admin/realizacja-edit', { title: 'Edytuj realizację — Admin', realizacja, flash: res.locals.flash });
});

router.post('/realizacje/new', requireAuth, (req, res) => {
  const db = getDb();
  const { title, branza, miasto, problem, dzialania, efekty, cytat, cytat_autor, published } = req.body;
  const slug = slugify(title) + '-' + Date.now();
  // dzialania and efekty come as textarea, one per line
  const dzialanieJson = JSON.stringify(dzialania.split('\n').map(s => s.trim()).filter(Boolean));
  const efektyJson = JSON.stringify(efekty.split('\n').map(s => s.trim()).filter(Boolean));
  db.prepare(`
    INSERT INTO realizacje (slug, title, branza, miasto, problem, dzialania, efekty, cytat, cytat_autor, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(slug, title, branza, miasto, problem, dzialanieJson, efektyJson, cytat, cytat_autor, published ? 1 : 0);
  db.close();
  req.session.flash = { success: 'Realizacja dodana.' };
  res.redirect('/admin/realizacje');
});

router.post('/realizacje/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const { title, slug, branza, miasto, problem, dzialania, efekty, cytat, cytat_autor, published } = req.body;
  const dzialanieJson = JSON.stringify(dzialania.split('\n').map(s => s.trim()).filter(Boolean));
  const efektyJson = JSON.stringify(efekty.split('\n').map(s => s.trim()).filter(Boolean));
  db.prepare(`
    UPDATE realizacje SET title=?, slug=?, branza=?, miasto=?, problem=?, dzialania=?, efekty=?, cytat=?, cytat_autor=?, published=?
    WHERE id=?
  `).run(title, slug, branza, miasto, problem, dzialanieJson, efektyJson, cytat, cytat_autor, published ? 1 : 0, req.params.id);
  db.close();
  req.session.flash = { success: 'Realizacja zaktualizowana.' };
  res.redirect('/admin/realizacje');
});

router.post('/realizacje/:id/delete', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM realizacje WHERE id = ?').run(req.params.id);
  db.close();
  req.session.flash = { success: 'Realizacja usunięta.' };
  res.redirect('/admin/realizacje');
});

// ─── OPINIE ───────────────────────────────────────────────
router.get('/opinie', requireAuth, (req, res) => {
  const db = getDb();
  const opinie = db.prepare('SELECT * FROM opinie ORDER BY id DESC').all();
  db.close();
  res.render('admin/opinie', { title: 'Opinie — Admin', opinie, flash: res.locals.flash });
});

router.get('/opinie/new', requireAuth, (req, res) => {
  res.render('admin/opinia-edit', { title: 'Nowa opinia — Admin', opinia: null, flash: res.locals.flash });
});

router.get('/opinie/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const opinia = db.prepare('SELECT * FROM opinie WHERE id = ?').get(req.params.id);
  db.close();
  if (!opinia) return res.redirect('/admin/opinie');
  res.render('admin/opinia-edit', { title: 'Edytuj opinię — Admin', opinia, flash: res.locals.flash });
});

router.post('/opinie/new', requireAuth, (req, res) => {
  const db = getDb();
  const { imie, firma, tresc, inicjaly, published } = req.body;
  db.prepare('INSERT INTO opinie (imie, firma, tresc, inicjaly, published) VALUES (?, ?, ?, ?, ?)')
    .run(imie, firma, tresc, inicjaly, published ? 1 : 0);
  db.close();
  req.session.flash = { success: 'Opinia dodana.' };
  res.redirect('/admin/opinie');
});

router.post('/opinie/:id/edit', requireAuth, (req, res) => {
  const db = getDb();
  const { imie, firma, tresc, inicjaly, published } = req.body;
  db.prepare('UPDATE opinie SET imie=?, firma=?, tresc=?, inicjaly=?, published=? WHERE id=?')
    .run(imie, firma, tresc, inicjaly, published ? 1 : 0, req.params.id);
  db.close();
  req.session.flash = { success: 'Opinia zaktualizowana.' };
  res.redirect('/admin/opinie');
});

router.post('/opinie/:id/delete', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM opinie WHERE id = ?').run(req.params.id);
  db.close();
  req.session.flash = { success: 'Opinia usunięta.' };
  res.redirect('/admin/opinie');
});

router.post('/opinie/:id/toggle', requireAuth, (req, res) => {
  const db = getDb();
  const o = db.prepare('SELECT published FROM opinie WHERE id = ?').get(req.params.id);
  if (o) db.prepare('UPDATE opinie SET published = ? WHERE id = ?').run(o.published ? 0 : 1, req.params.id);
  db.close();
  res.redirect('/admin/opinie');
});

// ─── USTAWIENIA ───────────────────────────────────────────
router.get('/ustawienia', requireAuth, (req, res) => {
  const settings = getSettings();
  res.render('admin/ustawienia', { title: 'Ustawienia — Admin', settings, flash: res.locals.flash });
});

router.post('/ustawienia', requireAuth, (req, res) => {
  const db = getDb();
  const keys = ['site_name', 'tagline', 'phone', 'email', 'address', 'ga4_id', 'og_image', 'facebook', 'instagram', 'linkedin'];
  const update = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const key of keys) {
    if (req.body[key] !== undefined) update.run(key, req.body[key]);
  }
  db.close();
  req.session.flash = { success: 'Ustawienia zapisane.' };
  res.redirect('/admin/ustawienia');
});

module.exports = router;
