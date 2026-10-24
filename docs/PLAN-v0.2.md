# Plan v0.2 — eigen racer kiezen, accounts en spelersoverzicht

Besloten door de eigenaar (24 oktober 2026):

- **Racer kiezen:** elke speler kiest zelf een racer uit alle racers.
- **Tegenstanders:** elke race 5 willekeurige tegenstanders uit de overige racers.
- **Accounts:** echte accounts met een **passkey** (vingerafdruk/gezicht), met een zelfgekozen bijnaam. Geen wachtwoord, geen e-mail.
- **Zichtbaarheid:** **iedereen** ziet wie met welke racer speelt en hoe het gaat.

## Fases

| Fase | Wat | Nodig |
|---|---|---|
| A | Kies je racer: 4 nieuwe racers (Bintje, Isabelle, Philippe, Roger), alle teksten voor elke racer (hij/zij), willekeurige tegenstanders, balans | Alleen de app |
| B | Backend op de Hetzner-server: Python + FastAPI, accounts met passkey, spel opslaan per account | Server; HTTPS (certbot) |
| C | Account in de app: bijnaam + passkey aanmaken, inloggen (ook op een nieuwe telefoon), spel bewaren op de server | Fase B |
| D | Spelersoverzicht voor iedereen, account verwijderen, privacyverklaring bijwerken | Fase C |

## Technische keuzes

- Backend: **Python + FastAPI** (zoals hoofdstuk 17 van de briefing). Database voorlopig **SQLite** (één bestand, eenvoudig te back-uppen); later over te zetten naar PostgreSQL als het groter wordt.
- De backend draait op dezelfde server, achter nginx op `https://thegreatrandomrace.nl/api`. Zo hoeven passkeys en cookies niet over verschillende domeinen.
- Passkeys werken alleen op `https://thegreatrandomrace.nl` (niet op de testversie op GitHub Pages). De testversie blijft zonder account werken.
- Het spel blijft op de telefoon draaien (ook offline); de server bewaart een kopie per account en het overzicht voor iedereen.
