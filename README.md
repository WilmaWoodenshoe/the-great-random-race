# The Great Random Race

Een absurd serieuze racegame voor de telefoon. Gerard de slak doet mee aan een race van zeven dagen; jij komt af en toe kijken wat hij uitspookt.

- **Testversie:** https://wilmawoodenshoe.github.io/the-great-random-race/ (wordt automatisch bijgewerkt bij elke wijziging op `main`)
- Briefing: `docs/BRIEF.md`
- Schermontwerpen: `docs/ontwerp/`
- Werkinstructies voor Claude Code: `CLAUDE.md`
- Afbeeldingen: `public/images/`

Website (later): thegreatrandomrace.nl

## Stand van zaken

| Fase | Wat | Status |
|---|---|---|
| 1 | Project, navigatie, basisschermen in de huisstijl, testversie | Klaar |
| 2 | Game-engine met tests | Klaar |
| 3 | Race aanmaken en lokaal opslaan | Klaar |
| 4 | Home en eerste start, met de bewegende Gerard | Klaar |
| 5 | Racekaart en tussenstand | Klaar |
| 6 | Journaal | Klaar |
| 7 | Racerprofiel | Klaar |
| 8 | Dagelijkse actie | Klaar |
| 9 | Finishscherm met confetti | Klaar |
| 10 | Balanstest, tests en afwerking | Klaar |
| 11 | PWA afmaken (icoon, offline, installeren) en online op thegreatrandomrace.nl | Klaar, op het slotje (HTTPS) na |

**v0.2** (plan: `docs/PLAN-v0.2.md`):

| Fase | Wat | Status |
|---|---|---|
| A | Kies je racer (10 racers), 5 willekeurige tegenstanders, teksten voor elke racer | Klaar |
| B | Server met accounts (passkey), map `server/` (Python + FastAPI + SQLite, met tests) | Klaar, draait op de server |
| C | Account in de app (Meer → Account): bijnaam + passkey, inloggen op een andere telefoon, race automatisch bewaren | Klaar |
| D | Spelersoverzicht, account verwijderen, privacyverklaring bijgewerkt (in v0.3 vervangen door de races-lijst) | Klaar |

**v0.3 — samen racen** (plan: `docs/PLAN-v0.3.md`): eerst een account (goedgekeurd door de beheerder), dan meedoen aan gedeelde races uit de lijst (*Meer → Races*) of er zelf een starten, met een vast startmoment en een duur van 7, 14 of 21 dagen. Routes: De Grote Bosrace, De Kasteelrace en De Strandrace (met paasei). Lege plekken worden aangevuld met computerracers. De beheerder keurt accounts goed onder *Meer → Beheer*. Klaar.

Accounts en gedeelde races werken alleen op thegreatrandomrace.nl; in de testversie (GitHub Pages) speel je alleen, op de telefoon, met de tijdmachine.

**Testen zonder een week te wachten:** onder *Meer → Testversie: tijdmachine* kun je de klok van de app een uur of een dag vooruit zetten, en alles wissen. Dit staat alleen in de testversie (GitHub Pages), niet op thegreatrandomrace.nl.

## Hoe de race werkt (kort)

- Bij de start liggen starttijd, eindtijd (+ 7 dagen) en een *seed* (startgetal voor het toeval) vast. Daarmee wordt meteen het hele eventschema berekend: wie wanneer een bloem vindt, een dutje doet of verdwaalt.
- De positie van elke racer wordt op elk moment uitgerekend uit dat schema. De app hoeft dus niet open te staan, en de race is altijd hetzelfde, hoe vaak je ook kijkt.
- Keuzes van de speler en de dagelijkse actie tellen pas mee vanaf het moment dat ze gemaakt zijn. Wat al gebeurd is, verandert nooit.
- De balanstest (`tests/balance.test.ts`) speelt 1.000 races met de vaste opstelling van v0.1 (Gerard, Mr. M, Turbo, Kevin, Steve, Charles) en controleert de doelen uit de briefing. Uitkomst bij de huidige instellingen: Gerard wint ± 25%, finisht meestal halverwege dag 7; Mr. M (de eend) wint ± 70%; Charles (het oude konijn) haalt in ± 22% van de races de finish en wint soms; Turbo haalt in ± 55% van de races de finish, Kevin in ± 9%, Steve nooit.
- Met willekeurige tegenstanders (Kies je racer) wint de speler met Mr. M ± 16%, met Gerard ± 11%, met Philippe ± 9%, met Roger ± 5%, met Isabelle ± 3%; Bintje, Charles, Turbo en Kevin winnen zelden, Steve nooit. De racer van de speler beleeft meer (meer events en keuzes) en is daardoor iets trager dan dezelfde racer als tegenstander.
- Een tweede balanstest speelt 1.000 races waarin de speler elke dag Gerard voert: hij wint dan iets vaker, maar minder dan 10 procentpunt. De actie helpt, maar beslist de race niet.
- Afstellen gebeurt in `src/game/racers.ts` (`BASE_KMH`), `src/game/events.ts` (kansen per event) en `src/game/personality.ts` (wat de eigenschappen doen).

## Nieuwe inhoud toevoegen

Racers, accessoires, routes en keuze-events zijn *inhoud*, geen programmacode. Elk item is één klein bestand in `src/content/`, met de afbeelding in `public/images/`. De app leest alles in die mappen vanzelf in.

Zo voeg je iets toe:

1. Zet de afbeelding in de juiste map onder `public/images/` (doorzichtige achtergrond, PNG of WebP).
2. Kopieer een bestaand bestand in dezelfde map onder `src/content/` en geef het een nieuwe naam.
3. Vul de gegevens in (zie de voorbeelden hieronder). De `id` moet uniek zijn: kleine letters, geen spaties.
4. Zet de app opnieuw online (wijziging naar `main`). Lopende races worden niet beïnvloed.

### Racer — `src/content/racers/<naam>.ts`

```ts
import type { Racer } from '../../models/Racer';

const ducky: Racer = {
  id: 'ducky',
  name: 'Mr. M',
  species: 'Eend',
  speed: 1.3, // ten opzichte van Gerard (1,00)
  traits: { curious: 60, stubborn: 30, chaotic: 90, lazy: 30 }, // elk 0–100
  title: 'Chaotic Excellence', // bijnaam, mag Engels
  tagline: 'Snel, maar weet zelden waarheen.', // zinnetje bij 'Kies je racer'
  image: 'racers/eend.webp', // in public/images/
  // pronoun: 'zij', // alleen als de racer een zij is (zoals Isabelle); standaard 'hij'
  facts: {
    favoriteFood: 'Broodkruimels',
    dislikes: 'Rechte lijnen',
    favoriteActivity: 'Kortere wegen',
    secretTalent: 'Weet nooit waar hij is',
  },
};

export default ducky;
```

Een nieuwe racer verschijnt vanzelf bij **Kies je racer** en kan als tegenstander meedoen. Elke race heeft 6 racers: de racer van de speler plus 5 willekeurige tegenstanders. Controleer na het toevoegen met de balanstest (`npm test`) of de snelheid redelijk is.

**Accessoires dragen:** een racer kan alleen accessoires dragen als in zijn bestand `wear` staat. Gerard: `wear: { aspect: 720 / 519, head: { x: 45, y: 14, w: 30, angle: -10 }, eyes: { x: 84.5, y: 13, w: 27, angle: 8 }, neck: { x: 84, y: 66, w: 22 } }` (`head` = punt boven op het hoofd, bij Gerard op het huisje; `eyes` = midden tussen de ogen; `neck` = de nek; `w` = breedte; `angle` = schuine stand in graden; `aspect` = breedte ÷ hoogte van de afbeelding).

### Accessoire — `src/content/accessories/<naam>.ts`

```ts
import type { Accessory } from '../../models/Accessory';

const kroon: Accessory = {
  id: 'kroon',
  name: 'Kroon',
  withArticle: 'de kroon', // voor het journaal: "Met de kroon, uiteraard."
  kind: 'hoed', // tabblad in de Collectie: 'hoed', 'ogen', 'rugzak' of 'speciaal'
  slot: 'hoofd', // waar het zit: 'hoofd', 'ogen' of 'nek'
  image: 'accessories/kroon.png',
  tagline: 'Niemand heeft gevraagd waarom. {Hij} heeft gewonnen.', // zinnetje in de Collectie
  unlock: { type: 'win' }, // hoe je het verdient, zie hieronder
};

export default kroon;
```

Manieren om te verdienen (`unlock`): `{ type: 'start' }` (meteen), `{ type: 'raceStarted' }` (eerste race begonnen), `{ type: 'finished', count: 1 }` (zoveel races uitgereden), `{ type: 'podium' }`, `{ type: 'win' }`, `{ type: 'races', count: 3 }` (zoveel races uitgespeeld), `{ type: 'daysOpened', count: 7 }` (app op zoveel dagen geopend), `{ type: 'longRace', days: 21 }` (race van zoveel dagen uitgespeeld).

Accessoires zijn alleen voor de sier. In het racerbestand staat onder `wear` waar het hoofd, de ogen en de nek zitten (punt en breedte in procenten van de afbeelding). In het accessoirebestand staat onder `fit` welk punt van het plaatje daarop komt en hoe groot het is. Elk nieuw accessoire past zo vanzelf bij elke racer; controleer het in de Pasruimte (Inventaris).

**Getekende plaatjes van een racer mét accessoire** (mooier dan erop leggen): zet ze in `public/images/racers/worn/` (bijv. `gerard-sjaal.webp`) en noem ze in het racerbestand onder `wornImages` met de plek in procenten van de gewone afbeelding. Die plek wordt met een hulpscript uitgerekend door de nieuwe tekening over de gewone racer te leggen. Lever ze aan in dezelfde houding als de gewone racer, met doorzichtige achtergrond.

### Route — `src/content/courses/<naam>.ts`

```ts
import type { Course } from '../../models/Course';

const groteBosrace: Course = {
  id: 'grote-bosrace',
  name: 'De Grote Bosrace',
  lengthKm: 42.7,
  days: 7,
  map: {
    image: 'courses/grote-bosrace-kaart.webp',
    width: 987, // afmetingen van de kaartafbeelding in pixels
    height: 1517,
    finish: { x: 553, y: 151 }, // plek van het finishlabel op de kaart
  },
  // share = aandeel van de afstand (samen 1), terrain = snelheid op dit deel,
  // sign = plek van het bordje op de kaart (in pixels),
  // path = punten langs de weg op de kaart; het laatste punt van een deel
  //        is het eerste punt van het volgende deel
  segments: [
    {
      id: 'startweide',
      name: 'Startweide',
      withArticle: 'de Startweide',
      share: 0.1,
      terrain: 1.0,
      sign: { x: 717, y: 1316 },
      path: [{ x: 360, y: 1290 }, { x: 300, y: 1215 }, { x: 240, y: 1160 }, { x: 212, y: 1105 }],
    },
    // …
  ],
};

export default groteBosrace;
```

### Keuze-event — `src/content/choices/<naam>.ts`

De speler kan met elke racer spelen. Schrijf de teksten daarom met **invulplekken** in plaats van een vaste naam:

| Invulplek | Wordt bij Gerard | Wordt bij Isabelle |
|---|---|---|
| `{naam}` | Gerard | Isabelle |
| `{hij}` / `{Hij}` | hij / Hij | zij / Zij |
| `{zijn}` / `{Zijn}` | zijn / Zijn | haar / Haar |
| `{hem}` | hem | haar |

Met een hoofdletter (`{Hij}`) komt het woord ook met een hoofdletter, voor het begin van een zin. Dezelfde invulplekken werken in de journaalteksten in `src/content/nl.ts`.

Gaat een event over een andere racer (zoals "Kevin slaapt"), zet dan `aboutRacer: 'kevin'` erbij. Dan komt het event alleen voor als Kevin meedoet en de speler niet zelf met Kevin speelt.

```ts
import type { Choice } from '../../models/Choice';

const aardbei: Choice = {
  id: 'aardbei',
  heading: '{naam} heeft iets gevonden!',
  title: 'Een gigantische aardbei',
  text: '{naam} heeft nog nooit zo’n grote aardbei gezien. Wat moet {hij} doen?',
  announce: '{naam} heeft een gigantische aardbei gevonden.', // journaalregel
  image: 'ui/event-aardbei.webp',
  imageAlt: 'Een gigantische aardbei',
  options: [
    {
      id: 'eten',
      label: 'Eet hem',
      color: 'groen', // 'groen', 'blauw' of 'oranje'
      prefers: ['curious', 'lazy'], // kiest de racer zelf vaker als hij zo is
      // effecten na elkaar: eerst 60 min stilstaan, dan 3 uur 15% sneller
      effects: [
        { minutes: 60, speed: 0 },
        { minutes: 180, speed: 1.15 },
      ],
      journal: ['{naam} heeft de aardbei gegeten. …', '…', '…', '…'], // minstens 4
    },
    // nog 1 of 2 opties
  ],
};

export default aardbei;
```

### Dagelijkse melding — `src/content/meldingen.json`

Tijdens een race krijgt iedereen die de melding aanzet (Meer → Account) elke dag om 19.00 uur één van deze berichten. Een bericht toevoegen: zet het tussen aanhalingstekens in de lijst `berichten`, met een komma achter het vorige bericht. Je mag `{naam}`, `{hij}`, `{Hij}`, `{zijn}`, `{hem}` en `{route}` gebruiken.

```json
"berichten": [
  "{naam} heeft vandaag drie keer de weg gevraagd. Aan een steen. Kom even kijken.",
  "Live vanaf {route}: {naam} doet {zijn} best. Echt waar. Bijna."
]
```

### Picknickkleed — `src/content/picknick/`

Kleine spelletjes met de racers, alleen voor de lol. Twee soorten bestanden:

**Spelletje** — `src/content/picknick/spellen/<naam>.ts`: naam, één regel uitleg en algemene opmerkingen per moment (minstens 3). Een nieuw spelletje heeft ook spelregels in `src/picknick/` nodig.

**Opmerkingen van een racer** — `src/content/picknick/racers/<racer-id>.ts` (zelfde id als in `src/content/racers/`). Ontbreekt het bestand, dan gebruikt de app algemene teksten bij de sterkste eigenschap van de racer. Je mag `{naam}`, `{hij}`, `{Hij}`, `{zijn}` en `{hem}` gebruiken.

```ts
import type { PicknickRacer } from '../../../models/Picknick';

const turbo: PicknickRacer = {
  id: 'turbo',
  thinkSeconds: 1, // zo lang denkt de racer na voor een zet (Gerard: 3)
  remarks: {
    'boter-kaas-en-eieren': {
      start: ['Turbo kijkt alvast naar linksboven.'],
      opening: ['Turbo begint linksboven. Turbo begint altijd linksboven.'],
    },
    'steen-papier-schaar': {
      hint: ['Turbo kiest wat hij vorige keer koos.'],
    },
  },
};

export default turbo;
```

Momenten: `start`, `think`, `playerWins`, `racerWins`, `draw`; bij boter-kaas-en-eieren ook `opening`, `distracted`, `nap`, `pass`; bij steen-papier-schaar `hint`, `playerRound`, `racerRound`, `tieRound` en `streak` (met `{aantal}`).

## Voor ontwikkelaars

```bash
npm install        # eenmalig
npm run dev        # app lokaal starten
npm run typecheck  # TypeScript-controle
npm test           # tests
npm run build      # productieversie in dist/

# server (map server/)
cd server
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements-test.txt
python -m pytest   # servertests
GRR_DB=grr.db GRR_RP_ID=localhost GRR_ORIGIN=http://localhost:5173 GRR_COOKIE_SECURE=0 \
  uvicorn app.main:create_app --factory --port 8100
```

Techniek: React + Vite + TypeScript, React Router, vite-plugin-pwa, IndexedDB (idb-keyval), Vitest, canvas-confetti. Lettertypen (Barlow Condensed, Nunito Sans) worden meegeleverd in plaats van via Google geladen, zodat de app niets naar derden stuurt en offline werkt.

| Map | Inhoud |
|---|---|
| `src/screens/` | De schermen |
| `src/components/` | Herbruikbare onderdelen (knoppen, kaart, menubalk…) |
| `src/content/` | Teksten (`nl.ts`) en inhoud (racers, accessoires, routes, keuze-events) |
| `src/game/` | De race-engine: rekenen zonder schermen (engine, events, keuzes, acties, journaal, statistieken) |
| `src/models/` | Beschrijving van de gegevens |
| `src/storage/` | Opslag op het toestel (IndexedDB) |
| `src/state/` | Verbindt engine en opslag met de schermen |
| `src/theme/` | Huisstijl: kleuren, letters, animaties |
| `src/utils/` | Hulpfuncties |
| `tests/` | Tests |
| `deploy/` | Online zetten op de server (nginx) — zie `deploy/UITLEG.md` |
