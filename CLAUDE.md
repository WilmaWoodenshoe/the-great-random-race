# Werkinstructies voor Claude Code — The Great Random Race

Lees dit bestand en `docs/BRIEF.md` (de volledige briefing, versie 0.4) voordat je iets bouwt.

## Over de eigenaar
De eigenaar is inkoper en boekhouder, geen programmeur. Ze werkt via claude.ai/code in de browser.
- Leg na elke fase in gewone, korte Nederlandse taal uit wat er gemaakt is.
- Vertel precies wat zij moet doen om het resultaat te bekijken: welke link, welke knop, waar. Geen terminalcommando's tenzij het niet anders kan; leg ze dan stap voor stap uit.
- Gebruik geen vakjargon zonder uitleg.

## Wat we bouwen
Een Nederlandstalige webapp (PWA) voor de telefoon: Gerard de slak doet mee aan een race van 7 dagen. Zie `docs/BRIEF.md` voor spelregels, scope, keuzes en fasen.

## Het ontwerp is leidend
- `docs/ontwerp/schermen/*.html` zijn de goedgekeurde schermontwerpen (gemaakt in Claude Design). Open ze als referentie voor indeling, kleuren, letters, teksten en animaties. Neem de stijl zo exact mogelijk over.
- `docs/ontwerp/schermen/Huisstijl.html` bevat kleuren, lettertypen (Barlow Condensed + Nunito Sans) en knoppen.
- `docs/ontwerp/voorbeeld-ontwerp.png` is de oorspronkelijke voorbeeldafbeelding van de eigenaar.
- `docs/ontwerp/README.md` legt per scherm uit wat in v0.1 zit en wat voor later is.
- De ontwerpbestanden zijn statische mockups; bouw de echte app in React, niet door deze HTML te kopiëren.

## Afbeeldingen
Staan al in `public/images/` (racers, kaart, achtergronden, accessoires, kleine iconen). Gebruik ze; verzin geen eigen illustraties. Gerard zonder kroon (`racers/gerard.webp`) is de standaard; de kroon is een accessoire.

## Techniek (zie hoofdstuk 17–19 van de briefing)
React + Vite + TypeScript, React Router, vite-plugin-pwa, IndexedDB-opslag, Vitest, CSS-animaties, canvas-confetti.
Racers, accessoires, routes en keuze-events zijn inhoud: één bestand per item in `src/content/`, zodat er later items kunnen worden toegevoegd zonder programmacode te wijzigen. Zet in de README per soort een invulvoorbeeld.

## Testversie op de telefoon
Zorg in fase 1 voor een testversie die de eigenaar op haar telefoon kan openen: een GitHub Actions-workflow die bij elke wijziging op `main` de app bouwt en publiceert op GitHub Pages. Leg haar stap voor stap uit hoe ze GitHub Pages aanzet (Settings → Pages → Source: GitHub Actions) en wat de link is. De definitieve versie komt later op thegreatrandomrace.nl (fase 11).

## Werkwijze
- Werk fase voor fase (hoofdstuk 21 van de briefing). Maak zelf redelijke technische keuzes en stel geen onnodige vragen.
- Vraag het wél als een keuze de scope, de spelregels of de vastgestelde keuzes (hoofdstuk 6) verandert.
- Prioriteiten: 1) plezier, 2) duidelijkheid, 3) afwerking, 4) eenvoud, 5) onderhoudbaarheid.
- Na elke fase: TypeScript-controle en tests draaien, committen, en de wijzigingen naar `main` brengen zodat de testversie bijwerkt. Laat het project nooit kapot achter.
- Bouw niets uit "latere richting (v0.2)" tenzij daarom gevraagd wordt.
- Alle teksten in het Nederlands, uit `src/content/nl.ts`.
