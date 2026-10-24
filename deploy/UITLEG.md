# The Great Random Race online zetten op thegreatrandomrace.nl

Op de server (188.245.10.74) draait **nginx**, dat ook PGRavenswaaij en Reshipi uitdeelt. The Great Random Race komt daar als derde site bij. De andere sites merken daar niets van.

**Hoe het werkt:** bij elke wijziging op `main` maakt GitHub de echte versie en zet die in de tak `productie`. De server haalt die tak elke 5 minuten zelf op. Er zijn geen wachtwoorden of sleutels nodig, want het project is openbaar.

Je werkt in **PowerShell**. Log eerst in op de server:

```
ssh root@188.245.10.74
```

Elke stap hieronder: tekst in het grijze vak precies overtypen (of kopiëren) en op Enter drukken.

---

## Stap 1 — Domein laten wijzen naar de server (bij Vimexx)

In het Vimexx-klantenpaneel, bij de DNS van `thegreatrandomrace.nl`:

| Type | Naam | Waarde | TTL |
|---|---|---|---|
| A | `@` (of leeg) | `188.245.10.74` | 300 |
| A | `www` | `188.245.10.74` | 300 |

Staat er al een A-record met een ander adres: wijzig dat. Staat er een **AAAA**-record: verwijder dat (anders proberen sommige telefoons een verkeerd adres).

Controleren (in PowerShell op je eigen computer, niet op de server):

```
nslookup thegreatrandomrace.nl
```

Zie je `188.245.10.74`? Dan is het klaar. Zo niet: 5 tot 15 minuten wachten en opnieuw proberen.

## Stap 2 — Git klaarzetten (op de server)

```
apt-get install -y git
```

## Stap 3 — De app op de server zetten

```
git clone --branch productie --single-branch https://github.com/WilmaWoodenshoe/the-great-random-race.git /var/www/thegreatrandomrace
```

## Stap 4 — nginx vertellen over de nieuwe site

```
curl -fsSL -o /etc/nginx/sites-available/thegreatrandomrace https://raw.githubusercontent.com/WilmaWoodenshoe/the-great-random-race/main/deploy/nginx-thegreatrandomrace.conf
ln -s /etc/nginx/sites-available/thegreatrandomrace /etc/nginx/sites-enabled/thegreatrandomrace
nginx -t
```

Er moet staan: `syntax is ok` en `test is successful`. **Alleen dan** verder met:

```
systemctl reload nginx
```

(Staat er een fout? Stop hier en stuur de tekst door. Je andere sites blijven gewoon draaien zolang je niet herlaadt.)

## Stap 5 — HTTPS aanzetten (het slotje)

Dit kan pas als stap 1 klaar is.

```
certbot --nginx -d thegreatrandomrace.nl -d www.thegreatrandomrace.nl
```

Vraagt certbot of het verkeer moet worden doorgestuurd naar HTTPS ("redirect"), kies dan **ja** (meestal optie 2). Zegt de server `certbot: command not found`, doe dan eerst:

```
apt-get install -y certbot python3-certbot-nginx
```

## Stap 6 — Automatisch bijwerken elke 5 minuten

```
(crontab -l 2>/dev/null; echo '*/5 * * * * cd /var/www/thegreatrandomrace && git fetch -q origin productie && git reset -q --hard origin/productie') | crontab -
```

Controleren:

```
crontab -l
```

Je ziet de regel met `*/5` staan (eventueel naast regels die er al stonden).

## Stap 7 — Kijken

Open op je telefoon **https://thegreatrandomrace.nl**. Je ziet het welkomstscherm met Gerard en een slotje in de adresbalk.

---

## Later

- **Een nieuwe versie** komt vanzelf: binnen 5 minuten nadat GitHub klaar is.
- **Iets misgegaan?** De site uitzetten zonder de andere sites te raken:
  ```
  rm /etc/nginx/sites-enabled/thegreatrandomrace && systemctl reload nginx
  ```
