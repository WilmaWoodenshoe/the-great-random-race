# Het Picknickkleed – briefing minispelletjes

Besloten door de eigenaar op 26 oktober 2026.

## Het idee

Het Picknickkleed is een nieuwe hoek in The Great Random Race waar de speler kleine spelletjes doet met de racers: alleen voor de lol, zonder effect op de race.

De racers zitten op een picknickkleed langs het parcours en houden even pauze. Je speelt een potje met of tegen ze, en ze geven commentaar in hun eigen karakter. Gerard raakt afgeleid, Mr. M doet maar wat, Steve doet niets.

De naam past bij de natuur en het kinderboekgevoel van de game, en zegt meteen dat het om rust en gezelligheid gaat, niet om winnen. In de app heet het onderdeel **Picknickkleed**, met als ondertitel *Spelletjes met de racers*.

Vijf spelletjes in de eerste versie:

1. Boter-kaas-en-eieren tegen een racer
2. Steen-papier-schaar tegen Steve
3. Memory met racer-plaatjes
4. Mini-sudoku met plaatjes
5. Bekertje-schuiven: waar zit Steve?

## Uitgangspunten

Het Picknickkleed is een extraatje naast de race: kort, gezellig en zonder gevolgen.

- **Alleen voor de lol.** Winnen of verliezen heeft geen effect op de race, de tussenstand, de dagelijkse actie of de collectie. Er zijn geen punten, munten of beloningen.
- **Kort.** Een potje duurt 30 seconden tot 3 minuten. Geen tijdsdruk, geen klok die aftelt.
- **Geen druk om te spelen.** Geen meldingen, geen dagelijkse opdracht, geen reeksen ("5 dagen op rij"). Je speelt wanneer je zin hebt, zo vaak als je wilt.
- **De racer is de ster.** Elk spelletje draait om de opmerkingen en de speelstijl van de racer, niet om het spelletje zelf.
- **Met welke racer?** Standaard je eigen racer uit je huidige race. Bovenaan kun je wisselen naar een van de andere 9 racers. Zonder lopende race is het Gerard.
- **Alles op de telefoon.** De spelletjes werken zonder server en zonder internet. Spelers zijn al ingelogd met hun account, maar het Picknickkleed stuurt niets naar de server; de stand blijft op de telefoon. Zo blijft de server onaangeroerd. Later kan de stand eventueel met het account mee naar een andere telefoon.
- **De lopende race blijft heel.** Er racen nu 4 spelers. Het Picknickkleed raakt de race-engine, de opslag van races en de server niet aan, zodat een nieuwe versie de lopende race niet kan verstoren.
- **Werkt overal.** Op thegreatrandomrace.nl en in de testversie op GitHub Pages.

## Het karakter van de racer bepaalt hoe hij speelt

De vier eigenschappen die elke racer al heeft (0 tot 100) bepalen zijn speelstijl, zodat elk potje anders voelt. Een hoge waarde betekent een grotere kans op dat gedrag, per beurt.

| Eigenschap | Wat de racer doet | Voorbeeld |
| --- | --- | --- |
| Nieuwsgierig | Raakt afgeleid en doet een willekeurige zet in plaats van de beste | Gerard zet zijn kruisje naast een bloem |
| Koppig | Doet steeds hetzelfde: zelfde openingszet, zelfde keuze, zelfde tip | Turbo begint altijd linksboven; Roger kiest altijd schaar |
| Chaotisch | Speelt onvoorspelbaar, soms briljant, soms onzin | Mr. M wint per ongeluk |
| Lui | Slaat soms een beurt over of doet het minimale | Kevin doet een dutje, jij mag nog een keer |

Zonder afleiding speelt een racer goed. Racers met lage waarden (Roger, Turbo) zijn dus lastige tegenstanders; Gerard, Kevin en Charles zijn makkelijker. De speler moet tegen elke racer wel kunnen winnen, ook tegen Roger (zie *Klaar als*).

**Steve is de uitzondering.** Steve doet nooit iets. In boter-kaas-en-eieren zet hij geen enkel teken, in steen-papier-schaar kiest hij altijd steen, en bij het bekertje-schuiven ligt hij gewoon onder hetzelfde bekertje. Dat is precies de grap.

Nieuwe racers krijgen hun speelstijl vanzelf uit hun eigenschappen; alleen hun opmerkingen moeten erbij geschreven worden (zie *Uitbreidbaar*).

## De vijf spelletjes

In twee spelletjes is de racer je tegenstander, in drie speelt hij met je mee en geeft hij (vaak slechte) tips.

| Spelletje | Racer is | Duur | Moeilijkheid |
| --- | --- | --- | --- |
| Boter-kaas-en-eieren | Tegenstander | 1 min | Hangt af van de racer |
| Steen-papier-schaar | Tegenstander (standaard Steve) | 30 sec | Geluk |
| Memory | Helper | 2–3 min | Makkelijk |
| Mini-sudoku | Helper | 2–3 min | Makkelijk, gemiddeld, lastig |
| Bekertje-schuiven | Degene die schuift | 30 sec | Hangt af van de racer |

### 1. Boter-kaas-en-eieren

- Bord van 3 × 3. De speler zet blaadjes, de racer zet zijn eigen kopje (klein plaatje van de racer).
- Wie begint, wisselt per potje. Na het potje: *Nog een potje*.
- De racer "denkt" even na voor hij zet: 1 seconde, Gerard 3 seconden (hij is een slak).
- Speelstijl uit de eigenschappen; Steve zet nooit iets, dus je wint altijd van hem.
- Opmerkingen: *"Gerard zag een bloem. Hij weet niet meer waar hij was."* · *"Kevin doet een dutje. Jij bent weer aan de beurt."* · *"Turbo begint linksboven. Turbo begint altijd linksboven."* · *"Steve heeft gepast. Opnieuw."*

### 2. Steen-papier-schaar

- Best of 3. Standaard tegen Steve; andere racers kunnen ook.
- Steve kiest altijd steen. De app houdt bij hoe vaak achter elkaar: *"Steve kiest voor de 14e keer op rij steen. Hij is een steen."*
- Andere racers: koppig = vaak hetzelfde, chaotisch = willekeurig.
- Voor elke ronde zegt de racer iets dat wel of niet een hint is: *"Ik denk dat ik… steen neem."* (Steve) · *"Ik kies iets. Of niet."* (Mr. M)

### 3. Memory

- 12 kaarten (6 paren) met plaatjes van racers en accessoires, omgedraaid op het kleed.
- De speler draait steeds twee kaarten om. Teller: aantal beurten. Geen tijdslimiet.
- De racer kijkt mee en wijst soms een kaart aan: nieuwsgierig = de kaart die hij mooi vindt, koppig = steeds dezelfde kaart, lui = geen tip.
- Opmerkingen: *"Die. Nee, die. Nee, toch die."* · *"Ik wist dat het de pet was. Ik zei het alleen niet."*

### 4. Mini-sudoku

- Rooster van 4 × 4 met vier plaatjes in plaats van cijfers (bijvoorbeeld slak, eend, schildpad, steen). Elk plaatje komt één keer voor in elke rij, kolom en blok van 2 × 2.
- Drie niveaus: makkelijk (8 vakjes gegeven), gemiddeld (6), lastig (5). Altijd precies één oplossing.
- Tik een vakje, kies een plaatje. Knop *Controleer* kleurt fouten zacht rood.
- De racer geeft een tip op verzoek. Hoe chaotischer of nieuwsgieriger de racer, hoe vaker de tip niet klopt; hij brengt het dan wel met twijfel: *"Daar hoort de schildpad. Denk ik. Misschien."*
- Knop *Vraag het Roger*: Roger (de harde werker) geeft altijd een juiste tip.

### 5. Bekertje-schuiven

- Drie omgekeerde bekertjes op het kleed. Steve gaat onder een van de bekertjes liggen.
- De racer schuift: lui = weinig wissels, chaotisch = snel en wild, koppig = steeds dezelfde wissel. De speler tikt het bekertje aan waar Steve onder zit.
- Is de racer zelf Steve, dan schuift er niets: *"Steve ligt onder het middelste bekertje. Hij schuift niet. Hij is een steen."*
- Opmerkingen bij goed: *"Steve wist niet dat hij zoekgeraakt was."* · Bij fout: *"Steve lag daar al de hele tijd. Hij zegt niets."*

## Opmerkingen van de racer

De opmerkingen maken het spelletje; ze volgen dezelfde toon als het journaal: droog, liefdevol, kort, nooit gemeen.

- **Wanneer:** bij de start, af en toe tijdens het spel (niet bij elke zet), bij afleiding of een dutje, en bij winst, verlies of gelijkspel.
- **Waar:** in een tekstwolkje naast het plaatje van de racer, bovenaan het speelveld. Het wolkje blijft staan tot de volgende opmerking.
- **Hoeveel:** per spelletje en per moment minstens 3 algemene varianten, plus voor elke racer minstens 2 eigen opmerkingen per spelletje. Zo herhaalt het niet snel.
- **Terugval:** heeft een racer voor een moment geen eigen tekst, dan kiest de app een algemene tekst die past bij zijn sterkste eigenschap. Een nieuwe racer werkt dus altijd, ook zonder eigen teksten.

Voorbeelden van eigen opmerkingen:

| Racer | Opmerking |
| --- | --- |
| Gerard | "Gerard denkt na. Dit kan even duren." |
| Mr. M | "Mr. M heeft gewonnen. Hij weet niet hoe." |
| Turbo | "Turbo begint linksboven. Turbo begint altijd linksboven." |
| Kevin | "Kevin was wakker voor deze zet. Dat telt." |
| Charles | "Charles won dit spel in 1987 drie keer. Dat zegt hij." |
| Bintje | "Bintje ligt. Bintje blijft liggen." |
| Isabelle | "Isabelle wil eerst een knuffel. Daarna pas spelen." |
| Philippe | "Philippe moet even naar het stopcontact. Hij is zo terug." |
| Roger | "Roger heeft het bord opgeruimd. Dat was niet de bedoeling." |
| Steve | "Steve heeft gepast. Opnieuw." |

**Geen journaalregel.** Het journaal hoort bij de race en wordt bij gedeelde races op elke telefoon opnieuw uitgerekend. Het Picknickkleed schrijft er daarom niets in. In plaats daarvan houdt het Picknickkleed per racer een kleine stand bij op de telefoon: *Jij 3 – Gerard 1*.

## Schermen en plek in de app

Het Picknickkleed krijgt twee soorten schermen, in de bestaande huisstijl (crème, Barlow Condensed en Nunito Sans, ronde kaarten, groene hoofdknop).

**Hoe kom je er?**

- Op **Home** een kaart onder de racegegevens: *Even pauze? Speel een spelletje op het Picknickkleed.*
- In **Meer** een eigen kopje *Picknickkleed*.
- De menubalk onderaan blijft zoals hij is; daar is geen plek voor een zesde knop.

**Scherm 1: het Picknickkleed (overzicht)**

- Bovenaan: de gekozen racer, groot, zittend op het kleed, met de knop *Andere racer*.
- Daaronder vijf tegels, een per spelletje: plaatje, naam, één regel uitleg en de stand tegen deze racer (*Jij 3 – Gerard 1*).
- Achtergrond: een rood-wit geblokt picknickkleed op het gras.

**Scherm 2: een spelletje (zelfde opbouw voor alle vijf)**

- Kop met terugknop en de naam van het spelletje.
- De racer klein links, met het tekstwolkje ernaast.
- Het speelveld in het midden, groot genoeg om met een duim te tikken (vakjes minstens 64 × 64 pixels).
- Na afloop, onder het speelveld: de uitslag, de opmerking van de racer en de knoppen *Nog een potje* en *Ander spelletje*. Kleine confetti als de speler wint, dezelfde als op het finishscherm.
- Stoppen kan altijd met de terugknop; er wordt dan niets bijgehouden.

**Nieuwe afbeeldingen (te maken met ChatGPT, in dezelfde stijl):**

| Afbeelding | Gebruik |
| --- | --- |
| Picknickkleed op gras, staand, zonder figuren | Achtergrond overzicht |
| Vijf kleine plaatjes, een per spelletje | Tegels in het overzicht |
| Groen blaadje | Teken van de speler bij boter-kaas-en-eieren |
| Omgekeerd bekertje | Bekertje-schuiven |
| Kaartrug met klein Gerard-slakje | Memory |

Tot die er zijn, gebruikt Claude Code tijdelijke vormen (een geblokt patroon, een eenvoudig blaadje), zodat het werk niet hoeft te wachten.

## Uitbreidbaar en technisch

Net als racers en routes zijn de spelletjes en de opmerkingen *inhoud*: later toevoegen kan zonder programmacode te veranderen.

**Inhoud (één bestand per item)**

- `src/content/picknick/spellen/` — per spelletje: naam, uitleg van één regel, plaatje en de algemene opmerkingen per moment.
- `src/content/picknick/racers/` — per racer de eigen opmerkingen, bijvoorbeeld `gerard.ts`. Ontbreekt een bestand, dan gebruikt de app de algemene teksten (terugval).
- De bestaande racerbestanden blijven onaangeroerd: die horen bij de race en worden bij gedeelde races op de server bewaard.
- In de README komt per soort een invulvoorbeeld, zoals bij racers en accessoires.

**Techniek**

- Een eigen map `src/picknick/` met de spelregels per spelletje en de manier waarop de racer zijn zet kiest. Geen React-code daarin, zodat alles te testen is zonder telefoon.
- Schermen op de routes `/picknick` en `/picknick/<spelletje>`.
- De stand per racer staat apart op de telefoon (eigen sleutel, los van de race-opslag) en wordt niet naar de server gestuurd.
- Geen nieuwe bibliotheken nodig; de confetti bestaat al.

**Voorzichtig live zetten (er loopt een race)**

- Niets veranderen aan de race-engine, de race-opslag, de server of de bestaande racerbestanden.
- Eerst in de testversie (GitHub Pages) testen, dan pas op thegreatrandomrace.nl.
- Na het live zetten controleren dat de lopende race op Home, de racekaart, het journaal en de tussenstand er precies hetzelfde uitzien als ervoor.
- De melding *Er is een nieuwe versie van de app* zorgt dat spelers de nieuwe versie krijgen.

## Bewust niet

Geen effect op de race, geen beloningen of accessoires, geen punten of munten, geen tijdslimiet, geen meldingen, geen reeksen, geen spelen tegen andere spelers, geen ranglijst tussen spelers, geen gegevens naar de server.

## Klaar als

- [ ] Het Picknickkleed is bereikbaar via Home en via Meer.
- [ ] Alle vijf spelletjes zijn te spelen met elk van de 10 racers.
- [ ] De speelstijl komt uit de eigenschappen; Steve doet nooit iets.
- [ ] Tegen elke racer kan de speler winnen: in een test van 1.000 potjes boter-kaas-en-eieren tegen een foutloze speler wint de speler minstens 10% (behalve tegen Steve: altijd).
- [ ] Elke mini-sudoku heeft precies één oplossing (getest).
- [ ] Elke racer heeft opmerkingen; zonder eigen teksten werkt de terugval.
- [ ] De stand per racer blijft bewaard na het sluiten van de app.
- [ ] De lopende race ziet er na het live zetten precies hetzelfde uit als ervoor.
- [ ] Alles werkt op een telefoon, met de duim, ook zonder internet.

## Fasen

1. **Basis en de twee tegenstanders-spelletjes:** overzicht, racerkeuze, tekstwolkje met opmerkingen, stand per racer, boter-kaas-en-eieren en steen-papier-schaar. Testversie, daarna live.
2. **De helpers:** memory en bekertje-schuiven. Testversie, daarna live.
3. **Mini-sudoku** met de drie niveaus en de tips. Testversie, daarna live.

Na elke fase: tests draaien, de eigenaar in gewone taal uitleggen wat er nieuw is en hoe ze het op haar telefoon bekijkt, en pas live zetten na haar akkoord.
