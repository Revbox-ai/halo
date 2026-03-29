'use strict';
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'halo.db');

function getDb() {
  return new Database(DB_PATH);
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      meta_description TEXT,
      h1 TEXT,
      hero_subtitle TEXT,
      content_json TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      meta_description TEXT,
      excerpt TEXT,
      content TEXT,
      published INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS realizacje (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      branza TEXT,
      miasto TEXT,
      problem TEXT,
      dzialania TEXT,
      efekty TEXT,
      cytat TEXT,
      cytat_autor TEXT,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS opinie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imie TEXT NOT NULL,
      firma TEXT,
      tresc TEXT NOT NULL,
      inicjaly TEXT,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed settings
  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get();
  if (settingsCount.c === 0) {
    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    const seedSettings = [
      ['site_name', 'Halo'],
      ['tagline', 'Pomagamy firmom z Tarnobrzega zdobywać klientów'],
      ['phone', '+48 500 000 000'],
      ['email', 'kontakt@halo.tarnobrzeg.pl'],
      ['address', 'Tarnobrzeg, woj. podkarpackie'],
      ['ga4_id', ''],
      ['og_image', '/images/header.png'],
      ['facebook', ''],
      ['instagram', ''],
      ['linkedin', '']
    ];
    for (const [key, value] of seedSettings) {
      insertSetting.run(key, value);
    }
  }

  // Seed pages (service pages)
  const pagesCount = db.prepare('SELECT COUNT(*) as c FROM pages').get();
  if (pagesCount.c === 0) {
    const insertPage = db.prepare(`
      INSERT OR IGNORE INTO pages (slug, title, meta_description, h1, hero_subtitle, content_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const servicePages = [
      {
        slug: 'strony-internetowe-tarnobrzeg',
        title: 'Strony internetowe Tarnobrzeg',
        meta_description: 'Profesjonalne strony internetowe dla firm z Tarnobrzega. Szybkie, nowoczesne, zoptymalizowane pod SEO. Zamów bezpłatną konsultację.',
        h1: 'Strony internetowe Tarnobrzeg',
        hero_subtitle: 'Tworzymy strony, które przyciągają klientów i generują sprzedaż — nie tylko ładnie wyglądają.',
        content_json: JSON.stringify({
          dla_kogo: 'Dla firm lokalnych, usługodawców, gabinetów, sklepów i każdego, kto chce mieć profesjonalną wizytówkę w sieci.',
          co_obejmuje: [
            'Projekt graficzny dopasowany do marki',
            'Responsywny kod HTML/CSS/JS',
            'Optymalizacja pod SEO (meta, schema, szybkość)',
            'Integracja z Google Analytics i Search Console',
            'Panel administracyjny do samodzielnej edycji',
            'Certyfikat SSL i hosting przez 1 rok'
          ],
          korzysci: [
            'Więcej zapytań z Google Maps i wyszukiwarki',
            'Profesjonalne pierwsze wrażenie',
            'Szybki czas ładowania (Core Web Vitals)',
            'Łatwa aktualizacja treści bez znajomości kodowania'
          ],
          cennik: [
            { nazwa: 'Starter', cena: 'od 1 500 zł', opis: 'Strona wizytówka 5 podstron' },
            { nazwa: 'Business', cena: 'od 3 500 zł', opis: 'Rozbudowana strona firmowa + blog' },
            { nazwa: 'Pro', cena: 'wycena indywidualna', opis: 'Sklep, platforma, system custom' }
          ],
          faq: [
            { pytanie: 'Ile trwa realizacja strony?', odpowiedz: 'Standardowa strona powstaje w 2–4 tygodnie od zebrania materiałów.' },
            { pytanie: 'Czy będę mógł sam edytować treści?', odpowiedz: 'Tak. Każda strona jest dostarczana z prostym panelem administracyjnym.' },
            { pytanie: 'Czy strona będzie widoczna w Google?', odpowiedz: 'Tak, wdrażamy podstawowe SEO on-page przy każdym projekcie.' },
            { pytanie: 'Co z hostingiem?', odpowiedz: 'Oferujemy hosting przez 1 rok gratis, potem ok. 300 zł/rok.' }
          ],
          powiazane_uslugi: ['seo-tarnobrzeg', 'google-ads-tarnobrzeg', 'grafika-reklamowa-tarnobrzeg']
        })
      },
      {
        slug: 'seo-tarnobrzeg',
        title: 'SEO Tarnobrzeg — pozycjonowanie lokalne',
        meta_description: 'Pozycjonowanie lokalne dla firm z Tarnobrzega. Pojawiaj się wysoko w Google Maps i wynikach organicznych. Sprawdź ofertę.',
        h1: 'SEO Tarnobrzeg — pozycjonowanie lokalne',
        hero_subtitle: 'Twoja firma na pierwszej stronie Google dla klientów szukających usług w Tarnobrzegu i okolicach.',
        content_json: JSON.stringify({
          dla_kogo: 'Dla firm, które chcą być widoczne lokalnie — restauracje, usługi, gabinety, sklepy stacjonarne.',
          co_obejmuje: [
            'Audyt SEO i analiza konkurencji',
            'Optymalizacja Google Business Profile',
            'Link building lokalny',
            'Optymalizacja treści na stronie',
            'Raporty miesięczne pozycji',
            'Monitoring i korekty strategii'
          ],
          korzysci: [
            'Klienci z Tarnobrzega i okolic trafiają na Twoją stronę',
            'Wyższe pozycje w Google Maps',
            'Długofalowy efekt bez stałych kosztów reklamy',
            'Wzrost ruchu organicznego o 50–200%'
          ],
          cennik: [
            { nazwa: 'Local Start', cena: '799 zł/mies.', opis: 'Optymalizacja GBP + 5 fraz lokalnych' },
            { nazwa: 'Local Pro', cena: '1 499 zł/mies.', opis: 'Pełne SEO lokalne + content' },
            { nazwa: 'Dominacja', cena: '2 499 zł/mies.', opis: 'Agresywna strategia dla liderów rynku' }
          ],
          faq: [
            { pytanie: 'Kiedy zobaczę efekty?', odpowiedz: 'Pierwsze efekty zazwyczaj po 2–3 miesiącach. Pełne wyniki po 6 miesiącach.' },
            { pytanie: 'Czy pozycjonowanie jest bezpieczne?', odpowiedz: 'Stosujemy wyłącznie White Hat SEO zgodne z wytycznymi Google.' },
            { pytanie: 'Czy muszę mieć stronę, by korzystać z SEO?', odpowiedz: 'Tak, choć możemy zoptymalizować sam Google Business Profile.' },
            { pytanie: 'Jak mierzysz efekty?', odpowiedz: 'Miesięczny raport pozycji fraz, ruch organiczny, konwersje z Google Analytics.' }
          ],
          powiazane_uslugi: ['strony-internetowe-tarnobrzeg', 'google-ads-tarnobrzeg', 'automatyzacje-firmy-tarnobrzeg']
        })
      },
      {
        slug: 'google-ads-tarnobrzeg',
        title: 'Google Ads Tarnobrzeg',
        meta_description: 'Kampanie Google Ads dla firm z Tarnobrzega. Płać tylko za kliknięcia od potencjalnych klientów. Szybkie efekty od pierwszego dnia.',
        h1: 'Google Ads Tarnobrzeg',
        hero_subtitle: 'Reklamy Google, które przynoszą leady, a nie tylko wyświetlenia — płacisz wyłącznie za realnych klientów.',
        content_json: JSON.stringify({
          dla_kogo: 'Dla firm, które potrzebują szybkich efektów i mają budżet na reklamę płatną.',
          co_obejmuje: [
            'Konfiguracja i audyt konta Google Ads',
            'Badanie słów kluczowych i grup reklam',
            'Tworzenie kreacji reklamowych',
            'Konfiguracja konwersji i śledzenia',
            'Optymalizacja kampanii co tydzień',
            'Raport miesięczny z wynikami'
          ],
          korzysci: [
            'Klienci od pierwszego dnia kampanii',
            'Pełna kontrola budżetu — nigdy nie przepłacisz',
            'Targetowanie lokalne (Tarnobrzeg, Stalowa Wola, Mielec)',
            'Przejrzyste raporty — wiesz za co płacisz'
          ],
          cennik: [
            { nazwa: 'Start', cena: '499 zł/mies. + budżet', opis: 'Jedna kampania wyszukiwania' },
            { nazwa: 'Growth', cena: '999 zł/mies. + budżet', opis: 'Search + Display + remarketing' },
            { nazwa: 'Full Funnel', cena: '1 799 zł/mies. + budżet', opis: 'Pełna strategia multi-kampanijne' }
          ],
          faq: [
            { pytanie: 'Jaki budżet reklamowy potrzebuję?', odpowiedz: 'Minimum 500–800 zł/mies. na budżet mediowy dla lokalnych kampanii.' },
            { pytanie: 'Czy mogę zatrzymać kampanię?', odpowiedz: 'Tak, w każdej chwili. Bez umów na czas określony.' },
            { pytanie: 'Co to jest remarketing?', odpowiedz: 'Reklamy wyświetlane osobom, które już odwiedziły Twoją stronę.' },
            { pytanie: 'Czy zarządzasz też meta ads?', odpowiedz: 'Tak, oferujemy kampanie na Facebook i Instagram jako uzupełnienie.' }
          ],
          powiazane_uslugi: ['seo-tarnobrzeg', 'strony-internetowe-tarnobrzeg', 'automatyzacje-firmy-tarnobrzeg']
        })
      },
      {
        slug: 'grafika-reklamowa-tarnobrzeg',
        title: 'Grafika reklamowa Tarnobrzeg',
        meta_description: 'Profesjonalna grafika reklamowa dla firm z Tarnobrzega. Bannery, ulotki, materiały social media, branding. Zamów wycenę.',
        h1: 'Grafika reklamowa Tarnobrzeg',
        hero_subtitle: 'Spójna, profesjonalna identyfikacja wizualna, która wyróżnia Twoją firmę na lokalnym rynku.',
        content_json: JSON.stringify({
          dla_kogo: 'Dla firm, które chcą wyglądać profesjonalnie — zarówno online jak i offline.',
          co_obejmuje: [
            'Logo i identyfikacja wizualna',
            'Bannery reklamowe (Google, Facebook)',
            'Ulotki, plakaty, materiały drukowane',
            'Szablony social media (Instagram, Facebook)',
            'Prezentacje i oferty handlowe',
            'Wizytówki i materiały biurowe'
          ],
          korzysci: [
            'Spójny wizerunek we wszystkich kanałach',
            'Materiały gotowe do druku i publikacji online',
            'Szybki czas realizacji — 3–7 dni roboczych',
            'Nieograniczone poprawki do akceptacji'
          ],
          cennik: [
            { nazwa: 'Pojedyncza grafika', cena: 'od 150 zł', opis: 'Banner, ulotka lub post social media' },
            { nazwa: 'Pakiet Social Media', cena: '499 zł/mies.', opis: '12 grafik + szablony brandowe' },
            { nazwa: 'Identyfikacja Wizualna', cena: 'od 1 800 zł', opis: 'Logo + KV + wszystkie nośniki' }
          ],
          faq: [
            { pytanie: 'W jakich formatach dostarczasz pliki?', odpowiedz: 'PNG, JPG, PDF, SVG, AI — w zależności od potrzeb.' },
            { pytanie: 'Czy projektujesz też logo?', odpowiedz: 'Tak, oferujemy pełną identyfikację wizualną od podstaw.' },
            { pytanie: 'Ile czasu trwa realizacja?', odpowiedz: 'Zazwyczaj 3–7 dni roboczych od briefu.' },
            { pytanie: 'Czy mogę prosić o poprawki?', odpowiedz: 'Tak, pracujemy do akceptacji klienta.' }
          ],
          powiazane_uslugi: ['strony-internetowe-tarnobrzeg', 'google-ads-tarnobrzeg', 'seo-tarnobrzeg']
        })
      },
      {
        slug: 'automatyzacje-firmy-tarnobrzeg',
        title: 'Automatyzacja sprzedaży Tarnobrzeg',
        meta_description: 'Automatyzacja procesów sprzedażowych dla firm z Tarnobrzega. CRM, follow-upy, chatboty, integracje. Oszczędź czas i zwiększ sprzedaż.',
        h1: 'Automatyzacja sprzedaży Tarnobrzeg',
        hero_subtitle: 'Zautomatyzuj powtarzalne zadania i skup się na tym, co naprawdę generuje przychód.',
        content_json: JSON.stringify({
          dla_kogo: 'Dla firm, które chcą skalować sprzedaż bez proporcjonalnego wzrostu kosztów pracy.',
          co_obejmuje: [
            'Wdrożenie i konfiguracja CRM',
            'Automatyczne follow-upy email i SMS',
            'Chatbot na stronie i w social media',
            'Integracje między systemami (Zapier, Make)',
            'Automatyzacja fakturowania i onboardingu',
            'Szkolenie zespołu z nowych narzędzi'
          ],
          korzysci: [
            'Oszczędność 5–15 godzin tygodniowo',
            'Zero zapomnianych leadów',
            'Szybsza obsługa klienta 24/7',
            'Wzrost konwersji leadów o 20–40%'
          ],
          cennik: [
            { nazwa: 'Quick Win', cena: '1 200 zł', opis: 'Jedna kluczowa automatyzacja' },
            { nazwa: 'Sales System', cena: '3 500 zł', opis: 'CRM + follow-upy + raportowanie' },
            { nazwa: 'Full Automation', cena: 'wycena indywidualna', opis: 'Pełna transformacja procesów' }
          ],
          faq: [
            { pytanie: 'Jakich narzędzi używacie?', odpowiedz: 'Make (dawniej Integromat), Zapier, HubSpot, Pipedrive, ActiveCampaign — dobieramy do potrzeb.' },
            { pytanie: 'Czy potrzebuję IT do wdrożenia?', odpowiedz: 'Nie. Zajmujemy się całą konfiguracją, Ty tylko zatwierdzasz.' },
            { pytanie: 'Czy to jest drogie w utrzymaniu?', odpowiedz: 'Narzędzia kosztują zazwyczaj 50–200 zł/mies., co szybko się zwraca.' },
            { pytanie: 'Co jeśli coś przestanie działać?', odpowiedz: 'Oferujemy wsparcie techniczne i szybką reakcję na awarie.' }
          ],
          powiazane_uslugi: ['strony-internetowe-tarnobrzeg', 'seo-tarnobrzeg', 'google-ads-tarnobrzeg']
        })
      }
    ];

    for (const page of servicePages) {
      insertPage.run(page.slug, page.title, page.meta_description, page.h1, page.hero_subtitle, page.content_json);
    }
  }

  // Seed blog posts
  const blogCount = db.prepare('SELECT COUNT(*) as c FROM blog_posts').get();
  if (blogCount.c === 0) {
    const insertPost = db.prepare(`
      INSERT INTO blog_posts (slug, title, meta_description, excerpt, content, published)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPost.run(
      'jak-zdobyc-klientow-lokalnych-przez-google',
      'Jak zdobyć klientów lokalnych przez Google w 2024 roku',
      'Praktyczny przewodnik dla firm z Tarnobrzega i regionu. Dowiedz się, jak pojawić się wysoko w lokalnych wynikach Google.',
      'Lokalne SEO to jeden z najskuteczniejszych kanałów pozyskiwania klientów dla małych i średnich firm. Dowiedz się, od czego zacząć.',
      `<h2>Czym jest lokalne SEO?</h2>
<p>Lokalne SEO (Search Engine Optimization) to zestaw działań, które sprawiają, że Twoja firma pojawia się wysoko w wynikach Google dla zapytań lokalnych — np. "mechanik Tarnobrzeg" czy "fryzjer blisko mnie".</p>

<h2>Dlaczego warto inwestować w lokalne SEO?</h2>
<p>Według danych Google, 46% wszystkich zapytań ma lokalny charakter. Co więcej, 76% osób, które szukają lokalnej firmy na smartfonie, odwiedza ją tego samego dnia. To ogromna szansa dla firm działających stacjonarnie.</p>

<h2>Jak zacząć?</h2>
<h3>1. Google Business Profile</h3>
<p>Pierwszym krokiem jest weryfikacja i optymalizacja profilu Google Business (dawniej Google Moja Firma). Uzupełnij wszystkie dane: godziny, zdjęcia, kategorie, opis. Regularnie zbieraj opinie klientów.</p>

<h3>2. NAP — spójność danych kontaktowych</h3>
<p>Upewnij się, że Twoja nazwa, adres i numer telefonu (NAP) są identyczne we wszystkich miejscach w sieci: na stronie, w katalogach firmowych, w mediach społecznościowych.</p>

<h3>3. Lokalne słowa kluczowe</h3>
<p>Twórz treści na stronie zawierające lokalne frazy kluczowe. Zamiast "najlepsza pizzeria", pisz "najlepsza pizzeria w Tarnobrzegu". To proste, a robi dużą różnicę.</p>

<h3>4. Zbieraj opinie</h3>
<p>Firmy z większą liczbą pozytywnych opinii w Google Maps pojawiają się wyżej. Poproś zadowolonych klientów o wystawienie recenzji — możesz to zautomatyzować.</p>

<h2>Podsumowanie</h2>
<p>Lokalne SEO to inwestycja, która przynosi trwałe efekty. W przeciwieństwie do reklam płatnych, raz wypracowane pozycje generują ruch bez dodatkowych kosztów. Chcesz wiedzieć, jak wygląda SEO Twojej firmy? Zamów bezpłatny audyt.</p>`,
      1
    );

    insertPost.run(
      '5-bledow-stron-internetowych-firm-lokalnych',
      '5 błędów na stronach firm lokalnych, które kosztują Cię klientów',
      'Sprawdź, czy Twoja strona nie popełnia tych krytycznych błędów, które odstraszają klientów i obniżają pozycje w Google.',
      'Większość stron internetowych małych firm w Polsce ma te same błędy. Popraw je, a liczba zapytań może wzrosnąć nawet kilkukrotnie.',
      `<h2>Wstęp</h2>
<p>Po audycie ponad 140 stron firmowych z regionu podkarpackiego zauważyłem, że większość z nich popełnia te same błędy. Co ciekawe, ich poprawienie często nie wymaga dużego budżetu — wystarczy wiedzieć, czego szukać.</p>

<h2>Błąd 1: Brak numeru telefonu w widocznym miejscu</h2>
<p>To brzmi banalnie, ale naprawdę wiele stron ukrywa numer telefonu w stopce lub na podstronie "Kontakt". Tymczasem klient na urządzeniu mobilnym chce zadzwonić jednym kliknięciem. Numer powinien być w nawigacji lub na górze każdej podstrony.</p>

<h2>Błąd 2: Wolne ładowanie strony</h2>
<p>Google Core Web Vitals penalizują wolne strony niższymi pozycjami. Najczęstszy winowajca to nieoptymalizowane zdjęcia. Zdjęcie 5MB na stronie głównej może spowolnić ładowanie o kilka sekund — a każda sekunda to utracone konwersje.</p>

<h2>Błąd 3: Brak lokalnych słów kluczowych</h2>
<p>Strona, na której ani razu nie pojawia się słowo "Tarnobrzeg" lub nazwa regionu, nie ma szans na pozycje w lokalnych wynikach. Lokalny kontekst musi być zawarty w tytułach, nagłówkach i treściach.</p>

<h2>Błąd 4: Strona nieczytelna na telefonie</h2>
<p>Ponad 60% ruchu na stronach lokalnych firm pochodzi z urządzeń mobilnych. Jeśli Twoja strona nie jest responsywna, tracisz większość potencjalnych klientów jeszcze przed zapoznaniem się z ofertą.</p>

<h2>Błąd 5: Brak opinii i dowodów społecznych</h2>
<p>Klienci nie ufają firmom bez opinii. Wbuduj sekcję z recenzjami Google na swoją stronę, pokaż realizacje i efekty współpracy. Jeden dobry case study może przekonać więcej osób niż cała strona reklamowego tekstu.</p>

<h2>Co dalej?</h2>
<p>Jeśli Twoja strona ma choć jeden z tych błędów, warto działać szybko. Oferuję bezpłatny audyt SEO i UX — skontaktuj się, a omówię co konkretnie można poprawić.</p>`,
      1
    );
  }

  // Seed realizacje
  const realizacjeCount = db.prepare('SELECT COUNT(*) as c FROM realizacje').get();
  if (realizacjeCount.c === 0) {
    const insertR = db.prepare(`
      INSERT INTO realizacje (slug, title, branza, miasto, problem, dzialania, efekty, cytat, cytat_autor, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertR.run(
      'gabinet-stomatologiczny-maxdent',
      'Gabinet Stomatologiczny MaxDent',
      'Stomatologia',
      'Tarnobrzeg',
      'Gabinet nie pojawiał się w Google Maps dla frazy "dentysta Tarnobrzeg". 90% nowych pacjentów przychodziło z polecenia, bez własnego kanału pozyskiwania.',
      JSON.stringify([
        'Kompletna optymalizacja Google Business Profile',
        'Nowa strona internetowa z Landing Page dla implantów',
        'Kampania Google Ads na usługi stomatologiczne',
        'Zbieranie i zarządzanie opiniami pacjentów',
        'Lokalne SEO — frazy "dentysta Tarnobrzeg" i powiązane'
      ]),
      JSON.stringify([
        'Pozycja #1 w Google Maps dla "dentysta Tarnobrzeg" po 3 miesiącach',
        '340% wzrost liczby telefonów z Google',
        '47 nowych pacjentów z kanałów online w pierwszym kwartale',
        'Średnia ocena Google wzrosła z 3.8 do 4.9 (87 opinii)'
      ]),
      'Nie wierzyłem, że internet może tak zmienić gabinet. Teraz mamy pełny grafik z tygodniowym wyprzedzeniem, a większość nowych pacjentów mówi, że znalazła nas w Google.',
      'Dr Marcin K., właściciel MaxDent',
      1
    );

    insertR.run(
      'sklep-budowlany-murarz',
      'Sklep Budowlany Murarz',
      'Handel / Materiały budowlane',
      'Tarnobrzeg',
      'Sklep miał starą stronę z 2015 roku bez możliwości zamówień online. Konkurencja z Sandomierza i Rzeszowa przejmowała klientów przez internet.',
      JSON.stringify([
        'Budowa nowego sklepu internetowego z integracją stanów magazynowych',
        'Migracja i optymalizacja SEO kategorii produktowych',
        'Kampania Google Shopping dla produktów sezonowych',
        'Wdrożenie chatbotu do obsługi zapytań o dostępność'
      ]),
      JSON.stringify([
        '218% wzrost przychodów online w ciągu 6 miesięcy',
        'Sklep na 1. miejscu Google dla 23 fraz kluczowych',
        'Redukcja czasu obsługi telefonicznej o 40% dzięki chatbotowi',
        'Zasięg klientów rozszerzył się na całe woj. podkarpackie'
      ]),
      'Myśleliśmy, że sklep internetowy to za duże wyzwanie dla nas. Kamil przeprowadził nas przez cały proces krok po kroku. Teraz internet to nasz największy kanał sprzedaży.',
      'Piotr M., właściciel Murarz',
      1
    );
  }

  // Seed opinie
  const opinieCount = db.prepare('SELECT COUNT(*) as c FROM opinie').get();
  if (opinieCount.c === 0) {
    const insertO = db.prepare(`
      INSERT INTO opinie (imie, firma, tresc, inicjaly, published)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertO.run('Anna K.', 'Salon Urody Aura, Tarnobrzeg', 'Współpraca z Halo to najlepsza inwestycja w marketing, jaką zrobiłam. Po 2 miesiącach mój salon ma pełny grafik na 3 tygodnie do przodu. Nowe klientki co tydzień z Google Maps.', 'AK', 1);
    insertO.run('Tomasz W.', 'TW Instalacje, Stalowa Wola', 'Solidna robota, konkretne efekty. Kampania Google Ads przyniosła mi 12 zapytań w pierwszym tygodniu. Polecam każdemu przedsiębiorcy z regionu.', 'TW', 1);
    insertO.run('Małgorzata P.', 'Przedszkole Słoneczko, Tarnobrzeg', 'Nowa strona internetowa jest przepiękna i działa błyskawicznie. Rodzice chwalą, że łatwo znaleźć wszystkie informacje. Zapisy online oszczędzają mi godziny pracy miesięcznie.', 'MP', 1);
  }

  db.close();
  console.log('Database initialized successfully.');
}

module.exports = { getDb, initDb };
