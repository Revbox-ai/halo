'use strict';
const { getDb } = require('./init');
const db = getDb();

// ─── TEKSTY UNIWERSALNE ──────────────────────────────────────────────────────

const DLACZEGO_WARTO = 'Warto wybrać Halo w Tarnobrzegu, bo łączymy znajomość lokalnego rynku z praktycznym podejściem do marketingu. Realizowaliśmy projekty dla firm z Tarnobrzegu, Sandomierza, Stalowej Woli i całego regionu podkarpackiego. W naszej pracy liczą się konkretne efekty — wzrost widoczności, więcej zapytań, wyższe przychody. Nie przepalamy budżetu na ogólne działania — każda usługa jest dopasowana do specyfiki lokalnego rynku i realnych celów Twojej firmy. Budujemy długoterminowe relacje, bo wiemy, że zaufanie lokalnych firm to fundament naszej działalności.';

const OBSZAR_PL = 'Obsługujemy firmy z Tarnobrzega oraz okolicznych miejscowości — między innymi z Sandomierza, Stalowej Woli, Nowej Dęby, Mielca, Baranowa Sandomierskiego i Gorzyc. Działamy lokalnie, więc dobrze rozumiemy specyfikę każdego rynku. Możemy pracować zarówno stacjonarnie, jak i zdalnie — zakres i formę współpracy ustalamy indywidualnie.';

const FAQ_UNIVERSAL = {
  pytanie: 'Czy obsługujecie klientów poza Tarnobrzegiem?',
  odpowiedz: 'Tak. Realizujemy projekty dla firm z Tarnobrzega oraz pobliskich miejscowości: Sandomierza, Stalowej Woli, Nowej Dęby, Mielca i Baranowa Sandomierskiego. Zakres współpracy ustalamy indywidualnie.'
};

// ─── WSTĘPY DLA GŁÓWNYCH KATEGORII ──────────────────────────────────────────

const WSTEP = {
  'tarnobrzeg/strony-internetowe': 'Tworzymy strony internetowe w Tarnobrzegu dla firm, które chcą zdobywać klientów lokalnie i skuteczniej wykorzystywać internet w sprzedaży. Działamy w Tarnobrzegu, dlatego dobrze rozumiemy potrzeby firm z regionu — wiemy, jak budować komunikację czytelną zarówno dla użytkownika, jak i wyszukiwarki.\nPomagamy lokalnym firmom usługowym, markom B2B i przedsiębiorcom, którzy chcą zbierać zapytania online. Łączymy strategię, treść i wdrożenie tak, aby strona nie tylko wyglądała profesjonalnie, ale też odpowiadała na realne pytania klientów: co oferujesz, komu pomagasz, gdzie działasz i dlaczego warto wybrać właśnie Ciebie.',

  'tarnobrzeg/seo': 'Pozycjonujemy firmy z Tarnobrzegu lokalnie — pomagamy im pojawiać się wyżej w wynikach Google i zdobywać klientów bez ciągłego zwiększania budżetu reklamowego. Znamy lokalną konkurencję i wiemy, jakie frazy przynoszą realne zapytania z regionu.\nPomagamy firmom usługowym, specjalistom i przedsiębiorcom, którzy chcą wyjść poza polecenia i regularnie generować ruch organiczny z Google. Łączymy audyt, optymalizację techniczną, treści i link building tak, aby widoczność rosła długoterminowo.',

  'tarnobrzeg/google-ads': 'Prowadzimy kampanie Google Ads dla firm z Tarnobrzegu, które chcą szybko dotrzeć do klientów szukających ich usług w Google. Znamy lokalny rynek — ustawiamy kampanie tak, żeby budżet reklamowy trafiał do właściwych odbiorców i nie przepalał się na kliknięcia bez wartości.\nPomagamy firmom uruchomić skuteczne pozyskiwanie leadów z pełną kontrolą nad wydatkami. Obsługujemy zarówno nowe konta, jak i poprawiamy istniejące kampanie, które nie przynoszą oczekiwanych efektów.',

  'tarnobrzeg/grafika-reklamowa': 'Tworzymy grafikę reklamową i kompleksowy branding dla firm z Tarnobrzegu — od logotypu po pełną identyfikację wizualną. Działamy lokalnie, dlatego rozumiemy potrzeby firm z regionu i potrafimy tworzyć materiały, które wyróżniają na tle konkurencji.\nPomagamy firmom budować spójny wizerunek we wszystkich kanałach — w internecie, mediach społecznościowych i materiałach drukowanych. Każdy projekt zaczynamy od analizy marki, odbiorców i celów komunikacji.',

  'tarnobrzeg/automatyzacje': 'Automatyzujemy procesy firmowe dla przedsiębiorców z Tarnobrzegu, którzy chcą oszczędzać czas i obsługiwać więcej klientów bez zatrudniania kolejnych pracowników. Działamy lokalnie i rozumiemy, z jakimi wyzwaniami operacyjnymi mierzą się firmy z regionu.\nAutomatyzujemy powtarzalne zadania — od follow-upów po integracje systemów — tak, żeby firma działała sprawniej, a właściciel mógł skupić się na tym, co naprawdę ważne. Budujemy systemy, które są proste w obsłudze i nie wymagają wiedzy technicznej.',

  'tarnobrzeg/marketing-internetowy': 'Oferujemy kompleksowy marketing internetowy dla firm z Tarnobrzegu — od kampanii Google Ads i Meta Ads, przez content marketing, po SEO i social media. Działamy lokalnie i rozumiemy specyfikę rynku tarnobrzeskiego.\nDobieramy kanały, które przynoszą efekty dla konkretnego rodzaju biznesu, i prowadzimy działania mierzalne — tak, żeby każda złotówka budżetu marketingowego miała swoje uzasadnienie i przekładała się na realne zapytania od klientów.',

  'tarnobrzeg/social-media': 'Prowadzimy social media dla firm z Tarnobrzegu — na Facebooku, Instagramie, TikToku i LinkedIn. Tworzymy treści, prowadzimy profile i zarządzamy kampaniami reklamowymi tak, żeby media społecznościowe przynosiły realne efekty biznesowe, a nie tylko lajki.\nDziałamy lokalnie, więc komunikacja jest dostosowana do specyfiki rynku w Tarnobrzegu i regionie. Rozumiemy, co angażuje lokalną społeczność i jak budować zasięgi organiczne bez przepalania budżetu.',

  'tarnobrzeg/content-marketing': 'Tworzymy treści marketingowe dla firm z Tarnobrzegu — artykuły blogowe, teksty na strony usługowe, opisy produktów, newslettery i inne materiały, które budują widoczność w Google i zaufanie odbiorców.\nDziałamy lokalnie, więc treści naturalnie uwzględniają Tarnobrzeg i region jako kontekst. Pomagamy firmom, które chcą przyciągać klientów wartościowymi treściami, a nie tylko płatnymi reklamami. Każdy tekst piszemy pod konkretną frazę, intencję użytkownika i etap decyzji zakupowej.',

  'tarnobrzeg/analityka-doradztwo': 'Oferujemy analitykę i doradztwo marketingowe dla firm z Tarnobrzegu, które chcą podejmować decyzje oparte na danych, a nie przeczuciach. Konfigurujemy narzędzia analityczne, interpretujemy wyniki i przygotowujemy rekomendacje dopasowane do celów firmy.\nPomagamy lepiej rozumieć klientów, efektywniej alokować budżety i identyfikować miejsca, gdzie tracisz potencjalnych kupujących. Działamy z firmami z Tarnobrzegu i regionu, które chcą poprawić skuteczność swoich działań marketingowych.',

  'tarnobrzeg/sklep-internetowy': 'Tworzymy sklepy internetowe dla firm z Tarnobrzegu, które chcą sprzedawać online — lokalnie i w całej Polsce. Projektujemy, wdrażamy i optymalizujemy sklepy WooCommerce i PrestaShop z myślą o UX, szybkości działania i widoczności w Google.\nZnamy realia handlu w regionie tarnobrzeskim i wiemy, jak zbudować sklep, który nie tylko wygląda profesjonalnie, ale faktycznie sprzedaje. Obsługujemy zarówno starty od zera, jak i modernizacje istniejących sklepów.',
};

// ─── STARE PODSTRONY (xxx-tarnobrzeg) ────────────────────────────────────────

const WSTEP_OLD = {
  'strony-internetowe-tarnobrzeg': 'Tworzymy strony internetowe w Tarnobrzegu dla firm, które chcą zdobywać klientów lokalnie i skuteczniej wykorzystywać internet w sprzedaży. Łączymy strategię, treść i wdrożenie — tak, aby strona odpowiadała na realne pytania klientów i wspierała widoczność w Google.\nPomagamy lokalnym firmom usługowym, markom B2B i przedsiębiorcom z Tarnobrzegu, Sandomierza, Stalowej Woli i okolic. Każdy projekt zaczynamy od analizy celów, by efekt końcowy przekładał się na więcej zapytań od klientów.',

  'seo-tarnobrzeg': 'Pozycjonujemy firmy z Tarnobrzegu lokalnie — pomagamy im pojawiać się wyżej w Google i zdobywać klientów organicznie. Znamy lokalną konkurencję i wiemy, jakie frazy przynoszą realne zapytania z regionu tarnobrzeskiego i podkarpackiego.\nŁączymy audyt SEO, optymalizację techniczną, tworzenie treści i link building — tak, aby widoczność rosła długoterminowo i nie zależała wyłącznie od płatnych reklam.',

  'google-ads-tarnobrzeg': 'Prowadzimy kampanie Google Ads dla firm z Tarnobrzegu. Znamy lokalny rynek — ustawiamy reklamy tak, żeby budżet trafiał do właściwych odbiorców i przynosił mierzalny zwrot z inwestycji.\nObsługujemy zarówno nowe konta reklamowe, jak i optymalizujemy istniejące kampanie. Śledzimy konwersje, raportujemy ROAS i stale poprawiamy wyniki — tak, żeby każda złotówka budżetu reklamowego pracowała na Twój biznes.',

  'grafika-reklamowa-tarnobrzeg': 'Tworzymy grafikę reklamową i branding dla firm z Tarnobrzegu. Od logotypu po pełną identyfikację wizualną — budujemy spójny wizerunek, który wyróżnia na tle lokalnej konkurencji.\nPomagamy firmom z regionu wyglądać profesjonalnie we wszystkich kanałach: w internecie, mediach społecznościowych i materiałach drukowanych.',

  'automatyzacje-firmy-tarnobrzeg': 'Automatyzujemy procesy firmowe dla przedsiębiorców z Tarnobrzegu, którzy chcą oszczędzać czas i obsługiwać więcej klientów bez zwiększania zatrudnienia. Budujemy systemy automatyzacji proste w obsłudze i dopasowane do specyfiki lokalnych firm.\nDziałamy w Make, Zapier i innych narzędziach — od follow-upów, przez integracje CRM, po chatboty AI. Wszystko po to, żeby Twoja firma działała sprawniej.',

  'marketing-internetowy-tarnobrzeg': 'Realizujemy kampanie marketingu internetowego dla firm z Tarnobrzegu — w Google, Facebooku, Instagramie i innych kanałach. Dobieramy rozwiązania dopasowane do celów i budżetu konkretnej firmy.\nDziałamy mierzalnie — śledzimy wyniki i optymalizujemy kampanie, żeby każda złotówka budżetu przekładała się na realne zapytania od klientów z Tarnobrzegu i regionu.',

  'social-media-tarnobrzeg': 'Prowadzimy social media dla firm z Tarnobrzegu — tworzymy treści, zarządzamy profilami i kampaniami reklamowymi na Facebooku, Instagramie, TikToku i LinkedIn. Stawiamy na efekty biznesowe, nie tylko zasięgi.\nKomunikacja jest dostosowana do specyfiki rynku lokalnego — wiemy, co angażuje odbiorców z Tarnobrzegu i regionu oraz jak budować społeczność wokół marki.',

  'content-marketing-tarnobrzeg': 'Tworzymy treści marketingowe dla firm z Tarnobrzegu — artykuły SEO, teksty usługowe, opisy produktów i newslettery. Każdy tekst jest pisany pod konkretną frazę lokalną i intencję użytkownika.\nPomagamy firmom budować widoczność w Google i zaufanie odbiorców poprzez wartościowe treści, które odpowiadają na realne pytania klientów z Tarnobrzegu i okolic.',

  'analityka-doradztwo-tarnobrzeg': 'Oferujemy analitykę i doradztwo marketingowe dla firm z Tarnobrzegu. Konfigurujemy GA4 i GTM, śledzimy konwersje i przygotowujemy raporty z konkretnymi rekomendacjami.\nPomagamy podejmować decyzje oparte na danych — lepiej rozumieć klientów, eliminować wąskie gardła w lejku sprzedażowym i efektywniej alokować budżety marketingowe.',
};

// ─── GENERATOR WSTĘPU DLA PODSTRON ─────────────────────────────────────────

function generateWstepSub(h1, title) {
  const clean = (h1 || title || '')
    .replace(/\n/g, ' ')
    .replace(/ Tarnobrzeg$/i, '')
    .replace(/ w Tarnobrzegu$/i, '')
    .replace(/ — Halo$/i, '')
    .trim();
  return `Oferujemy ${clean.toLowerCase()} w Tarnobrzegu dla firm, które chcą skutecznie rozwijać swój biznes w internecie. Działamy lokalnie i dobrze rozumiemy potrzeby firm z regionu — pomagamy przedsiębiorcom z Tarnobrzegu, Sandomierza, Stalowej Woli, Nowej Dęby i Mielca osiągać realne efekty. Łączymy strategię, wdrożenie i optymalizację tak, aby każde działanie przekładało się na wzrost widoczności i więcej zapytań od klientów.`;
}

// ─── OBSZAR DLA MIAST (lokalizacje /:miasto/:usluga) ──────────────────────

const OBSZAR_CITIES = {
  'stalowa-wola': 'Obsługujemy firmy ze Stalowej Woli oraz okolicznych miejscowości — między innymi z Niska, Tarnobrzega, Nowej Dęby, Sandomierza i Rzeszowa. Działamy lokalnie i rozumiemy specyfikę każdego rynku. Możemy pracować stacjonarnie lub zdalnie — zakres współpracy ustalamy indywidualnie.',
  'sandomierz':   'Obsługujemy firmy z Sandomierza oraz okolicznych miejscowości — między innymi z Tarnobrzega, Stalowej Woli, Opatowa, Ostrowca Świętokrzyskiego i Baranowa Sandomierskiego. Działamy lokalnie i rozumiemy specyfikę każdego rynku. Możemy pracować stacjonarnie lub zdalnie.',
  'mielec':       'Obsługujemy firmy z Mielca oraz okolicznych miejscowości — między innymi z Tarnobrzega, Rzeszowa, Dębicy, Kolbuszowej i Sędziszowa Małopolskiego. Działamy lokalnie i rozumiemy specyfikę każdego rynku. Możemy pracować stacjonarnie lub zdalnie.',
  'rzeszow':      'Obsługujemy firmy z Rzeszowa oraz okolicznych miejscowości — między innymi z Łańcuta, Jarosławia, Przemyśla, Krosna, Mielca i Tarnobrzega. Działamy lokalnie i rozumiemy specyfikę każdego rynku. Możemy pracować stacjonarnie lub zdalnie.',
  'nowa-deba':    'Obsługujemy firmy z Nowej Dęby oraz okolicznych miejscowości — między innymi z Tarnobrzega, Stalowej Woli, Mielca i Kolbuszowej. Działamy lokalnie i rozumiemy specyfikę każdego rynku. Możemy pracować stacjonarnie lub zdalnie.',
};

// ─── WSTĘPY DLA STRON MIAST /:miasto/:usluga ─────────────────────────────

const CITY_NAMES = {
  'stalowa-wola': 'Stalowej Woli',
  'sandomierz':   'Sandomierza',
  'mielec':       'Mielca',
  'rzeszow':      'Rzeszowa',
  'nowa-deba':    'Nowej Dęby',
};

function generateWstepCity(slug, h1) {
  const parts = slug.split('/');
  const miasto = parts[0];
  const miastoName = CITY_NAMES[miasto] || miasto;
  const cleanTitle = (h1 || '').replace(/\n/g, ' ').replace(/ — Halo$/, '').trim();
  return `Oferujemy ${cleanTitle.toLowerCase()} dla firm z ${miastoName} i okolicy. Działamy lokalnie, więc dobrze rozumiemy potrzeby firm z regionu — wiemy, jak budować komunikację czytelną dla użytkownika i wyszukiwarki, i jakie działania przynoszą realne efekty na lokalnym rynku. Pomagamy przedsiębiorcom, firmom usługowym i markom B2B z ${miastoName} i pobliskich miejscowości skutecznie rozwijać swoją obecność w internecie.`;
}

// ─── AKTUALIZACJA REKORDÓW ──────────────────────────────────────────────────

const update = db.prepare('UPDATE pages SET content_json = ? WHERE slug = ?');

function patchPage(slug, patches) {
  const row = db.prepare('SELECT content_json FROM pages WHERE slug = ?').get(slug);
  if (!row) return false;
  let content;
  try { content = JSON.parse(row.content_json || '{}'); } catch(e) { content = {}; }
  Object.assign(content, patches);
  // Augment FAQ with universal question if not already present
  if (Array.isArray(content.faq)) {
    const hasUniversal = content.faq.some(f =>
      f.pytanie && f.pytanie.toLowerCase().includes('poza tarnobrzegiem')
    );
    if (!hasUniversal) {
      content.faq.push(FAQ_UNIVERSAL);
    }
  }
  update.run(JSON.stringify(content), slug);
  return true;
}

// ─── 1. GŁÓWNE KATEGORIE TARNOBRZEG ─────────────────────────────────────────

let updated = 0;

for (const [slug, wstep] of Object.entries(WSTEP)) {
  const ok = patchPage(slug, {
    wstep,
    dlaczego_warto: DLACZEGO_WARTO,
    obszar_dzialania: OBSZAR_PL
  });
  if (ok) { updated++; console.log('✓', slug); }
}

// ─── 2. STARE PODSTRONY xxx-tarnobrzeg ───────────────────────────────────────

for (const [slug, wstep] of Object.entries(WSTEP_OLD)) {
  const ok = patchPage(slug, {
    wstep,
    dlaczego_warto: DLACZEGO_WARTO,
    obszar_dzialania: OBSZAR_PL
  });
  if (ok) { updated++; console.log('✓', slug); }
}

// ─── 3. PODSTRONY POZIOMU 3 (tarnobrzeg/*/*) ─────────────────────────────────

const subpages = db.prepare("SELECT slug, h1, title FROM pages WHERE slug LIKE 'tarnobrzeg/%/%'").all();
for (const p of subpages) {
  const ok = patchPage(p.slug, {
    wstep: generateWstepSub(p.h1, p.title),
    obszar_dzialania: OBSZAR_PL
  });
  if (ok) { updated++; console.log('✓', p.slug); }
}

// ─── 4. STRONY MIAST (/:miasto/:usluga) ──────────────────────────────────────

const cityPages = db.prepare(
  "SELECT slug, h1, title FROM pages WHERE slug LIKE '%/%' AND slug NOT LIKE 'tarnobrzeg/%'"
).all();
for (const p of cityPages) {
  const parts = p.slug.split('/');
  if (parts.length !== 2) continue;
  const miasto = parts[0];
  const obszar = OBSZAR_CITIES[miasto] || OBSZAR_PL;
  const ok = patchPage(p.slug, {
    wstep: generateWstepCity(p.slug, p.h1),
    dlaczego_warto: DLACZEGO_WARTO,
    obszar_dzialania: obszar
  });
  if (ok) { updated++; console.log('✓', p.slug); }
}

db.close();
console.log(`\nZaktualizowano ${updated} stron.`);
