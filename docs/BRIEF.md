# The Great Random Race

Project Brief — versie 0.4

*Concept, game design, techniek, MVP-plan en instructies voor Claude
Design en Claude Code. De app wordt een webapp (PWA) in het Nederlands.
Bijgewerkt op 7 oktober 2026.*

**Hoe gebruik je dit document?** Claude Design heeft vooral hoofdstuk
1–3 en 6–16 nodig (concept, racers, schermen, toon, animaties, stijl).
Claude Code krijgt het hele document. Hoofdstuk 23–24 zijn voor jezelf:
wat je buiten de code om moet regelen.

## 1. Project in één zin

The Great Random Race is een absurd serieuze mobiele racegame waarin je
een langzame of vreemde racer bezit en regelmatig terugkomt om te
ontdekken wat je racer heeft uitgespookt.

## 2. Het kernidee

De speler krijgt een slak genaamd Gerard. Gerard doet mee aan een race
die zeven dagen duurt. De race verloopt grotendeels automatisch. De
speler hoeft niet constant te spelen, maar komt terug uit
nieuwsgierigheid: “Wat heeft Gerard inmiddels gedaan?”

Speels, charmant, absurd en verrassend gepolijst. Een mix van
sportuitzending, natuurdocumentaire, kinderboekillustratie en subtiele
meme-humor.

Geen agressieve retention, geen casino-elementen, geen klassieke
idle-game-mechanieken (geen upgrades kopen, geen valuta, geen timers die
je onder druk zetten).

## 3. Doel van versie 0.1

V0.1 hoeft niet te bewijzen dat de volledige technische architectuur
werkt. Het moet bewijzen dat de game-loop leuk is: wil een speler na het
sluiten van de app later terugkomen om te zien wat Gerard heeft
meegemaakt?

Hoe meten we dat?

Er is geen backend en dus geen automatische statistiek. We meten daarom
met mensen: laat 10 à 15 bekenden twee races (14 dagen) meespelen en
vraag ze na afloop:

- Op hoeveel van de 7 dagen heb je de app geopend? (doel: de helft van
  de testers op 5 dagen of meer)

- Wilde je weten hoe het afliep? Heb je na race 1 een tweede race
  gestart?

- Welk journaalbericht is je bijgebleven?

## 4. Scope v0.1

- 1 speelbare racer: Gerard, een slak.

- 1 race: De Grote Bosrace, 7 dagen.

- 5 racers in totaal: Gerard plus 4 gesimuleerde tegenstanders (alles
  lokaal op het toestel).

- Raceprogressie op basis van verstreken tijd, ook als de app dicht is.

- Willekeurige events (vooraf berekend, zie hoofdstuk 10).

- Keuze-events: af en toe mag de speler kiezen wat Gerard doet (‘Eet hem
  / Negeer hem’), en dat beïnvloedt de race.

- Racejournaal (tijdlijn van gebeurtenissen).

- Tussenstand (leaderboard van de 5 racers).

- Racerprofiel.

- Eén optionele actie per kalenderdag.

- Lokale opslag op het toestel.

- Automatische finish en uitslag met absurde statistieken.

- Na afloop een nieuwe race kunnen starten.

## 5. Bewust NIET in v0.1

Geen backend, geen accounts, geen database (Supabase/PostgreSQL), geen
Redis, geen WebSockets, geen multiplayer, geen betalingen, geen
advertenties, geen pushnotificaties, geen sociale functies, geen
analytics/tracking, geen app-winkels (Google Play of App Store).

## 6. Vastgestelde keuzes

Deze punten stonden niet in v0.1 maar moeten vastliggen voordat er
gebouwd wordt. Claude Code gebruikt deze keuzes; pas ze hier aan als je
iets anders wilt.

| **Onderwerp**   | **Keuze**                                                                                                                                                                                     | **Waarom**                                                                                                           |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Taal van de app | Nederlands. Eigennamen en bijnamen (The Great Random Race, The Unreasonably Slow) blijven Engels, als knipoog. Alle teksten in één apart bestand.                                             | Kleine, Nederlandstalige groep spelers.                                                                              |
| Platform        | Webapp (PWA) op thegreatrandomrace.nl. Te installeren op het beginscherm van Android én iPhone. Geen app-winkel.                                                                              | Gratis, geen account bij Google of Apple, geen verplichte testperiode, meteen te delen via een link.                 |
| Opslag          | In de browser van de speler (IndexedDB). Spelers zetten de app op hun beginscherm.                                                                                                            | Op de iPhone kan Safari gegevens van een gewone website wissen; vanaf het beginscherm is dat veel minder een risico. |
| Illustraties    | Losse PNG-afbeeldingen met doorzichtige achtergrond, gemaakt met ChatGPT in de stijl van het ontwerp (hoofdstuk 16).                                                                          | Rijke, glanzende stijl zoals in je voorbeeldafbeelding.                                                              |
| Tijd            | Lokale tijd van het toestel. Een kalenderdag loopt van 00:00 tot 23:59 lokale tijd.                                                                                                           | Simpel. Spelers die de klok van hun telefoon verzetten, vangen we in v0.1 niet af.                                   |
| Meldingen       | Geen meldingen in v0.1.                                                                                                                                                                       | We willen juist testen of mensen uit zichzelf terugkomen.                                                            |
| Privacy         | De app verzamelt en verstuurt geen gegevens. Geen cookies, geen tracking.                                                                                                                     | Dan is er geen cookiemelding nodig.                                                                                  |
| Uitbreidbaar    | Racers, accessoires en routes staan als losse gegevensbestanden in het project, met hun eigen afbeeldingen. Toevoegen = bestand + afbeelding erbij, geen nieuwe programmacode (hoofdstuk 18). | Je wilt in de loop der tijd nieuwe racers, accessoires en routes toevoegen.                                          |
| Ontwerp         | Het tekenvel ‘The Great Random Race – schermontwerpen’ in Claude Design is leidend voor uiterlijk en indeling.                                                                                | Gebaseerd op je eigen voorbeeldafbeelding.                                                                           |
| Animaties       | Klein en vrolijk: confetti bij winst, Gerard die zacht ademt en af en toe zijn kopje beweegt (hoofdstuk 15).                                                                                  | Maakt het levendig zonder druk te worden.                                                                            |

## 7. De racers

Snelheid is relatief aan Gerard (1,00). Eigenschappen lopen van 0 tot
100.

| **Naam** | **Soort** | **Snelheid** | **Curious / Stubborn / Chaotic / Lazy** | **Titel**             | **Rol in de race**                     |
|----------|-----------|--------------|-----------------------------------------|-----------------------|----------------------------------------|
| Gerard   | Slak      | 1,00         | 85 / 75 / 20 / 60                       | The Determined        | De held. Kan winnen, maar nooit zeker. |
| Ducky    | Eend      | 1,30         | 60 / 30 / 90 / 30                       | Chaotic Excellence    | Snelste, maar verdwaalt vaak.          |
| Turbo    | Schildpad | 0,85         | 30 / 90 / 15 / 50                       | The Relentless        | Traag maar onverstoorbaar.             |
| Kevin    | Rups      | 0,70         | 70 / 20 / 60 / 80                       | Professional Napper   | Slaapt; haalt de finish zelden.        |
| Steve    | Steen     | 0,15         | 5 / 100 / 1 / 100                       | Still Going           | Running gag. Haalt de finish nooit.    |

## 8. Wat doen de eigenschappen?

In v0.1 stonden de eigenschappen in de tabel, maar niet wat ze doen. Zo
werken ze:

- **Curious:** vergroot de kans op afleidings-events (flower, butterfly,
  worm, strange_noise). Kost tijd, levert de leukste journaalberichten
  op.

- **Stubborn:** dempt negatieve effecten van terrein en events. Bij 100
  halveert het effect.

- **Chaotic:** vergroot de kans op shortcut én wrong_turn, en maakt de
  effecten groter. Meer spreiding in de uitslag.

- **Lazy:** vergroot de kans op een dutje (nap) en maakt dutjes langer.

De persoonlijkheidsmodifier in de formule (hoofdstuk 10) blijft dicht
bij 1,0 (tussen 0,9 en 1,1). Persoonlijkheid werkt vooral via welke
events er gebeuren.

## 9. Het parcours

De Grote Bosrace: Startweide → Bos → Modderveld → Beekje → Vreemde Open
Plek → Heuvel → Kasteeltuin → Finish.

| **Deel**          | **Aandeel van de totale afstand** | **Terrein-modifier** |
|-------------------|-----------------------------------|----------------------|
| Startweide        | 10%                               | 1,00                 |
| Bos               | 20%                               | 0,95                 |
| Modderveld        | 10%                               | 0,70                 |
| Beekje            | 10%                               | 0,85                 |
| Vreemde Open Plek | 15%                               | 1,05                 |
| Heuvel            | 15%                               | 0,75                 |
| Kasteeltuin       | 20%                               | 1,00                 |

## 10. Race-engine

Principe

Geen simulatie die op de achtergrond doorloopt. Bij het starten van een
race worden starttijd, eindtijd (start + 7 dagen) en een seed
(startgetal voor het toeval) opgeslagen. Met die seed wordt meteen het
complete eventschema voor alle racers vooraf berekend en opgeslagen:
tijdstip, type, duur en effect van elk event.

De positie van een racer op elk moment = de som van (effectieve snelheid
× tijd) over alle tijdvakken tot nu. Het journaal toont alleen events
waarvan het tijdstip al voorbij is. Zo is de race altijd hetzelfde, hoe
vaak je de app ook opent of sluit, en is alles te testen.

Formule

effectieveSnelheid = basisSnelheid × terrein × persoonlijkheid × event ×
actie

Kalibratie

Stem de totale afstand en de effecten zo af dat, gemeten over 1.000
gesimuleerde races:

- Gerard bij gemiddeld geluk rond dag 6 à 7 finisht en 15–35% van de
  races wint;

- Ducky meestal als eerste finisht, maar niet altijd;

- Turbo de finish soms net wel en soms net niet haalt;

- Kevin de finish zelden haalt en Steve nooit.

Einde van de race

De race eindigt precies 7 dagen na de start. Racers die de finish
haalden, worden gerangschikt op finishtijd; de rest op afgelegde
afstand. Een afstand kan nooit onder nul komen.

## 11. Events

Een paar betekenisvolle gebeurtenissen per dag is genoeg: voor Gerard 2
tot 4 per dag, voor tegenstanders 1 tot 2. Effecten zijn tijdelijk,
tenzij anders vermeld.

| **Event**     | **Effect op snelheid**                                  | **Duur**          | **Vaker bij**            |
|---------------|---------------------------------------------------------|-------------------|--------------------------|
| flower        | × 0,3 (hij kijkt)                                       | 30–240 min        | Curious                  |
| rain          | Gerard × 1,15 (slakken houden van regen), anderen × 0,8 | 1–3 uur           | —                        |
| food          | × 0 tijdens eten, daarna × 1,1                          | 20–60 min + 2 uur | Lazy                     |
| bird          | × 0 (verstoppen)                                        | 10–30 min         | —                        |
| mud           | × 0,6                                                   | 1–3 uur           | Alleen op Mud-deel vaker |
| nap           | × 0                                                     | 1–5 uur           | Lazy                     |
| shortcut      | Direct 2–5% van het parcours vooruit                    | Direct            | Chaotic                  |
| wrong_turn    | Direct 1–4% van het parcours terug                      | Direct            | Chaotic                  |
| worm          | × 0,5 (gesprek)                                         | 30–90 min         | Curious                  |
| rock          | × 0,7; bij Steve: ontmoet een familielid                | 30 min            | —                        |
| butterfly     | × 0,4                                                   | 20–60 min         | Curious                  |
| puddle        | × 0,7; Ducky × 1,5                                      | 30–60 min         | —                        |
| snack         | × 1,2                                                   | 2 uur             | —                        |
| strange_noise | × 0, daarna × 1,3 (geschrokken)                         | 15 min + 1 uur    | Curious                  |
| nothing       | Geen effect; wel een journaalbericht                    | —                 | —                        |

Keuze-events

Sommige events vragen de speler om een keuze, zoals in het ontwerp:
‘Gerard heeft een gigantische aardbei gevonden. Wat moet hij doen?’ met
de knoppen Eet hem, Negeer hem en Ga erop zitten.

- Maximaal één keuze-event per dag, op een willekeurig moment (vooraf
  berekend met de seed, net als gewone events).

- Elke keuze heeft een eigen effect, bijvoorbeeld: eten = 1 uur
  stilstaan en daarna 3 uur × 1,15; negeren = geen effect; erop zitten =
  30 minuten × 0 en een grappig journaalbericht.

- De speler heeft 12 uur om te kiezen. Doet hij niets, dan kiest Gerard
  zelf, passend bij zijn persoonlijkheid (een nieuwsgierige slak eet de
  aardbei vaker).

- De gekozen optie wordt opgeslagen. Vanaf het moment van kiezen telt
  het effect mee in de berekening van de positie. Wat al gebeurd is,
  verandert nooit.

- Keuze-events en de dagelijkse actie bestaan naast elkaar: de actie doe
  je zelf wanneer je wilt, het keuze-event overkomt Gerard.

Begin met 5 keuze-events, elk met 2 of 3 opties en eigen teksten.

## 12. Dagelijkse actie

Maximaal één actie per kalenderdag. De actie is optioneel en heeft maar
een klein effect. Acties veranderen het vooraf berekende eventschema
niet; ze werken alleen als extra modifier.

| **Actie**             | **Effect**                                                                          | **Duur**         |
|-----------------------|-------------------------------------------------------------------------------------|------------------|
| Gerard voeren         | Snelheid × 1,05                                                                     | 12 uur           |
| Gerard aanmoedigen    | Snelheid × 1,03                                                                     | 24 uur           |
| Gerard een hoed geven | Geen snelheidseffect; Gerard draagt de hoed zichtbaar en het journaal reageert erop | Rest van de race |
| Niets doen            | Geen effect; Gerard waardeert de rust (journaalbericht)                             | —                |

## 13. Schermen

- **Eerste start:** korte, grappige introductie van Gerard en de race,
  met één knop om te starten.

- **Home:** Gerard groot in beeld, positie in de race, voortgang, wat
  hij nu doet en de laatste gebeurtenis.

- **Race:** geïllustreerde route met de posities van alle racers en de
  finish.

- **Racer:** profiel, persoonlijkheid, stats, titel en recente
  gebeurtenissen.

- **Journal:** tijdlijn van gebeurtenissen, nieuwste bovenaan.

- **Action:** de dagelijkse actie; laat duidelijk zien als die vandaag
  al gedaan is.

- **Finish:** dramatische uitslag met absurde statistieken en een knop
  ‘Nieuwe race’.

- **Event:** pop-up als er een keuze-event is, met plaatje en twee of
  drie keuzeknoppen.

## 14. Toon en voorbeeldteksten

Droog, liefdevol, als een serieuze sportcommentator die een slak
verslaat. Korte zinnen. Nooit gemeen. Voorbeelden:

- *08:14 — Gerard heeft een bloem gevonden. Hij weet nog niet wat hij
  ervan vindt. Hij kijkt nog steeds.*

- *13:02 — Steve heeft zich niet verplaatst. Kenners spreken van een
  gedurfde tactiek.*

- *16:40 — Ducky nam een kortere weg. Het was geen kortere weg.*

- *22:15 — Kevin doet een dutje. Om 21:15 deed Kevin ook een dutje.*

- *03:30 — Gerard hoorde een vreemd geluid. Hij heeft besloten dat het
  niets was. Hij gaat nu iets sneller.*

Voorbeelden van statistieken op het finishscherm:

- *Tijd besteed aan het bekijken van één bloem: 4 uur en 12 minuten.*

- *Afstand verloren aan ‘kortere wegen’ (Ducky): 31 meter.*

- *Aantal keer dat Steve voor decor werd aangezien: 14.*

Per eventtype minimaal 4 tekstvarianten, zodat het journaal niet snel
herhaalt.

## 15. Animaties

Kleine, vrolijke bewegingen maken het levendig. Alles blijft simpel en
licht, zodat het ook op een oudere telefoon soepel loopt.

- **Gerard leeft:** hij ‘ademt’ met een zachte pulsering (een paar
  procent groter en kleiner, ongeveer elke 3 seconden). Af en toe
  beweegt hij zijn kopje of voelsprieten even heen en weer.

- **Wat hij doet:** de beweging past bij zijn status: bij een dutje een
  rustigere pulsering met een ‘zzz’, bij een bloem kijkt hij er schuin
  naar.

- **Confetti:** op het finishscherm bij een overwinning van Gerard (en
  een kleiner confettiregentje bij een podiumplaats).

- **Nieuw event:** een nieuwe journaalkaart schuift zacht in beeld.

- **Rustige stand:** heeft iemand op zijn telefoon ‘minder beweging’
  ingesteld, dan staan de animaties uit.

Techniek: de animaties zijn CSS-animaties op de afbeeldingen. Het kopje
los bewegen kan pas als Gerard in drie lagen is getekend (hoofdstuk 16).
Confetti met de kleine bibliotheek canvas-confetti.

## 16. Visuele stijl

Warm, speels, premium en geïllustreerd. Denk aan sportbroadcast +
natuurdocumentaire + kinderboek + moderne mobiele UI.

- Crème/off-white achtergrond.

- Groen, zacht blauw, warm geel en één sterk accent.

- Ronde kaarten, subtiele schaduwen, veel witruimte.

- Grote, vriendelijke typografie.

- De racer is visueel de held.

- Vermijd: neon, casino-esthetiek, Fortnite-achtige 3D, agressieve
  gradients en drukke schermen.

Wat Claude Design moet opleveren

- Het design system staat op het tekenvel (blad ‘Huisstijl’): kleuren,
  lettertypen Barlow Condensed en Nunito Sans, knoppen, kaarten.

- Alle schermen uit hoofdstuk 13 op telefoonformaat, plus het
  event-scherm met keuzes.

- Een app-icoon (512 × 512, ook in een ‘maskable’ versie met extra rand
  voor Android).

**Het ontwerp is leidend:** de schermen staan op het tekenvel ‘The Great
Random Race – schermontwerpen’. Schermen die daar al op staan maar niet
in v0.1 zitten (Kies je racer, Accessoires, het grote leaderboard)
liggen klaar voor later.

Illustraties

Elke illustratie is een los PNG-bestand met doorzichtige achtergrond,
minstens 1024 × 1024 pixels: Gerard, elke racer, elk accessoire, de
eventplaatjes en de kaart van elke route. Gemaakt met ChatGPT in de
stijl van de voorbeeldafbeelding. Kleine verschillen tussen de plaatjes
zijn geen probleem, zolang de stijl gelijk blijft. Voor een bewegend
kopje heeft Gerard drie lagen nodig: huisje, lijf en kop; tot die er
zijn, ademt en wiebelt hij als geheel.

## 17. Technische stack

| **Onderdeel**            | **Keuze**                                                                                                 |
|--------------------------|-----------------------------------------------------------------------------------------------------------|
| Soort app                | Progressive Web App (PWA): een website die zich als app gedraagt, offline werkt en op het beginscherm kan |
| Framework                | React + Vite                                                                                              |
| Taal                     | TypeScript                                                                                                |
| Navigatie                | React Router                                                                                              |
| PWA-onderdelen           | vite-plugin-pwa (manifest, app-icoon, offline werken)                                                     |
| Opslag v0.1              | IndexedDB in de browser (via een kleine bibliotheek zoals idb-keyval)                                     |
| Illustraties en animatie | PNG-afbeeldingen + CSS-animaties; canvas-confetti voor confetti                                           |
| Tests                    | Vitest                                                                                                    |
| Hosting                  | Bestaande Hetzner-server; Caddy serveert de app met gratis HTTPS (Let’s Encrypt)                          |
| Later: backend           | Python + FastAPI, PostgreSQL                                                                              |

## 18. Architectuur

**v0.1:** telefoon → browser/beginscherm → webapp (statische bestanden
van thegreatrandomrace.nl) → lokale game-engine → opslag in de browser.

**Later:** webapp → HTTPS → Caddy → FastAPI → PostgreSQL op de
Hetzner-server, via api.thegreatrandomrace.nl.

De game-engine staat los van de schermen en van de opslag. Zo kan de
lokale opslag later vervangen worden door de API zonder de app opnieuw
te bouwen. De engine bevat geen React-code en is volledig te testen
zonder browser.

Nieuwe racers, accessoires en routes toevoegen

Alles wat je later wilt uitbreiden, is ‘inhoud’ en geen programmacode.
Elke racer, elk accessoire, elke route en elk keuze-event staat als een
eigen klein gegevensbestand in src/content/, met de afbeeldingen ernaast
in public/images/. De app leest bij het opstarten alles in wat daar
staat.

- **Nieuwe racer:** naam, soort, snelheid, de vier eigenschappen,
  bijnaam en een afbeelding.

- **Nieuw accessoire:** naam, soort (hoed, ogen, rugzak, speciaal) en
  een afbeelding.

- **Nieuwe route:** naam, de delen met hun aandeel en terrein-modifier,
  de kaartafbeelding en de positie van elk deel op die kaart.

- **Nieuw keuze-event:** tekst, plaatje, opties met hun effect en
  journaalteksten.

Een nieuw item toevoegen betekent: een bestand kopiëren, invullen,
afbeelding erbij, en de app opnieuw online zetten. Dat kun je later
samen met Claude Code doen in één korte opdracht. Claude Code zet in de
README per soort een kort invulvoorbeeld. Races die al lopen, worden
niet beïnvloed door nieuwe inhoud.

Mocht je later tóch in Google Play willen staan, dan kan deze webapp als
app worden ‘ingepakt’ (Trusted Web Activity). Er hoeft dan niets opnieuw
gebouwd te worden.

## 19. Projectstructuur v0.1

the-great-random-race/

├── public/ (app-iconen; images/racers, images/accessories,
images/courses, images/events)

├── src/

│ ├── screens/ (Home, Welcome, Race, Racer, Journal, Action, Finish)

│ ├── components/ (RacerCard, RaceProgress, RaceMap, EventCard,
JournalEntry, PrimaryButton, Confetti)

│ ├── game/ (engine.ts, racers.ts, events.ts, course.ts, terrain.ts,
personality.ts)

│ ├── content/ (nl.ts — teksten; racers/, accessories/, courses/,
choices/ — één bestand per item)

│ ├── models/ (Racer.ts, Race.ts, Event.ts, JournalEntry.ts)

│ ├── storage/ (storage.ts)

│ ├── theme/ (kleuren, lettertypen, afstanden — uit Claude Design)

│ └── utils/ (dates.ts, random.ts — random met seed)

├── tests/ (engine.test.ts, events.test.ts, course.test.ts,
balance.test.ts)

├── deploy/ (Caddyfile en uitleg voor de Hetzner-server)

├── index.html

├── vite.config.ts

├── package.json

├── tsconfig.json

├── README.md

└── CLAUDE.md (werkinstructies voor Claude Code)

## 20. Definition of Done v0.1

- De app draait op thegreatrandomrace.nl en is te installeren op het
  beginscherm van Android (Chrome) en iPhone (Safari).

- De app werkt ook zonder internet nadat hij één keer geopend is.

- Een race wordt lokaal aangemaakt, met start- en eindtijd en seed.

- Racers bewegen op basis van tijd, ook als de app dicht was.

- Events worden gegenereerd en verschijnen op het juiste moment in het
  journaal.

- De app kan worden afgesloten en later hervat zonder dat er iets
  verandert aan wat al gebeurd is.

- De dagelijkse actie werkt en kan niet twee keer op één dag.

- De race eindigt automatisch; de eindstand wordt berekend; confetti bij
  winst.

- Gerard pulseert zacht en beweegt af en toe zijn kopje; bij ‘minder
  beweging’ staat dat uit.

- Een nieuwe race kan worden gestart.

- De game-engine heeft unit tests, inclusief een balanstest (1.000
  races, zie hoofdstuk 10).

- Een test die ‘tijd vooruitspoelt’ laat zien dat een volledige race van
  7 dagen goed verloopt.

- De app voelt niet als een standaard formulieren-app.

- De speler is nieuwsgierig naar wat Gerard gaat doen.

## 21. Gefaseerde implementatie

1.  Fase 1: Vite + React-project, navigatie, basisschermen, thema uit
    Claude Design.

2.  Fase 2: Models en game-engine (zonder schermen), met tests.

3.  Fase 3: Race aanmaken en lokaal opslaan.

4.  Fase 4: Home-scherm en eerste-start-scherm, met de bewegende Gerard.

5.  Fase 5: Race-scherm.

6.  Fase 6: Journaal.

7.  Fase 7: Racerprofiel.

8.  Fase 8: Dagelijkse actie.

9.  Fase 9: Finishscherm met confetti.

10. Fase 10: Balanstest, tests en afwerking.

11. Fase 11: PWA afmaken (icoon, offline, installeren) en online zetten
    op de Hetzner-server.

Na iedere fase: TypeScript-controle en tests draaien, en een commit
maken. Laat het project nooit bewust kapot achter.

## 22. Instructies voor Claude Code

Neem dit over in CLAUDE.md in de projectmap:

- Lees eerst deze briefing en inspecteer de repository. Is die leeg,
  maak dan een Vite-project aan met React en TypeScript.

- Werk fase voor fase (hoofdstuk 21). Maak zelf redelijke technische
  keuzes en stel geen onnodige vragen.

- Vraag het wél als een keuze de scope, de spelregels of de vastgestelde
  keuzes (hoofdstuk 6) verandert.

- Prioriteiten: 1) plezier, 2) duidelijkheid, 3) afwerking, 4)
  eenvoud, 5) onderhoudbaarheid.

- Bouw niets uit v0.2 tenzij daar expliciet om gevraagd wordt.

- Alle teksten in het Nederlands, uit src/content/nl.ts.

- De eigenaar is geen programmeur. Leg na elke fase in gewone taal uit
  wat er gemaakt is en precies wat zij moet doen om het te bekijken
  (welke knop, welk commando, waar).

- Gebruik de ontwerpen en kleuren uit Claude Design; verzin geen eigen
  stijl.

## 23. Domein en server

De app zelf is een verzameling bestanden die de Hetzner-server uitdeelt.
Er draait in v0.1 geen backend.

- **thegreatrandomrace.nl:** de app zelf.

- **thegreatrandomrace.nl/privacy:** een korte privacyverklaring (‘deze
  app verzamelt niets’). Niet verplicht, wel netjes.

Daarvoor wijst het domein bij Vimexx (DNS, A-record) naar het IP-adres
van de Hetzner-server, en serveert Caddy de app met HTTPS. HTTPS is
verplicht: zonder werkt installeren op het beginscherm niet. Later komt
api.thegreatrandomrace.nl erbij voor de backend.

## 24. Installeren en delen

Je deelt gewoon de link thegreatrandomrace.nl. Spelers zetten de app
daarna op hun beginscherm:

- **Android (Chrome):** menu (drie puntjes) → ‘App installeren’ of
  ‘Toevoegen aan startscherm’.

- **iPhone (Safari):** deelknop (vierkantje met pijl) → ‘Zet op
  beginscherm’.

De app toont bij het eerste bezoek zelf een korte uitleg hiervoor.
Belangrijk: op de iPhone kan Safari gegevens van gewone websites wissen
als je ze een tijd niet bezoekt. Vanaf het beginscherm is dat veel
minder een risico, daarom raadt de app installeren duidelijk aan.

## 25. Latere richting (v0.2)

Pas als v0.1 leuk blijkt: FastAPI + PostgreSQL op Hetzner, accounts,
echte races tegen andere spelers, echte leaderboards, meerdere routes,
accessoires en collectie, keuzes bij events, deelbare uitslagkaarten,
eventueel vrienden en meldingen. Eventueel daarna toch Google Play via
een ingepakte versie.

## 26. Het belangrijkste succescriterium

De speler moet denken: *“Ik weet niet waarom ik om deze slak geef, maar
ik moet weten wat hij nu weer heeft gedaan.”*

## 27. Wat is er veranderd

In versie 0.4

- Keuze-events (‘Eet hem / Negeer hem’) toegevoegd aan v0.1, met regels
  voor timing, effect en wat er gebeurt als je niet kiest (hoofdstuk
  11).

- Uitbreidbaar opgezet: racers, accessoires, routes en keuze-events als
  losse gegevensbestanden met eigen afbeeldingen (hoofdstuk 18).

- Het ontwerp in Claude Design is leidend; eisen voor de illustraties
  toegevoegd (hoofdstuk 16).

- v0.1 blijft bij 5 racers en één dagelijkse actie.

In versie 0.3

- De app wordt een webapp (PWA) in plaats van een Google Play-app. Geen
  Play-account, geen verplichte testperiode.

- Taal: Nederlands. Parcours, voorbeeldteksten en racenaam vertaald;
  bijnamen blijven Engels.

- Nieuw hoofdstuk 15: animaties (pulserende Gerard, bewegend kopje,
  confetti).

- Stack, projectstructuur, fasen en Definition of Done aangepast aan de
  webapp.

- Hoofdstuk over Google Play vervangen door ‘Installeren en delen’.

- Notitie over de nieuwe voorbeeldafbeelding bij de visuele stijl.

In versie 0.2

- Vastgestelde keuzes, uitleg van de eigenschappen, lengtes van het
  parcours, vooraf berekende events met kalibratiedoelen, effect en duur
  per event en per actie.

- Eerste-start- en finishscherm, toon en voorbeeldteksten, opdracht voor
  Claude Design.

- CLAUDE.md in plaats van AGENTS.md, course.ts in plaats van routes.ts,
  balanstest en tijd-vooruitspoeltest.

- De afgebroken laatste zin van het succescriterium afgemaakt.
