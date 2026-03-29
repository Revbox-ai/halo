'use strict';
const { getDb } = require('./init');
const db = getDb();

const LINKS = {
  'tarnobrzeg/strony-internetowe': [
    '/tarnobrzeg/strony-internetowe/projekt-graficzny-strony',
    '/tarnobrzeg/strony-internetowe/responsywny-kod-mobile',
    '/tarnobrzeg/strony-internetowe/seo-on-page',
    '/tarnobrzeg/strony-internetowe/integracja-narzedzi-analitycznych',
    '/tarnobrzeg/strony-internetowe/panel-administracyjny',
    '/tarnobrzeg/strony-internetowe/ssl-hosting-kopie-zapasowe',
    '/tarnobrzeg/strony-internetowe/formularze-kontaktowe',
    '/tarnobrzeg/strony-internetowe/automatyzacja-follow-up-po-formularzu',
  ],
  'tarnobrzeg/seo': [
    '/tarnobrzeg/seo/audyt-seo',
    '/tarnobrzeg/seo/google-business-profile',
    '/tarnobrzeg/seo/lokalne-slowa-kluczowe',
    '/tarnobrzeg/seo/optymalizacja-techniczna-strony',
    '/tarnobrzeg/seo/tworzenie-tresci-seo',
    '/tarnobrzeg/seo/link-building-lokalny',
    '/tarnobrzeg/seo/zarzadzanie-opiniami-google',
    '/tarnobrzeg/seo/raport-seo-miesieczny',
  ],
  'tarnobrzeg/google-ads': [
    '/tarnobrzeg/google-ads/audyt-konta-google-ads',
    '/tarnobrzeg/google-ads/badanie-slow-kluczowych',
    '/tarnobrzeg/google-ads/kreacje-reklamowe-google-ads',
    '/tarnobrzeg/google-ads/targetowanie-lokalne-google-ads',
    '/tarnobrzeg/google-ads/sledzenie-konwersji-google-ads',
    '/tarnobrzeg/google-ads/optymalizacja-kampanii-google-ads',
    '/tarnobrzeg/google-ads/remarketing-google-ads',
    '/tarnobrzeg/google-ads/raport-google-ads-roas',
  ],
  'tarnobrzeg/grafika-reklamowa': [
    '/tarnobrzeg/grafika-reklamowa/logo-i-identyfikacja-wizualna',
    '/tarnobrzeg/grafika-reklamowa/bannery-google-display',
    '/tarnobrzeg/grafika-reklamowa/szablony-postow-i-stories',
    '/tarnobrzeg/grafika-reklamowa/ulotki-plakaty-rollupy',
    '/tarnobrzeg/grafika-reklamowa/wizytowki-i-materialy-biurowe',
    '/tarnobrzeg/grafika-reklamowa/prezentacje-firmowe',
    '/tarnobrzeg/grafika-reklamowa/grafiki-na-strone-internetowa',
    '/tarnobrzeg/grafika-reklamowa/brandbook',
  ],
  'tarnobrzeg/automatyzacje': [
    '/tarnobrzeg/automatyzacje/audyt-procesow',
    '/tarnobrzeg/automatyzacje/make-zapier',
    '/tarnobrzeg/automatyzacje/chatboty-ai',
    '/tarnobrzeg/automatyzacje/follow-up-email-sms',
    '/tarnobrzeg/automatyzacje/integracje-crm',
    '/tarnobrzeg/automatyzacje/automatyzacja-fakturowania',
    '/tarnobrzeg/automatyzacje/powiadomienia-i-alerty',
    '/tarnobrzeg/automatyzacje/szkolenie-z-obslugi-systemow',
  ],
  'tarnobrzeg/marketing-internetowy': [
    '/tarnobrzeg/marketing-internetowy/facebook-instagram-ads',
    '/tarnobrzeg/marketing-internetowy/tiktok-ads',
    '/tarnobrzeg/marketing-internetowy/linkedin-ads',
    '/tarnobrzeg/marketing-internetowy/planowanie-kampanii',
    '/tarnobrzeg/marketing-internetowy/kreacje-reklamowe',
    '/tarnobrzeg/marketing-internetowy/pixele-konwersje-sledzenie',
    '/tarnobrzeg/marketing-internetowy/dobor-kanalow-marketingowych',
    '/tarnobrzeg/marketing-internetowy/analiza-i-raport-miesieczny',
  ],
  'tarnobrzeg/social-media': [
    '/tarnobrzeg/social-media/prowadzenie-profili-firmowych',
    '/tarnobrzeg/social-media/posty-grafiki-rolki-stories',
    '/tarnobrzeg/social-media/kalendarz-tresci',
    '/tarnobrzeg/social-media/obsluga-komentarzy-i-wiadomosci',
    '/tarnobrzeg/social-media/zasiegi-organiczne',
    '/tarnobrzeg/social-media/kampanie-reklamowe-social-media',
    '/tarnobrzeg/social-media/raport-social-media',
    '/tarnobrzeg/social-media/komunikacja-dopasowana-do-platformy',
  ],
  'tarnobrzeg/content-marketing': [
    '/tarnobrzeg/content-marketing/strategia-contentowa',
    '/tarnobrzeg/content-marketing/teksty-na-strony-uslugowe',
    '/tarnobrzeg/content-marketing/artykuly-blogowe-seo',
    '/tarnobrzeg/content-marketing/opisy-produktow-i-kategorii',
    '/tarnobrzeg/content-marketing/newslettery-i-sekwencje-email',
    '/tarnobrzeg/content-marketing/ebooki-checklisty-przewodniki',
    '/tarnobrzeg/content-marketing/copywriting-storytelling',
    '/tarnobrzeg/content-marketing/optymalizacja-tresci-pod-seo',
  ],
  'tarnobrzeg/analityka-doradztwo': [
    '/tarnobrzeg/analityka-doradztwo/konfiguracja-ga4-gtm',
    '/tarnobrzeg/analityka-doradztwo/sledzenie-konwersji',
    '/tarnobrzeg/analityka-doradztwo/audyt-dzialan-marketingowych',
    '/tarnobrzeg/analityka-doradztwo/raporty-z-rekomendacjami',
    '/tarnobrzeg/analityka-doradztwo/testy-ab',
    '/tarnobrzeg/analityka-doradztwo/analiza-lejka-sprzedazowego',
    '/tarnobrzeg/analityka-doradztwo/doradztwo-strategiczne',
    '/tarnobrzeg/analityka-doradztwo/konsultacje-godzinowe',
  ],
  'tarnobrzeg/sklep-internetowy': [
    '/tarnobrzeg/sklep-internetowy/wdrozenie-woocommerce-prestashop',
    '/tarnobrzeg/sklep-internetowy/projekt-graficzny-sklepu',
    '/tarnobrzeg/sklep-internetowy/optymalizacja-konwersji-cro',
    '/tarnobrzeg/sklep-internetowy/integracja-systemow-platnosci',
    '/tarnobrzeg/sklep-internetowy/feed-produktowy-google-merchant',
    '/tarnobrzeg/sklep-internetowy/seo-sklepu-internetowego',
    '/tarnobrzeg/sklep-internetowy/reklamy-google-shopping',
    '/tarnobrzeg/sklep-internetowy/audyt-optymalizacja-sklepu',
  ],
};

const stmt = db.prepare('UPDATE pages SET content_json = ? WHERE slug = ?');

for (const [slug, links] of Object.entries(LINKS)) {
  const row = db.prepare('SELECT content_json FROM pages WHERE slug = ?').get(slug);
  if (!row) { console.log('NOT FOUND', slug); continue; }
  const c = JSON.parse(row.content_json || '{}');
  c.co_obejmuje_links = links;
  stmt.run(JSON.stringify(c), slug);
  console.log('OK', slug);
}

console.log('Gotowe.');
