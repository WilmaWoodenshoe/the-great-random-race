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
| 2 | Game-engine met tests | – |
| 3 | Race aanmaken en lokaal opslaan | – |
| 4–9 | Schermen echt laten werken | – |
| 10–11 | Afwerking, PWA, online op thegreatrandomrace.nl | – |

In fase 1 tonen de schermen nog **voorbeeldgegevens** (`src/demo/voorbeeld.ts`). Vanaf fase 2–3 komen die uit de echte race.

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
  name: 'Ducky',
  species: 'Eend',
  speed: 1.3, // ten opzichte van Gerard (1,00)
  traits: { curious: 60, stubborn: 30, chaotic: 90, lazy: 30 }, // elk 0–100
  title: 'Chaotic Excellence', // bijnaam, mag Engels
  image: 'racers/eend.webp', // in public/images/
  facts: {
    favoriteFood: 'Broodkruimels',
    dislikes: 'Rechte lijnen',
    favoriteActivity: 'Kortere wegen',
    secretTalent: 'Weet nooit waar hij is',
  },
};

export default ducky;
```

### Accessoire — `src/content/accessories/<naam>.ts`

```ts
import type { Accessory } from '../../models/Accessory';

const kroon: Accessory = {
  id: 'kroon',
  name: 'Kroon',
  kind: 'hoed', // 'hoed', 'ogen', 'rugzak' of 'speciaal'
  image: 'accessories/kroon.png',
};

export default kroon;
```

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
  // sign = plek van het bordje op de kaart (in pixels)
  segments: [
    { id: 'startweide', name: 'Startweide', share: 0.1, terrain: 1.0, sign: { x: 717, y: 1316 } },
    { id: 'bos', name: 'Bos', share: 0.2, terrain: 0.95, sign: { x: 394, y: 1022 } },
    // …
  ],
};

export default groteBosrace;
```

### Keuze-event — `src/content/choices/<naam>.ts`

```ts
import type { Choice } from '../../models/Choice';

const aardbei: Choice = {
  id: 'aardbei',
  heading: 'Gerard heeft iets gevonden!',
  title: 'Een gigantische aardbei',
  text: 'Gerard heeft nog nooit zo’n grote aardbei gezien. Wat moet hij doen?',
  image: 'ui/event-aardbei.png',
  imageAlt: 'Gerard naast een gigantische aardbei',
  options: [
    {
      id: 'eten',
      label: 'Eet hem',
      color: 'groen', // 'groen', 'blauw' of 'oranje'
      // effecten na elkaar: eerst 60 min stilstaan, dan 3 uur 15% sneller
      effects: [
        { minutes: 60, speed: 0 },
        { minutes: 180, speed: 1.15 },
      ],
      journal: ['Gerard heeft de aardbei gegeten. …', '…', '…', '…'], // minstens 4
    },
    // nog 1 of 2 opties
  ],
};

export default aardbei;
```

## Voor ontwikkelaars

```bash
npm install        # eenmalig
npm run dev        # app lokaal starten
npm run typecheck  # TypeScript-controle
npm test           # tests
npm run build      # productieversie in dist/
```

Techniek: React + Vite + TypeScript, React Router, vite-plugin-pwa, IndexedDB (idb-keyval), Vitest, canvas-confetti. Lettertypen (Barlow Condensed, Nunito Sans) worden meegeleverd in plaats van via Google geladen, zodat de app niets naar derden stuurt en offline werkt.

| Map | Inhoud |
|---|---|
| `src/screens/` | De schermen |
| `src/components/` | Herbruikbare onderdelen (knoppen, kaart, menubalk…) |
| `src/content/` | Teksten (`nl.ts`) en inhoud (racers, accessoires, routes, keuze-events) |
| `src/models/` | Beschrijving van de gegevens |
| `src/theme/` | Huisstijl: kleuren, letters, animaties |
| `src/utils/` | Hulpfuncties |
| `src/demo/` | Voorbeeldgegevens voor fase 1 (verdwijnt later) |
| `tests/` | Tests |
