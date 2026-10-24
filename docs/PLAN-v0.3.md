# Plan v0.3 — samen racen

Besloten door de eigenaar (24 oktober 2026):

- **Eerst een account, dan pas racen.** Op thegreatrandomrace.nl kun je alleen met een account meedoen.
- **Nieuwe accounts eerst goedkeuren.** De beheerder (de eigenaar) ziet onder *Meer → Beheer* wie er wacht, en kan goedkeuren, weigeren of later verwijderen. Het oudste account is automatisch beheerder.
- **Gedeelde races.** Iedereen met een goedgekeurd account kan een race starten. Anderen doen mee via de **lijst met open races** (*Meer → Races*).
- **Vast startmoment.** De maker kiest wanneer de race begint (over 1 uur, morgen 9:00, zelf kiezen, of nu meteen). Tot dan kan iedereen meedoen.
- **Duur per race: 7, 14 of 21 dagen**, door de maker gekozen. De racers gaan bij een langere race naar verhouding langzamer, zodat ze ook dan rond het einde finishen.
- **Altijd 6 racers.** Lege plekken worden bij de start aangevuld met willekeurige computerracers. Elke racer kan maar één keer per race gekozen worden.

## Hoe het werkt

- De **server** bewaart per race: naam, duur, starttijd, seed, de inhoud (racers, route, keuze-events) zoals bij het aanmaken, wie er meedoet met welke racer, en de keuzes en dagelijkse acties van de spelers (met de tijd van de server).
- De **app** rekent de race na uit die gegevens (`src/account/buildRace.ts`). Elke telefoon krijgt precies dezelfde race. Elke speler krijgt eigen keuze-events en mag zelf één actie per dag doen.
- Eén race tegelijk per speler. Afmelden kan tot de start; de maker kan de race tot de start schrappen.
- Wordt een account verwijderd tijdens een race, dan rijdt die racer verder als computerracer.
- De **testversie** (GitHub Pages) blijft zoals hij was: alleen spelen, op de telefoon, met de tijdmachine.
