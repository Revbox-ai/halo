'use strict';
const { getDb } = require('./init');
const db = getDb();

const rows = db.prepare("SELECT slug, content_json FROM pages WHERE slug LIKE 'tarnobrzeg/%'").all();
const stmt = db.prepare('UPDATE pages SET content_json=? WHERE slug=?');
let fixed = 0;

for (const r of rows) {
  const c = JSON.parse(r.content_json || '{}');
  const orig = JSON.stringify(c);
  const isSubPage = r.slug.split('/').length === 3;

  // ── h2_wstep ──────────────────────────────────────────────────────────────
  // Sub-strony: "[usługa] dla firm z Tarnobrzega — jak to robimy w Tarnobrzegu?"
  // → "[usługa] w Tarnobrzegu — jak to robimy?"
  if (isSubPage && c.h2_wstep) {
    c.h2_wstep = c.h2_wstep
      .replace(/ dla firm z Tarnobrzega — jak to robimy w Tarnobrzegu\??/gi,
               ' w Tarnobrzegu — jak to robimy?')
      .replace(/ dla firm z Tarnobrzega — /gi, ' w Tarnobrzegu — ');
  }

  // ── h2_opis ───────────────────────────────────────────────────────────────
  // "Na czym polega [X] dla firm z Tarnobrzega w Tarnobrzegu?"
  // → "Na czym polega [X] w Tarnobrzegu?"
  if (c.h2_opis) {
    c.h2_opis = c.h2_opis
      .replace(/ dla firm z Tarnobrzega w Tarnobrzegu/gi, ' w Tarnobrzegu');

    // Naprawa odmiany czasownika: "polega [rzeczowniki w l.mn.]" → "polegają"
    // Wyrazy w liczbie mnogiej: formularze, kreacje, lokalne słowa, landing pages,
    // bannery, szablony, ulotki, wizytówki, prezentacje, automatyzacje, integracje,
    // raporty, artykuły, newslettery, testy, reklamy, opisy, ebooki, kampanie
    const pluralTriggers = [
      'formularze','kreacje','lokalne słowa','landing pages','bannery',
      'szablony','ulotki','wizytówki','prezentacje','automatyzacje',
      'integracje','raporty','artykuły','newslettery','testy','reklamy',
      'opisy','ebooki','kampanie','strony','narzędzia','powiadomienia',
      'systemy','konsultacje','treści','materiały','zakres',
    ];
    for (const word of pluralTriggers) {
      const re = new RegExp('Na czym polega(' + word + ')', 'gi');
      c.h2_opis = c.h2_opis.replace(re, 'Na czym polegają$1');
    }
    // Bardziej ogólna reguła: jeśli po "polega" następuje słowo kończące się na typową
    // końcówkę liczby mnogiej i nie chodzi o "polega na"
    c.h2_opis = c.h2_opis
      .replace(/Na czym polega (formularze|kreacje|słowa|pages|bannery|szablony|ulotki|wizytówki|prezentacje|automatyzacje|integracje|raporty|artykuły|newslettery|testy|reklamy|opisy|ebooki|kampanie|strony|narzędzia|powiadomienia|systemy|konsultacje|treści|materiały)/gi,
               (m, p1) => 'Na czym polegają ' + p1);
  }

  // ── h2_faq ────────────────────────────────────────────────────────────────
  // Sub-strony: usuwamy "dla firm z Tarnobrzega" z nagłówka FAQ (zbędne)
  // "Pytania o [X] dla firm z Tarnobrzega" → "Pytania o [X] — Tarnobrzeg"
  if (isSubPage && c.h2_faq) {
    c.h2_faq = c.h2_faq
      .replace(/ dla firm z Tarnobrzega$/gi, ' — Tarnobrzeg')
      .replace(/ dla firm z Tarnobrzega —/gi, ' —');
  }

  // ── h2_korzysci ───────────────────────────────────────────────────────────
  // Sub-strony: "Co zyskuje Twoja firma z Tarnobrzega?" — zbyt ogólne, dodajemy usługę
  // Zostawiamy jak jest — krótkie i czytelne, nie wymaga zmiany.

  // ── Globalne: zdublowane "z Tarnobrzega w Tarnobrzegu" wszędzie ──────────
  for (const key of Object.keys(c)) {
    if (typeof c[key] === 'string') {
      c[key] = c[key].replace(/ z Tarnobrzega w Tarnobrzegu/g, ' w Tarnobrzegu');
    }
  }

  const updated = JSON.stringify(c);
  if (updated !== orig) {
    stmt.run(updated, r.slug);
    fixed++;
  }
}

console.log('Naprawiono rekordów:', fixed);
