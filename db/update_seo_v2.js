'use strict';
/**
 * SEO Content Update v2
 * Strategia: programmatic-seo (Location Pages) + seo-audit (heading hierarchy)
 *
 * Zasady:
 * - H1: "[Usługa] [Miasto]" — krótkie, exact-match keyword
 * - H2: opisy sekcji z lokalnymi frazami
 * - Tarnobrzeg sub-pages: TYLKO Tarnobrzeg, bez innych miast
 * - Tarnobrzeg category pages: Tarnobrzeg + region (OK bo to hub)
 * - Inne miasta: dopasowane do danej lokalizacji
 */

const { getDb } = require('./init');
const db = getDb();
const updatePage = db.prepare('UPDATE pages SET h1=?, meta_description=?, content_json=? WHERE slug=?');
const updateContent = db.prepare('UPDATE pages SET content_json=? WHERE slug=?');

function patch(slug, h1, meta, contentPatch) {
  const row = db.prepare('SELECT h1, meta_description, content_json FROM pages WHERE slug=?').get(slug);
  if (!row) { console.log('SKIP (not found):', slug); return; }
  let c; try { c = JSON.parse(row.content_json || '{}'); } catch(e) { c = {}; }
  Object.assign(c, contentPatch);
  updatePage.run(h1 || row.h1, meta || row.meta_description, JSON.stringify(c), slug);
  console.log('OK', slug);
}

function patchContentOnly(slug, contentPatch) {
  const row = db.prepare('SELECT content_json FROM pages WHERE slug=?').get(slug);
  if (!row) { console.log('SKIP:', slug); return; }
  let c; try { c = JSON.parse(row.content_json || '{}'); } catch(e) { c = {}; }
  Object.assign(c, contentPatch);
  updateContent.run(JSON.stringify(c), slug);
  console.log('OK', slug);
}

// ════════════════════════════════════════════════════════════════════════════
// 1. GŁÓWNE KATEGORIE TARNOBRZEG — hub pages
//    H1: "Usługa Tarnobrzeg" | H2 sekcje z frazami lokalnymi
//    obszar: Tarnobrzeg + cały region (hub może promować zasięg)
// ════════════════════════════════════════════════════════════════════════════

patch('tarnobrzeg/strony-internetowe',
  'Strony internetowe Tarnobrzeg',
  'Profesjonalne strony internetowe dla firm z Tarnobrzegu. Projekt, SEO on-page, responsywność i szybkość. Bezpłatna konsultacja — Halo, agencja cyfrowa z Tarnobrzegu.',
  {
    h2_wstep: 'Strony internetowe dla firm z Tarnobrzegu — czemu to ważne?',
    wstep: 'Strony internetowe Tarnobrzeg to usługa dla lokalnych firm, które chcą zdobywać klientów z Google i budować wiarygodną obecność w internecie. Tworzymy strony internetowe dla firm z Tarnobrzegu od podstaw — projekt graficzny, responsywny kod, optymalizację pod Google i wdrożenie narzędzi analitycznych. Każda strona działa jak cyfrowy handlowiec dostępny całą dobę.\nDziałamy lokalnie, dlatego rozumiemy potrzeby tarnobrzeskich firm. Wiemy, że klienci szukający strony internetowej w Tarnobrzegu potrzebują szybkiego kontaktu, konkretnej oferty i gwarancji efektów. Dlatego przed każdym projektem przeprowadzamy bezpłatną konsultację, by dopasować zakres pracy do celów i budżetu.\nStrony internetowe w Tarnobrzegu, które tworzymy, są zoptymalizowane pod lokalne frazy kluczowe — takie jak „firma Tarnobrzeg", „[branża] Tarnobrzeg" czy „[usługa] Tarnobrzeg". Dzięki temu Twoja firma pojawia się wyżej w Google, kiedy potencjalny klient szuka oferty w tym mieście.',
    h2_dla_kogo: 'Dla kogo tworzymy strony internetowe w Tarnobrzegu?',
    dla_kogo: 'Dla firm usługowych, gabinetów, zakładów, sklepów i przedsiębiorców B2B z Tarnobrzegu, którzy chcą zastąpić przestarzałą stronę nowoczesną lub zaczynają budować swoją obecność w internecie od zera.',
    h2_zakres: 'Co obejmuje projekt strony internetowej w Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki nowej stronie?',
    h2_dlaczego: 'Dlaczego strony internetowe warto zamówić w Halo Tarnobrzeg?',
    dlaczego_warto: 'Halo to agencja cyfrowa z Tarnobrzegu — nie pracujemy na gotowych szablonach i nie zlecamy projektów za granicę. Każda strona internetowa dla firmy z Tarnobrzegu jest projektowana od podstaw z uwzględnieniem lokalnego rynku, branży i grupy docelowej. W cenie każdego projektu uwzględniamy SEO on-page, konfigurację Google Analytics 4 i Google Search Console oraz szkolenie z obsługi panelu. Mamy na koncie ponad 480 realizacji i 18 lat pracy w marketingu cyfrowym.',
    h2_obszar: 'Obszar działania — strony internetowe Tarnobrzeg i region',
    obszar_dzialania: 'Tworzymy strony internetowe przede wszystkim dla firm z Tarnobrzegu. Jako lokalna agencja cyfrowa działamy też na terenie całego regionu — obsługujemy firmy z Sandomierza, Stalowej Woli, Nowej Dęby, Mielca i Baranowa Sandomierskiego. Spotkania stacjonarne prowadzimy w Tarnobrzegu, projekty dla firm z regionu realizujemy zdalnie.',
    h2_faq: 'Często zadawane pytania — strony internetowe Tarnobrzeg',
    faq: [
      { pytanie: 'Ile kosztuje strona internetowa dla firmy z Tarnobrzegu?', odpowiedz: 'Koszt zależy od zakresu — prosta strona wizytówkowa zaczyna się od 2 000 zł netto, strona firmowa z rozbudowanym contentem i SEO to zazwyczaj 4 000–8 000 zł. Dokładną wycenę przygotowujemy po bezpłatnej konsultacji.' },
      { pytanie: 'Jak długo trwa realizacja strony internetowej?', odpowiedz: 'Standardowo 3–5 tygodni od zebrania wszystkich materiałów. Przy mniejszych projektach możliwe jest szybsze wdrożenie — ustalamy termin indywidualnie.' },
      { pytanie: 'Czy strona będzie zoptymalizowana pod lokalne SEO w Tarnobrzegu?', odpowiedz: 'Tak. Każda strona, którą tworzymy dla firm z Tarnobrzegu, jest optymalizowana pod lokalne frazy kluczowe — nagłówki H1/H2/H3, meta tagi, struktury URL i treść dostosowujemy do wyszukiwań lokalnych.' },
      { pytanie: 'Czy mogę samodzielnie aktualizować treści po oddaniu strony?', odpowiedz: 'Tak. Dostarczamy strony z panelem administracyjnym — możesz edytować teksty, dodawać zdjęcia i zarządzać treściami bez wiedzy technicznej.' },
      { pytanie: 'Czy obsługujecie firmy spoza Tarnobrzegu?', odpowiedz: 'Tak — realizujemy projekty dla firm z całego regionu podkarpackiego: Sandomierza, Stalowej Woli, Mielca, Nowej Dęby i okolic. Projekty zdalne działają równie sprawnie.' }
    ]
  }
);

patch('tarnobrzeg/seo',
  'Pozycjonowanie lokalne SEO Tarnobrzeg',
  'Pozycjonowanie lokalne SEO dla firm z Tarnobrzegu. Audyt, Google Business Profile, optymalizacja techniczna i treści SEO. Bezpłatna konsultacja — Halo.',
  {
    h2_wstep: 'SEO lokalne w Tarnobrzegu — jak zdobywamy dla Ciebie klientów z Google?',
    wstep: 'Pozycjonowanie lokalne SEO Tarnobrzeg to usługa dla firm, które chcą pojawiać się w Google na frazy takie jak „[usługa] Tarnobrzeg" i zdobywać klientów organicznie — bez płacenia za każde kliknięcie w reklamę. Lokalne SEO różni się od ogólnego — skupia się na widoczności w konkretnym mieście i optymalizacji wizytówki Google Maps.\nTarnobrzeg to miasto, gdzie lokalna konkurencja w Google jest wciąż niższa niż w dużych aglomeracjach, co oznacza realne szanse na top 3 wyników dla firm z wielu branż. Pomagamy wykorzystać ten potencjał przez audyt SEO, optymalizację techniczną strony, tworzenie treści i zarządzanie profilem Google Business.\nZa każdą kampanią SEO dla firm z Tarnobrzegu stoi konkretna analiza słów kluczowych, ocena konkurencji lokalnej i plan działań z mierzalnymi KPI. Działamy długoterminowo — SEO to inwestycja, która przynosi efekty przez miesiące i lata.',
    h2_dla_kogo: 'Dla kogo jest SEO lokalne w Tarnobrzegu?',
    dla_kogo: 'Dla firm z Tarnobrzegu, które chcą pojawiać się wysoko w Google na frazy lokalne i zdobywać klientów organicznie. Szczególnie polecamy firmom usługowym, gabinetom, sklepom i przedsiębiorcom, dla których klienci z okolicy są najważniejszą grupą docelową.',
    h2_zakres: 'Co obejmuje pozycjonowanie lokalne SEO w Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki SEO lokalnemu?',
    h2_dlaczego: 'Dlaczego SEO lokalne warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo to agencja SEO z Tarnobrzegu — znamy lokalny rynek, analizujemy konkurencję tarnobrzeską i dobieramy słowa kluczowe pod realne zapytania mieszkańców regionu. Nie sprzedajemy pakietów z góry — każda strategia SEO jest tworzona od zera po audycie strony i analizie konkurencji. Raportujemy miesięcznie: pozycje, ruch, konwersje. Efekty SEO dla firm z Tarnobrzegu widać po 2–4 miesiącach, pełne rezultaty po 6–9 miesiącach systematycznej pracy.',
    h2_obszar: 'Obszar działania — SEO Tarnobrzeg i region',
    obszar_dzialania: 'Prowadzimy pozycjonowanie lokalne przede wszystkim dla firm z Tarnobrzegu. Obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby, Mielca i Baranowa Sandomierskiego — dla każdego miasta tworzymy osobną strategię SEO dopasowaną do lokalnej konkurencji.',
    h2_faq: 'Często zadawane pytania — SEO lokalne Tarnobrzeg',
    faq: [
      { pytanie: 'Kiedy widać efekty pozycjonowania lokalnego w Tarnobrzegu?', odpowiedz: 'Pierwsze zmiany pozycji widać po 2–4 miesiącach. Stabilne efekty w top 3 Google dla fraz lokalnych zazwyczaj osiągamy po 6–9 miesiącach systematycznych działań.' },
      { pytanie: 'Ile kosztuje SEO lokalne dla firmy z Tarnobrzegu?', odpowiedz: 'Abonament SEO zaczyna się od 800 zł netto miesięcznie dla mniejszych projektów. Zakres i koszt ustalamy po bezpłatnym audycie strony i analizie konkurencji.' },
      { pytanie: 'Czym SEO lokalne różni się od standardowego pozycjonowania?', odpowiedz: 'SEO lokalne skupia się na widoczności w konkretnym mieście — optymalizuje Google Business Profile, targetuje frazy z nazwą miasta i buduje sygnały geograficzne, dzięki czemu Twoja firma pojawia się w wynikach dla wyszukiwań „[usługa] Tarnobrzeg".' },
      { pytanie: 'Czy zajmujecie się Google Business Profile (wizytówką Google Maps)?', odpowiedz: 'Tak. Optymalizacja Google Business Profile to jeden z kluczowych elementów SEO lokalnego — uzupełniamy dane, dodajemy zdjęcia, odpowiadamy na opinie i monitorujemy widoczność w Maps.' },
      { pytanie: 'Czy mogę zlecić SEO tylko dla jednej podstrony?', odpowiedz: 'Tak — możemy pozycjonować konkretne podstrony usługowe dla fraz lokalnych, np. „[usługa] Tarnobrzeg". Wycenę ustalamy indywidualnie.' }
    ]
  }
);

patch('tarnobrzeg/google-ads',
  'Google Ads Tarnobrzeg',
  'Kampanie Google Ads dla firm z Tarnobrzegu. Konfiguracja, optymalizacja, śledzenie konwersji i remarketing. Wyniki mierzone w ROAS — Halo, agencja Google Ads.',
  {
    h2_wstep: 'Google Ads Tarnobrzeg — reklamy, które przynoszą klientów lokalnych',
    wstep: 'Google Ads Tarnobrzeg to usługa dla firm, które chcą szybko dotrzeć do klientów szukających ich usług lub produktów w Google. W odróżnieniu od SEO, reklamy Google Ads działają od pierwszego dnia — wystarczy dobrze skonfigurowana kampania z precyzyjnym targetowaniem lokalnym.\nProwadząc Google Ads dla firm z Tarnobrzegu, stawiamy na jedno: mierzalny zwrot z budżetu reklamowego. Nie przepalamy pieniędzy na ogólne kliknięcia — każda kampania jest skierowana do ludzi w Tarnobrzegu i okolicach, którzy w tej chwili szukają dokładnie tego, co oferujesz.\nObsługujemy zarówno nowe konta Google Ads, jak i optymalizujemy istniejące kampanie, które nie przynoszą oczekiwanych wyników. Śledzimy konwersje, telefony i formularze — tak, żeby wiedzieć dokładnie, ile kosztuje jeden pozyskany klient z Tarnobrzegu.',
    h2_dla_kogo: 'Dla kogo są kampanie Google Ads w Tarnobrzegu?',
    dla_kogo: 'Dla firm z Tarnobrzegu, które chcą szybko pozyskiwać leady i mają określony budżet reklamowy. Idealne dla branż o wysokiej wartości pojedynczego klienta — usługi remontowe, medyczne, prawne, edukacyjne, gastronomia i handel lokalny.',
    h2_zakres: 'Co obejmuje obsługa Google Ads w Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu prowadząc Google Ads?',
    h2_dlaczego: 'Dlaczego Google Ads warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo zarządza kampaniami Google Ads dla firm z Tarnobrzegu z naciskiem na ROAS — stosunek przychodu do wydatków reklamowych. Konfigurujemy śledzenie konwersji, testujemy kreacje reklamowe i tygodniowo optymalizujemy stawki. Raportujemy wyniki w czytelnych dashboardach: liczba kliknięć, konwersji, koszt leada i ROAS. Minimalny budżet reklamowy rekomendowany dla Tarnobrzegu to 600–1 000 zł/mies.',
    h2_obszar: 'Obszar działania — Google Ads Tarnobrzeg i region',
    obszar_dzialania: 'Ustawiamy kampanie Google Ads z targetowaniem na Tarnobrzeg i region — można precyzyjnie wybrać promień od centrum miasta lub konkretne miejscowości. Obsługujemy firmy z Tarnobrzegu, Sandomierza, Stalowej Woli, Nowej Dęby i Mielca.',
    h2_faq: 'Często zadawane pytania — Google Ads Tarnobrzeg',
    faq: [
      { pytanie: 'Ile kosztuje Google Ads dla firmy z Tarnobrzegu?', odpowiedz: 'Budżet reklamowy i opłata za zarządzanie to dwie osobne kwoty. Dla lokalnych firm z Tarnobrzegu rekomendujemy budżet reklamowy 600–1 500 zł/mies. Opłata za zarządzanie zależy od zakresu kampanii — ustalamy ją indywidualnie po bezpłatnej konsultacji.' },
      { pytanie: 'Jak szybko widać efekty kampanii Google Ads?', odpowiedz: 'Pierwsze kliknięcia i zapytania pojawiają się zazwyczaj w ciągu 24–48 godzin od uruchomienia kampanii. Optymalizacja i pełne efekty budują się przez pierwsze 2–4 tygodnie.' },
      { pytanie: 'Czy kampanię można targetować tylko na Tarnobrzeg?', odpowiedz: 'Tak. Ustawiamy precyzyjne targetowanie geograficzne — możemy ograniczyć wyświetlanie reklam do samego Tarnobrzegu, wybranego promienia lub konkretnych miejscowości w regionie.' },
      { pytanie: 'Jak mierzycie skuteczność kampanii Google Ads?', odpowiedz: 'Konfigurujemy śledzenie formularzy, połączeń telefonicznych, kliknięć w CTA i innych działań na stronie. Na tej podstawie liczymy koszt leada i ROAS, które pokazujemy w miesięcznym raporcie.' }
    ]
  }
);

patch('tarnobrzeg/grafika-reklamowa',
  'Grafika reklamowa i branding Tarnobrzeg',
  'Grafika reklamowa, logo i identyfikacja wizualna dla firm z Tarnobrzegu. Bannery, social media, ulotki i brandbook. Wycena indywidualna — Halo.',
  {
    h2_wstep: 'Grafika reklamowa i branding dla firm z Tarnobrzegu',
    wstep: 'Grafika reklamowa Tarnobrzeg to usługa dla firm, które chcą wyglądać profesjonalnie we wszystkich kanałach — w internecie, mediach społecznościowych i materiałach drukowanych. Tworzymy identyfikację wizualną od podstaw lub rozwijamy istniejące materiały graficzne dla firm z Tarnobrzegu.\nSpójny branding to jeden z najważniejszych czynników budujących zaufanie klientów. Firmy z Tarnobrzegu, które wyglądają profesjonalnie w każdym punkcie kontaktu, częściej konwertują odwiedzających na kupujących. Dlatego każdy projekt graficzny zaczynamy od analizy marki, branży i grupy docelowej.\nOferujemy kompleksową grafikę reklamową dla firm z Tarnobrzegu — od logotypu, przez bannery Google Display i grafiki social media, po ulotki, roll-upy i pełny brandbook. Wszystkie materiały dostarczamy w formatach do druku i online.',
    h2_dla_kogo: 'Dla kogo jest grafika reklamowa w Tarnobrzegu?',
    dla_kogo: 'Dla firm z Tarnobrzegu budujących lub odświeżających swój wizerunek. Szczególnie dla nowych marek szukających pierwszego logo i identyfikacji wizualnej oraz dla firm, które chcą ujednolicić komunikację wizualną we wszystkich kanałach.',
    h2_zakres: 'Co obejmuje grafika reklamowa i branding w Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki profesjonalnej grafice?',
    h2_dlaczego: 'Dlaczego grafikę reklamową warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo to agencja kreatywna z Tarnobrzegu — projektujemy grafiki spójne ze strategią marki i dopasowane do lokalnych odbiorców. Każdy projekt realizujemy zgodnie z briefem graficznym, dostarczamy pliki w formatach AI/PDF do druku i PNG/SVG/WebP do użytku online. Oferujemy nieograniczone poprawki w ramach ustalonego zakresu projektu.',
    h2_obszar: 'Obszar działania — grafika reklamowa Tarnobrzeg i region',
    obszar_dzialania: 'Tworzymy grafikę reklamową i branding dla firm z Tarnobrzegu. Obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby, Mielca i całego regionu podkarpackiego — projekty graficzne realizujemy w pełni zdalnie.',
    h2_faq: 'Często zadawane pytania — grafika reklamowa Tarnobrzeg',
    faq: [
      { pytanie: 'Ile kosztuje logo i identyfikacja wizualna dla firmy z Tarnobrzegu?', odpowiedz: 'Projekt logotypu z podstawową identyfikacją wizualną (paleta kolorów, typografia, wizytówki) zaczyna się od 1 500 zł netto. Pełny brandbook to zazwyczaj 3 000–6 000 zł. Dokładną wycenę przygotowujemy po omówieniu zakresu.' },
      { pytanie: 'W jakich formatach dostarczacie pliki graficzne?', odpowiedz: 'Dostarczamy pliki w formatach AI i PDF do druku (wektory) oraz PNG, SVG i WebP do użytku online. Możemy też przygotować pliki pod konkretne drukarnie lub narzędzia online.' },
      { pytanie: 'Czy mogę zamówić samo logo bez pełnego brandingu?', odpowiedz: 'Tak — realizujemy zarówno kompleksowe projekty identyfikacji wizualnej, jak i pojedyncze elementy: logotyp, bannery, szablony social media lub ulotki.' },
      { pytanie: 'Jak wygląda proces projektowania grafiki?', odpowiedz: 'Zaczynamy od briefu graficznego (cele, branża, styl, inspiracje). Prezentujemy 2–3 koncepcje do wyboru, następnie dopracowujemy wybrany kierunek z poprawkami. Finalny projekt dostarczamy w pełnym pakiecie plików.' }
    ]
  }
);

patch('tarnobrzeg/automatyzacje',
  'Automatyzacje firmowe Tarnobrzeg',
  'Automatyzacje procesów biznesowych dla firm z Tarnobrzegu. Make, Zapier, chatboty AI, CRM i follow-up. Oszczędzaj czas i obsługuj więcej klientów — Halo.',
  {
    h2_wstep: 'Automatyzacje firmowe Tarnobrzeg — czas to pieniądz',
    wstep: 'Automatyzacje firmowe Tarnobrzeg to usługa dla przedsiębiorców, którzy tracą godziny na powtarzalne zadania — wysyłanie ofert, odpowiadanie na zapytania, ręczne przenoszenie danych między systemami. Budujemy automatyzacje, które przejmują te zadania i działają 24/7 bez udziału pracownika.\nFirmy z Tarnobrzegu, które korzystają z automatyzacji procesów, obsługują więcej klientów bez zwiększania zatrudnienia. Automatyczne follow-upy po formularzu kontaktowym zwiększają konwersję o 20–40% — klient nie musi czekać na Twoją odpowiedź, bo dostaje ją od razu. Chatbot AI odpowiada na typowe pytania poza godzinami pracy.\nBudujemy automatyzacje w Make (dawniej Integromat), Zapier i innych narzędziach No-Code. Integrujemy systemy CRM, sklepy internetowe, formularze, e-mail, SMS i aplikacje firmowe. Każdy system oddajemy z dokumentacją i szkoleniem.',
    h2_dla_kogo: 'Dla kogo są automatyzacje firmowe w Tarnobrzegu?',
    dla_kogo: 'Dla właścicieli firm z Tarnobrzegu, którzy tracą czas na powtarzalne zadania i chcą skalować biznes bez zatrudniania kolejnych pracowników. Idealne dla firm usługowych, gabinetów, sklepów i wszystkich, kto obsługuje dużo zapytań online.',
    h2_zakres: 'Co obejmuje automatyzacja procesów firmowych w Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki automatyzacjom?',
    h2_dlaczego: 'Dlaczego automatyzacje firmowe warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo to agencja automatyzacji z Tarnobrzegu — każdy system budujemy pod konkretny problem biznesowy, nie na pokaz. Zaczynamy od audytu procesów, identyfikujemy, co można zautomatyzować i szacujemy oszczędność czasu w roboczogodzinach. Dokumentujemy wszystkie wdrożone przepływy i szkolimy Twój zespół. Automatyzacje utrzymujemy i aktualizujemy.',
    h2_obszar: 'Obszar działania — automatyzacje Tarnobrzeg i region',
    obszar_dzialania: 'Wdrażamy automatyzacje dla firm z Tarnobrzegu. Projekty realizujemy zdalnie — obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby i Mielca bez konieczności spotkań stacjonarnych.',
    h2_faq: 'Często zadawane pytania — automatyzacje firmowe Tarnobrzeg',
    faq: [
      { pytanie: 'Od czego zacząć automatyzację w firmie z Tarnobrzegu?', odpowiedz: 'Od bezpłatnego audytu procesów — rozmawiamy o tym, co zajmuje Ci najwięcej czasu, i identyfikujemy, które zadania można zautomatyzować w pierwszej kolejności, by jak najszybciej odczuć efekty.' },
      { pytanie: 'Czy potrzebuję wiedzy technicznej do obsługi automatyzacji?', odpowiedz: 'Nie. Budujemy systemy z myślą o prostocie obsługi i zawsze szkolimy z ich użytkowania. Dokumentujemy każdy przepływ, żebyś mógł samodzielnie wprowadzać drobne zmiany.' },
      { pytanie: 'Jakie systemy integrujecie?', odpowiedz: 'Integrujemy większość popularnych narzędzi biznesowych: systemy CRM (HubSpot, Pipedrive, Salesforce), platformy e-mail (Mailchimp, ActiveCampaign, Brevo), formularze, sklepy internetowe, systemy fakturowania i aplikacje Google Workspace.' },
      { pytanie: 'Ile kosztuje wdrożenie automatyzacji?', odpowiedz: 'Prosty przepływ (np. automatyczny follow-up po formularzu) zaczyna się od 800 zł netto. Złożone systemy integrujące kilka narzędzi wyceniamy indywidualnie po audycie procesów.' }
    ]
  }
);

patch('tarnobrzeg/marketing-internetowy',
  'Marketing internetowy Tarnobrzeg',
  'Marketing internetowy dla firm z Tarnobrzegu — Google Ads, Meta Ads, SEO, social media i content marketing. Kompleksowa obsługa — Halo.',
  {
    h2_wstep: 'Marketing internetowy Tarnobrzeg — kompleksowe działania dla lokalnych firm',
    wstep: 'Marketing internetowy Tarnobrzeg to kompleksowa usługa dla firm, które chcą budować widoczność online i pozyskiwać klientów przez wiele kanałów jednocześnie. Łączymy Google Ads, Meta Ads, SEO, social media i content marketing w spójną strategię dopasowaną do celów i budżetu firmy z Tarnobrzegu.\nLokalny marketing internetowy różni się od ogólnego — skupia się na docieraniu do klientów z Tarnobrzegu i regionu, budowaniu rozpoznawalności w mieście i konwertowaniu ruchu lokalnego na zapytania. Znamy tarnobrzeski rynek, jego sezonowość i specyfikę lokalnych odbiorców.\nJako agencja marketingu internetowego z Tarnobrzegu zarządzamy kampaniami reklamowymi, tworzymy treści, prowadzimy social media i analizujemy wyniki. Pracujemy w cyklu miesięcznym — raportujemy efekty i optymalizujemy działania na podstawie danych.',
    h2_dla_kogo: 'Dla kogo jest marketing internetowy w Tarnobrzegu?',
    dla_kogo: 'Dla firm z Tarnobrzegu, które chcą działać w wielu kanałach online jednocześnie lub szukają partnera do kompleksowej obsługi marketingowej. Idealne dla firm, które nie mają własnego działu marketingu i potrzebują zewnętrznego zespołu.',
    h2_zakres: 'Co obejmuje marketing internetowy dla firm z Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki kompleksowemu marketingowi?',
    h2_dlaczego: 'Dlaczego marketing internetowy warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo to agencja marketingu internetowego z Tarnobrzegu. Nie sprzedajemy pakietów z góry — każdą strategię tworzymy od zera po audycie aktualnych działań i ustaleniu celów. Pracujemy transparentnie: raportujemy co miesiąc, co działa, a co wymaga korekty. Nasi klienci z Tarnobrzegu płacą za efekty, nie za obecność agencji.',
    h2_obszar: 'Obszar działania — marketing internetowy Tarnobrzeg i region',
    obszar_dzialania: 'Prowadzimy marketing internetowy dla firm z Tarnobrzegu. Obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby, Mielca i całego regionu podkarpackiego — działania realizujemy zdalnie, wyniki mierzymy narzędziami analitycznymi.',
    h2_faq: 'Często zadawane pytania — marketing internetowy Tarnobrzeg',
    faq: [
      { pytanie: 'Od czego zacząć marketing internetowy dla firmy z Tarnobrzegu?', odpowiedz: 'Od bezpłatnego audytu obecnych działań i ustalenia celów — co chcesz osiągnąć w ciągu 3 i 12 miesięcy. Na tej podstawie dobieramy kanały i budujemy plan działań z priorytetami.' },
      { pytanie: 'Czy mogę zlecić tylko jeden kanał, np. tylko Google Ads?', odpowiedz: 'Tak — możemy obsługiwać pojedyncze kanały lub całe portfolio działań marketingowych. Elastycznie dopasowujemy zakres do potrzeb i budżetu.' },
      { pytanie: 'Jak mierzycie wyniki marketingu internetowego?', odpowiedz: 'Konfigurujemy pełne śledzenie konwersji w GA4 i pikselach reklamowych. Co miesiąc dostarczamy raport z kluczowymi wskaźnikami: ruchem, konwersjami, kosztem leada i ROAS dla kampanii płatnych.' },
      { pytanie: 'Ile kosztuje kompleksowa obsługa marketingowa w Tarnobrzegu?', odpowiedz: 'Abonament za zarządzanie kampaniami zaczyna się od 1 200 zł netto miesięcznie (bez budżetu reklamowego). Zakres i koszt ustalamy po audycie i omówieniu celów.' }
    ]
  }
);

patch('tarnobrzeg/social-media',
  'Social media Tarnobrzeg',
  'Prowadzenie social mediów dla firm z Tarnobrzegu — Facebook, Instagram, TikTok, LinkedIn. Posty, grafiki, kampanie reklamowe. Halo — agencja social media.',
  {
    h2_wstep: 'Social media Tarnobrzeg — jak budujemy zasięgi i klientów dla lokalnych firm?',
    wstep: 'Social media Tarnobrzeg to usługa dla firm, które chcą być widoczne na Facebooku, Instagramie, TikToku i LinkedIn. Prowadzimy profile firmowe — tworzymy treści, publikujemy posty, zarządzamy kampaniami reklamowymi i budujemy zaangażowaną społeczność wokół marki z Tarnobrzegu.\nLokalny rynek social media w Tarnobrzegu rządzi się swoimi prawami — inne treści angażują mieszkańców miasta niż te produkowane dla ogólnopolskiej publiczności. Znamy specyfikę tarnobrzeskiej społeczności online i wiemy, jakie komunikaty trafiają do lokalnych odbiorców.\nNie robimy postów dla postów — każdy element social media ma mieć cel: budować zasięgi organiczne, pozyskiwać obserwujących lub konwertować na klientów. Prowadzimy profile z miesięcznym harmonogramem, raportujemy wyniki i regularnie testujemy nowe formaty.',
    h2_dla_kogo: 'Dla kogo jest prowadzenie social mediów w Tarnobrzegu?',
    dla_kogo: 'Dla firm z Tarnobrzegu, które chcą zbudować aktywną obecność w mediach społecznościowych, ale nie mają czasu ani zasobów do tworzenia regularnych treści. Szczególnie dla branż opartych na lokalnej rozpoznawalności: gastronomia, handel, usługi beauty, sport i rekreacja.',
    h2_zakres: 'Co obejmuje prowadzenie social mediów dla firm z Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki profesjonalnemu social media?',
    h2_dlaczego: 'Dlaczego social media warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo to agencja social media z Tarnobrzegu — tworzymy treści dopasowane do lokalnej publiczności, nie powielamy ogólnych szablonów. Każdy post, grafika i kampania reklamowa są tworzone pod konkretny cel: zasięg, zaangażowanie lub konwersję. Raportujemy wyniki co miesiąc i na bieżąco optymalizujemy strategię contentową.',
    h2_obszar: 'Obszar działania — social media Tarnobrzeg',
    obszar_dzialania: 'Prowadzimy social media przede wszystkim dla firm z Tarnobrzegu. Obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby i Mielca — zarządzanie profilami i tworzenie treści realizujemy zdalnie.',
    h2_faq: 'Często zadawane pytania — social media Tarnobrzeg',
    faq: [
      { pytanie: 'Ile postów miesięcznie publikujecie w ramach obsługi social media?', odpowiedz: 'Standardowo 12–16 postów miesięcznie (3–4 tygodniowo) w zależności od wybranego pakietu i platformy. Harmonogram ustalamy z klientem na początku każdego miesiąca.' },
      { pytanie: 'Czy tworzycie też reklamy na Facebooku i Instagramie?', odpowiedz: 'Tak — zarządzamy kampaniami Meta Ads dla firm z Tarnobrzegu. Konfigurujemy targetowanie, tworzymy kreacje reklamowe i optymalizujemy kampanie pod kątem kosztu leada lub ROAS.' },
      { pytanie: 'Czy mogę zatwierdzać posty przed publikacją?', odpowiedz: 'Tak — standardowo udostępniamy miesięczny harmonogram treści do akceptacji. Możemy też ustawić tryb, w którym każdy post wymaga zatwierdzenia przed opublikowaniem.' },
      { pytanie: 'Ile kosztuje prowadzenie social mediów dla firmy z Tarnobrzegu?', odpowiedz: 'Podstawowy pakiet zarządzania profilem (1 platforma, 12 postów miesięcznie) zaczyna się od 800 zł netto. Kompleksowa obsługa kilku platform z kampaniami reklamowymi to zazwyczaj 1 500–3 000 zł/mies.' }
    ]
  }
);

patch('tarnobrzeg/content-marketing',
  'Content marketing Tarnobrzeg',
  'Content marketing dla firm z Tarnobrzegu — artykuły SEO, teksty usługowe, opisy produktów i newslettery. Treści pod lokalne frazy — Halo.',
  {
    h2_wstep: 'Content marketing Tarnobrzeg — treści, które pracują na Twój biznes',
    wstep: 'Content marketing Tarnobrzeg to usługa dla firm, które chcą budować widoczność w Google i zaufanie odbiorców poprzez wartościowe treści. Tworzymy artykuły blogowe, teksty na strony usługowe, opisy produktów i kategorii, newslettery oraz inne materiały contentowe dla firm z Tarnobrzegu.\nTreści, które piszemy dla firm z Tarnobrzegu, są zawsze zoptymalizowane pod lokalne frazy kluczowe — uwzględniają nazwę miasta, specyfikę lokalnego rynku i intencje użytkowników wpisujących frazy z lokalizacją. Dzięki temu artykuły i podstrony usługowe pojawiają się wyżej w Google dla zapytań lokalnych.\nContent marketing jest długoterminową inwestycją — artykuł napisany dzisiaj może generować ruch i zapytania przez kolejne 2–3 lata. Dla firm z Tarnobrzegu to szczególnie efektywna strategia, bo lokalna konkurencja w contencie jest wciąż stosunkowo niska.',
    h2_dla_kogo: 'Dla kogo jest content marketing w Tarnobrzegu?',
    dla_kogo: 'Dla firm z Tarnobrzegu, które chcą przyciągać klientów wartościowymi treściami i budować autorytet w swojej branży na rynku lokalnym. Szczególnie polecane firmom usługowym, gabineciom i specjalistom, którzy mogą edukować swoich klientów przez treści.',
    h2_zakres: 'Co obejmuje content marketing dla firm z Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki content marketingowi?',
    h2_dlaczego: 'Dlaczego content marketing warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo to agencja content marketingu z Tarnobrzegu — każdy tekst piszemy pod konkretną frazę lokalną, intencję użytkownika i etap lejka zakupowego. Nie generujemy treści AI bez kontroli — każdy tekst przechodzi redakcję i optymalizację SEO. Mamy doświadczenie w tworzeniu contentu dla różnych branż działających w Tarnobrzegu i regionie.',
    h2_obszar: 'Obszar działania — content marketing Tarnobrzeg i region',
    obszar_dzialania: 'Tworzymy treści marketingowe dla firm z Tarnobrzegu, dopasowane do lokalnego rynku i fraz dla miasta. Obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby i Mielca — treści optymalizujemy pod konkretną lokalizację.',
    h2_faq: 'Często zadawane pytania — content marketing Tarnobrzeg',
    faq: [
      { pytanie: 'Jak długi powinien być artykuł SEO dla firmy z Tarnobrzegu?', odpowiedz: 'Optymalna długość zależy od frazy i konkurencji — zazwyczaj 800–1 500 słów dla artykułów blogowych i 400–800 słów dla podstron usługowych. Analizujemy TOP 10 wyników w Google, żeby dopasować długość i strukturę treści.' },
      { pytanie: 'Jak szybko artykuły zaczynają pozycjonować się w Google?', odpowiedz: 'Pierwsze indeksowanie zazwyczaj po 1–2 tygodniach. Stabilne pozycje na frazy lokalne dla Tarnobrzegu budują się przez 2–6 miesięcy w zależności od konkurencji i autorytetu domeny.' },
      { pytanie: 'Czy piszecie teksty na strony usługowe w języku polskim?', odpowiedz: 'Tak — piszemy teksty wyłącznie po polsku, z naturalnym uwzględnieniem lokalnych fraz dla Tarnobrzegu. Dbamy o jakość językową i styl dopasowany do branży i grupy docelowej.' },
      { pytanie: 'Czy możecie przejąć istniejący blog firmowy?', odpowiedz: 'Tak — audytujemy istniejące treści, optymalizujemy najlepsze artykuły i planujemy nowe publikacje dopasowane do strategii SEO i celów firmy.' }
    ]
  }
);

patch('tarnobrzeg/analityka-doradztwo',
  'Analityka i doradztwo marketingowe Tarnobrzeg',
  'Analityka marketingowa i doradztwo strategiczne dla firm z Tarnobrzegu. GA4, GTM, śledzenie konwersji, audyty i raporty z rekomendacjami — Halo.',
  {
    h2_wstep: 'Analityka i doradztwo marketingowe Tarnobrzeg — decyzje oparte na danych',
    wstep: 'Analityka i doradztwo marketingowe Tarnobrzeg to usługa dla firm, które chcą podejmować decyzje marketingowe oparte na danych, a nie przeczuciach. Konfigurujemy narzędzia analityczne, interpretujemy wyniki i dostarczamy rekomendacje dopasowane do celów firmy z Tarnobrzegu.\nWiele firm z Tarnobrzegu inwestuje w marketing, nie wiedząc, które działania przynoszą faktyczne efekty. Analityka marketingowa to odpowiedź na to wyzwanie — po skonfigurowaniu śledzenia konwersji możesz zobaczyć dokładnie, które kampanie, kanały i podstrony generują leady i sprzedaż.\nOferujemy konfigurację Google Analytics 4, Google Tag Manager, pikseli reklamowych i systemów CRM, a także doradztwo strategiczne — pomoc w planowaniu budżetów, wyborze kanałów i ocenie efektywności poszczególnych działań marketingowych.',
    h2_dla_kogo: 'Dla kogo jest analityka marketingowa w Tarnobrzegu?',
    dla_kogo: 'Dla właścicieli firm i managerów marketingu z Tarnobrzegu, którzy chcą lepiej rozumieć skąd przychodzą klienci, jak zachowują się na stronie i które działania marketingowe przynoszą największy zwrot z inwestycji.',
    h2_zakres: 'Co obejmuje analityka i doradztwo marketingowe w Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki analityce marketingowej?',
    h2_dlaczego: 'Dlaczego analitykę marketingową warto zlecić Halo w Tarnobrzegu?',
    dlaczego_warto: 'Halo to agencja analityczna i doradcza z Tarnobrzegu — nie dostarczamy raportów dla samych raportów. Każda analiza kończy się konkretnymi rekomendacjami: co wzmocnić, co wyłączyć, na czym skupić budżet. Mamy doświadczenie w konfiguracji GA4 i GTM dla firm z różnych branż działających w Tarnobrzegu i regionie.',
    h2_obszar: 'Obszar działania — analityka Tarnobrzeg i region',
    obszar_dzialania: 'Świadczymy usługi analityki i doradztwa marketingowego dla firm z Tarnobrzegu. Obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby i Mielca — konfigurację narzędzi i konsultacje realizujemy zdalnie.',
    h2_faq: 'Często zadawane pytania — analityka marketingowa Tarnobrzeg',
    faq: [
      { pytanie: 'Czym różni się GA4 od Universal Analytics?', odpowiedz: 'Google Analytics 4 to nowa wersja platformy analitycznej Google, oparta na modelu zdarzeń zamiast sesji. Lepiej śledzi ścieżki użytkowników, integruje dane z aplikacji mobilnych i jest przygotowana na świat bez ciasteczek. Universal Analytics przestał zbierać dane w lipcu 2023.' },
      { pytanie: 'Czy konfiguracja Google Tag Manager jest konieczna?', odpowiedz: 'GTM znacznie ułatwia zarządzanie tagami analitycznymi i reklamowymi bez ingerencji programistycznej. Rekomendujemy go wszystkim firmom z Tarnobrzegu prowadzącym kampanie reklamowe i chcącym śledzić konwersje.' },
      { pytanie: 'Ile kosztuje audyt działań marketingowych?', odpowiedz: 'Jednorazowy audyt marketingowy dla firm z Tarnobrzegu zaczyna się od 1 000 zł netto. Obejmuje analizę strony, aktualnych kampanii, śledzenia konwersji i dostarczenie raportu z rekomendacjami.' },
      { pytanie: 'Czy oferujecie konsultacje godzinowe?', odpowiedz: 'Tak — oferujemy konsultacje marketingowe online lub stacjonarne w Tarnobrzegu. Stawka za konsultację godzinową to 250 zł netto. Można umówić pakiet konsultacji ze zniżką.' }
    ]
  }
);

patch('tarnobrzeg/sklep-internetowy',
  'Sklep internetowy Tarnobrzeg',
  'Sklep internetowy dla firm z Tarnobrzegu — WooCommerce, PrestaShop, projekt, SEO i marketing e-commerce. Wycena indywidualna — Halo.',
  {
    h2_wstep: 'Sklep internetowy Tarnobrzeg — sprzedawaj online lokalnie i w całej Polsce',
    wstep: 'Sklep internetowy Tarnobrzeg to usługa dla firm, które chcą sprzedawać swoje produkty online — zarówno klientom z Tarnobrzegu i okolic, jak i w całej Polsce. Projektujemy, wdrażamy i optymalizujemy sklepy internetowe WooCommerce i PrestaShop dla firm z Tarnobrzegu, dbając o UX, szybkość działania i widoczność w Google Shopping.\nTworzenie sklepu internetowego dla firmy z Tarnobrzegu to nie tylko kwestia techniczna — równie ważna jest strategia e-commerce: struktura kategorii, opis produktów zoptymalizowany pod SEO, ścieżka zakupowa i integracje z systemami płatności i logistyki. Nasze sklepy sprzedają od pierwszego dnia, nie tylko wyglądają profesjonalnie.\nDziałamy lokalnie, więc rozumiemy specyfikę handlu w regionie tarnobrzeskim — sezonowość, lokalną konkurencję i oczekiwania klientów z Podkarpacia. Każdy projekt e-commerce zaczynamy od analizy rynku i celów biznesowych.',
    h2_dla_kogo: 'Dla kogo jest sklep internetowy w Tarnobrzegu?',
    dla_kogo: 'Dla firm z Tarnobrzegu, które chcą sprzedawać produkty online — zarówno starty od zera, jak i modernizacje istniejących sklepów. Szczególnie dla producentów, dystrybutorów, rzemieślników i małych sklepów stacjonarnych chcących rozszerzyć sprzedaż na internet.',
    h2_zakres: 'Co obejmuje wdrożenie sklepu internetowego w Tarnobrzegu?',
    h2_korzysci: 'Co zyskuje firma z Tarnobrzegu dzięki sklepowi internetowemu?',
    h2_dlaczego: 'Dlaczego sklep internetowy warto zamówić w Halo Tarnobrzeg?',
    dlaczego_warto: 'Halo to agencja e-commerce z Tarnobrzegu — wdrażamy sklepy z pełnym zakresem: projekt UX, kodowanie, konfiguracja płatności i wysyłek, import produktów i SEO e-commerce. Po uruchomieniu nie znikamy — oferujemy stałe wsparcie techniczne i marketing e-commerce. Mamy doświadczenie w sklepach WooCommerce i PrestaShop dla różnych branż.',
    h2_obszar: 'Obszar działania — sklepy internetowe Tarnobrzeg i region',
    obszar_dzialania: 'Wdrażamy sklepy internetowe przede wszystkim dla firm z Tarnobrzegu. Obsługujemy też firmy z Sandomierza, Stalowej Woli, Nowej Dęby, Mielca i całego regionu podkarpackiego — projekty e-commerce realizujemy w pełni zdalnie.',
    h2_faq: 'Często zadawane pytania — sklep internetowy Tarnobrzeg',
    faq: [
      { pytanie: 'Ile kosztuje sklep internetowy dla firmy z Tarnobrzegu?', odpowiedz: 'Prosty sklep WooCommerce do 100 produktów zaczyna się od 4 000 zł netto. Sklepy z rozbudowanym projektem UX, integracjami ERP i zaawansowanym SEO to zazwyczaj 8 000–20 000 zł. Dokładną wycenę przygotowujemy po omówieniu zakresu.' },
      { pytanie: 'WooCommerce czy PrestaShop — co wybrać dla firmy z Tarnobrzegu?', odpowiedz: 'WooCommerce jest prostszy w obsłudze i tańszy na start — polecamy dla sklepów do 500 produktów. PrestaShop lepiej sprawdza się dla dużych katalogów produktów i zaawansowanych potrzeb e-commerce. Doradzamy wybór po omówieniu celów.' },
      { pytanie: 'Czy sklep będzie widoczny w Google Shopping?', odpowiedz: 'Tak. Konfigurujemy feed produktowy w Google Merchant Center, co pozwala wyświetlać produkty w zakładce Google Shopping i kampaniach Performance Max.' },
      { pytanie: 'Jak długo trwa wdrożenie sklepu internetowego?', odpowiedz: 'Prosty sklep WooCommerce: 4–6 tygodni. Sklep z projektem UX i integracjami: 8–14 tygodni. Termin zależy od zakresu projektu i szybkości dostarczania materiałów.' }
    ]
  }
);

// ════════════════════════════════════════════════════════════════════════════
// 2. SUB-PAGES TARNOBRZEG — TYLKO TARNOBRZEG, bez innych miast
//    H1: "Pod-usługa Tarnobrzeg" (bez "w")
//    obszar: tylko Tarnobrzeg
// ════════════════════════════════════════════════════════════════════════════

const OBSZAR_TNB_ONLY = 'Świadczymy tę usługę dla firm działających na terenie Tarnobrzegu.';

const DLACZEGO_SUB = 'Halo to agencja cyfrowa z siedzibą w Tarnobrzegu. Znamy lokalny rynek, rozumiemy potrzeby tarnobrzeskich firm i działamy szybko. Każde zlecenie realizujemy z osobistym zaangażowaniem — bez pośredników i anonimowych zespołów. Mamy ponad 480 zrealizowanych projektów i 18 lat doświadczenia w branży cyfrowej.';

// Helper: aktualizacja H1 dla sub-stron (usuwa "w Tarnobrzegu" → "Tarnobrzeg")
function fixSubH1(currentH1) {
  if (!currentH1) return null;
  return currentH1
    .replace(/\n/g, ' ')
    .replace(/\s+w\s+Tarnobrzegu\s*$/i, ' Tarnobrzeg')
    .replace(/\s+Tarnobrzeg\s+Tarnobrzeg/i, ' Tarnobrzeg')
    .trim();
}

const subpages = db.prepare("SELECT slug, h1, title FROM pages WHERE slug LIKE 'tarnobrzeg/%/%'").all();

for (const p of subpages) {
  const newH1 = fixSubH1(p.h1);
  const slug = p.slug;
  const parts = slug.split('/');
  const serviceName = parts[1].replace(/-/g, ' ');
  const subName = parts[2].replace(/-/g, ' ');

  // Czysty tytuł do wstępu
  const cleanTitle = (newH1 || p.title)
    .replace(' Tarnobrzeg', '')
    .replace(' — Halo', '')
    .trim();

  const wstep = `${cleanTitle} to element naszej oferty w zakresie ${serviceName} dla firm z Tarnobrzegu. Realizujemy tę usługę kompleksowo — od planowania, przez wdrożenie, po optymalizację i raportowanie wyników. Każdy projekt dostosowujemy do specyfiki firmy, branży i lokalnego rynku w Tarnobrzegu.`;

  const h2_faq_label = `Pytania o ${cleanTitle.toLowerCase()} — Tarnobrzeg`;

  const row = db.prepare('SELECT h1, meta_description, content_json FROM pages WHERE slug=?').get(slug);
  if (!row) continue;
  let c; try { c = JSON.parse(row.content_json || '{}'); } catch(e) { c = {}; }

  // Update fields
  c.wstep = wstep;
  c.h2_wstep = `${cleanTitle} — jak to robimy w Tarnobrzegu?`;
  c.h2_opis = `Na czym polega ${cleanTitle.toLowerCase()} w Tarnobrzegu?`;
  c.h2_korzysci = `Co zyskuje Twoja firma z Tarnobrzegu?`;
  c.obszar_dzialania = OBSZAR_TNB_ONLY;
  c.h2_obszar = 'Gdzie działamy';
  c.h2_faq = h2_faq_label;

  // Augment FAQ — dodaj lokalne pytanie jeśli go nie ma
  if (!Array.isArray(c.faq)) c.faq = [];
  const hasLocal = c.faq.some(f => f.pytanie && f.pytanie.toLowerCase().includes('tarnobrzeg'));
  if (!hasLocal) {
    c.faq.push({
      pytanie: `Czy oferujecie ${cleanTitle.toLowerCase()} w całym Tarnobrzegu?`,
      odpowiedz: `Tak — realizujemy ${cleanTitle.toLowerCase()} dla firm z każdej części Tarnobrzegu. Skontaktuj się, żebyśmy mogli omówić zakres pracy i termin.`
    });
  }

  // Update H1 if needed
  const h1ToSave = newH1 || row.h1;
  updatePage.run(h1ToSave, row.meta_description, JSON.stringify(c), slug);
  console.log('SUB OK', slug);
}

// ════════════════════════════════════════════════════════════════════════════
// 3. INNE MIASTA /:miasto/:usluga — H1 "[Usługa] [Miasto]"
// ════════════════════════════════════════════════════════════════════════════

const CITY_DATA = {
  'stalowa-wola': { name: 'Stalowa Wola', gen: 'Stalowej Woli', adj: 'stalowowolski', region: 'Stalowej Woli, Niska, Tarnobrzega i Sandomierza' },
  'sandomierz':   { name: 'Sandomierz',   gen: 'Sandomierza',   adj: 'sandomierski',   region: 'Sandomierza, Ostrowca Świętokrzyskiego, Opatowa i Tarnobrzega' },
  'mielec':       { name: 'Mielec',        gen: 'Mielca',        adj: 'mielecki',        region: 'Mielca, Dębicy, Rzeszowa i Kolbuszowej' },
  'rzeszow':      { name: 'Rzeszów',       gen: 'Rzeszowa',      adj: 'rzeszowski',      region: 'Rzeszowa, Łańcuta, Jarosławia i Przemyśla' },
  'nowa-deba':    { name: 'Nowa Dęba',     gen: 'Nowej Dęby',    adj: 'nowodębski',      region: 'Nowej Dęby, Tarnobrzega, Stalowej Woli i Mielca' },
};

const SERVICE_NAMES = {
  'strony-internetowe': 'Strony internetowe',
  'seo':                'Pozycjonowanie SEO',
  'google-ads':         'Google Ads',
  'marketing-internetowy': 'Marketing internetowy',
};

const cityPages = db.prepare(
  "SELECT slug, h1, title FROM pages WHERE slug LIKE '%/%' AND slug NOT LIKE 'tarnobrzeg/%'"
).all();

for (const p of cityPages) {
  const parts = p.slug.split('/');
  if (parts.length !== 2) continue;
  const [miasto, service] = parts;
  const cd = CITY_DATA[miasto];
  if (!cd) continue;
  const sn = SERVICE_NAMES[service] || service.replace(/-/g,' ');

  const newH1 = `${sn} ${cd.name}`;
  const meta = `${sn} dla firm z ${cd.gen}. Profesjonalna obsługa marketingu cyfrowego — Halo, agencja z Tarnobrzegu.`;
  const wstep = `${sn} ${cd.name} to usługa dla firm z ${cd.gen}, które chcą skutecznie rozwijać swoją obecność w internecie i pozyskiwać klientów lokalnie. Halo to agencja cyfrowa z siedzibą w Tarnobrzegu — obsługujemy firmy z całego regionu, w tym z ${cd.gen}. Znamy specyfikę lokalnego rynku i wiemy, jak budować skuteczną komunikację dla firm działających w ${cd.adj.replace(/i$/, 'im')} otoczeniu.`;
  const obszar = `Obsługujemy firmy z ${cd.name} i okolic — ${cd.region}. Jesteśmy agencją z Tarnobrzegu, projekty realizujemy zdalnie, bez konieczności spotkań stacjonarnych.`;

  const row = db.prepare('SELECT content_json FROM pages WHERE slug=?').get(p.slug);
  if (!row) continue;
  let c; try { c = JSON.parse(row.content_json || '{}'); } catch(e) { c = {}; }
  c.wstep = wstep;
  c.h2_wstep = `${sn} dla firm z ${cd.gen}`;
  c.obszar_dzialania = obszar;
  c.h2_obszar = `Obszar działania — ${cd.name} i okolice`;
  c.dlaczego_warto = `Halo to agencja cyfrowa z Tarnobrzegu specjalizująca się w marketingu dla firm z regionu podkarpackiego. Realizujemy projekty dla firm z ${cd.gen} z takim samym zaangażowaniem jak lokalne zlecenia. Pracujemy zdalnie, komunikujemy się sprawnie i raportujemy wyniki regularnie. Bezpłatna konsultacja dostępna dla firm z ${cd.name}.`;
  c.h2_dlaczego = `Dlaczego ${sn.toLowerCase()} warto zlecić Halo?`;
  c.h2_faq = `Pytania o ${sn.toLowerCase()} — ${cd.name}`;

  updatePage.run(newH1, meta, JSON.stringify(c), p.slug);
  console.log('CITY OK', p.slug);
}

db.close();
console.log('\nSEO v2 zaktualizowane pomyślnie.');
