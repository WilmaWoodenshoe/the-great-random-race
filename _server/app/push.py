# Dagelijkse melding op de telefoon tijdens een race.
#
# - Je zet het zelf aan in de app (Meer → Account). De telefoon geeft dan
#   een adres van zijn eigen meldingendienst (Google, Apple, Mozilla of
#   Microsoft); alleen dat adres en twee sleutels worden bewaard.
# - Elke dag om SEND_HOUR uur (Nederlandse tijd) krijgt iedereen die in een
#   lopende race zit één grappig bericht. De berichten staan in
#   src/content/meldingen.json.
# - De VAPID-sleutel (waarmee de meldingendienst weet dat het bericht van
#   deze server komt) maakt de server zelf aan, naast de database.

import asyncio
import json
import logging
import os
import random
import time
from datetime import datetime
from pathlib import Path
from typing import Callable
from urllib.parse import urlparse

from cryptography.hazmat.primitives import serialization
from fastapi import Depends, FastAPI, HTTPException
from py_vapid import Vapid
from py_vapid.utils import b64urlencode
from pydantic import BaseModel, Field

from .db import Database
from .races import DAY_MS, NL_TIME, nl_day

log = logging.getLogger("grr.push")

# Om dit uur (Nederlandse tijd) gaat de melding van de dag de deur uit.
SEND_HOUR = 19
CHECK_SECONDS = 300
MAX_PER_USER = 10
# Alleen echte meldingendiensten: de server stuurt nooit iets naar andere adressen.
PUSH_HOSTS = (".googleapis.com", ".mozilla.com", ".push.apple.com", ".notify.windows.com")


class Keys(BaseModel):
    p256dh: str = Field(min_length=10, max_length=200)
    auth: str = Field(min_length=10, max_length=100)


class SubscribeIn(BaseModel):
    endpoint: str = Field(max_length=1000)
    keys: Keys


class UnsubscribeIn(BaseModel):
    endpoint: str = Field(max_length=1000)


def load_texts() -> dict:
    """De berichten: op de server naast de code, bij het ontwikkelen uit src/content."""
    here = Path(__file__).resolve().parent
    for path in (here / "meldingen.json", here.parents[1] / "src" / "content" / "meldingen.json"):
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
    raise FileNotFoundError("meldingen.json niet gevonden")


def fill(text: str, name: str, pronoun: str, route: str) -> str:
    zij = pronoun == "zij"
    words = {
        "{naam}": name,
        "{Hij}": "Zij" if zij else "Hij",
        "{hij}": "zij" if zij else "hij",
        "{zijn}": "haar" if zij else "zijn",
        "{hem}": "haar" if zij else "hem",
        "{route}": route,
    }
    for key, value in words.items():
        text = text.replace(key, value)
    return text


def allowed_endpoint(endpoint: str) -> bool:
    url = urlparse(endpoint)
    host = (url.hostname or "").lower()
    return url.scheme == "https" and any(host.endswith(h) or host == h[1:] for h in PUSH_HOSTS)


def load_vapid(db_path: str) -> Vapid:
    """De sleutel van deze server; de eerste keer wordt hij gemaakt."""
    if db_path == ":memory:":
        vapid = Vapid()
        vapid.generate_keys()
        return vapid
    path = Path(db_path).resolve().parent / "vapid-private.pem"
    if not path.exists():
        vapid = Vapid()
        vapid.generate_keys()
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "wb") as f:
            f.write(vapid.private_pem())
    return Vapid.from_file(str(path))


def send_webpush(vapid: Vapid, contact: str) -> Callable[[dict, str], int]:
    """Verstuurt één melding; geeft de HTTP-status van de meldingendienst terug."""
    from pywebpush import WebPushException, webpush

    def send(subscription: dict, data: str) -> int:
        try:
            res = webpush(subscription, data, vapid_private_key=vapid, vapid_claims={"sub": contact}, ttl=12 * 3600, timeout=15)
            return res.status_code
        except WebPushException as err:
            return err.response.status_code if err.response is not None else 0

    return send


class Pusher:
    def __init__(self, db: Database, db_path: str, contact: str, sender: Callable[[dict, str], int] | None = None):
        self.db = db
        self.vapid = load_vapid(db_path)
        self.sender = sender or send_webpush(self.vapid, contact)
        self.texts = load_texts()

    def public_key(self) -> str:
        raw = self.vapid.public_key.public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
        return b64urlencode(raw)

    def due(self, at_ms: int) -> list[tuple[str, dict, str]]:
        """Welke meldingen moeten nu weg? Markeert ze meteen als verstuurd voor vandaag."""
        if datetime.fromtimestamp(at_ms / 1000, NL_TIME).hour < SEND_HOUR:
            return []
        today = nl_day(at_ms)
        out = []
        subs = self.db.all(
            "SELECT * FROM push_subscriptions WHERE last_sent_day IS NULL OR last_sent_day != ?", (today,)
        )
        for sub in subs:
            self.db.execute("UPDATE push_subscriptions SET last_sent_day = ? WHERE endpoint = ?", (today, sub["endpoint"]))
            race = self.db.one(
                "SELECT r.snapshot, p.racer_id FROM participants p JOIN races r ON r.id = p.race_id "
                "WHERE p.user_id = ? AND r.start_time <= ? AND r.start_time + r.days * ? > ? ORDER BY r.start_time LIMIT 1",
                (sub["user_id"], at_ms, DAY_MS, at_ms),
            )
            if not race:
                continue
            snapshot = json.loads(race["snapshot"])
            racer = next((r for r in snapshot.get("racers", []) if r.get("id") == race["racer_id"]), {})
            route = (snapshot.get("course") or {}).get("name") or "de route"
            rng = random.Random(f"{sub['user_id']}-{today}")
            text = fill(rng.choice(self.texts["berichten"]), racer.get("name") or "Je racer", racer.get("pronoun") or "hij", route)
            payload = json.dumps({"title": self.texts["titel"], "body": text, "url": "./"})
            info = {"endpoint": sub["endpoint"], "keys": {"p256dh": sub["p256dh"], "auth": sub["auth"]}}
            out.append((sub["endpoint"], info, payload))
        return out

    def send_due(self, at_ms: int) -> int:
        sent = 0
        for endpoint, info, payload in self.due(at_ms):
            status = self.sender(info, payload)
            if status in (404, 410):
                # De telefoon heeft meldingen uitgezet of de app verwijderd.
                self.db.execute("DELETE FROM push_subscriptions WHERE endpoint = ?", (endpoint,))
            elif 200 <= status < 300:
                sent += 1
            else:
                log.warning("Melding niet verstuurd (status %s)", status)
        return sent

    async def run_forever(self) -> None:
        while True:
            try:
                await asyncio.to_thread(self.send_due, int(time.time() * 1000))
            except Exception:  # de server mag hierdoor nooit stoppen
                log.exception("Fout bij het versturen van meldingen")
            await asyncio.sleep(CHECK_SECONDS)


def register_push_routes(app: FastAPI, db: Database, pusher: Pusher, current_user: Callable) -> None:
    @app.get("/api/push/key")
    def push_key():
        return {"key": pusher.public_key()}

    @app.post("/api/push/subscribe")
    def subscribe(body: SubscribeIn, user_id: int = Depends(current_user)):
        if not allowed_endpoint(body.endpoint):
            raise HTTPException(422, "Onbekende meldingendienst.")
        with db.transaction():
            db.execute(
                "INSERT INTO push_subscriptions (endpoint, user_id, p256dh, auth, created_at) VALUES (?, ?, ?, ?, ?) "
                "ON CONFLICT(endpoint) DO UPDATE SET user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth",
                (body.endpoint, user_id, body.keys.p256dh, body.keys.auth, int(time.time())),
            )
            # Niet eindeloos veel telefoons per account: de oudste vervalt.
            db.execute(
                "DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint NOT IN "
                "(SELECT endpoint FROM push_subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?)",
                (user_id, user_id, MAX_PER_USER),
            )
        return {"ok": True}

    @app.post("/api/push/unsubscribe")
    def unsubscribe(body: UnsubscribeIn, user_id: int = Depends(current_user)):
        db.execute("DELETE FROM push_subscriptions WHERE endpoint = ? AND user_id = ?", (body.endpoint, user_id))
        return {"ok": True}
