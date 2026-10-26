# Sessies (ingelogd blijven) en een eenvoudige rem op te veel verzoeken.
import hashlib
import secrets
import threading
import time
from collections import defaultdict, deque

from .db import Database

SESSION_COOKIE = "grr_sessie"
# Een jaar ingelogd blijven: snel even kijken moet zonder gedoe kunnen.
SESSION_SECONDS = 365 * 24 * 3600


def _hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_session(db: Database, user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    now = int(time.time())
    db.execute(
        "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        (_hash(token), user_id, now, now + SESSION_SECONDS),
    )
    return token


def session_user(db: Database, token: str | None) -> int | None:
    if not token:
        return None
    row = db.one("SELECT user_id, expires_at FROM sessions WHERE token_hash = ?", (_hash(token),))
    if not row or row["expires_at"] < time.time():
        return None
    return row["user_id"]


def end_session(db: Database, token: str | None) -> None:
    if token:
        db.execute("DELETE FROM sessions WHERE token_hash = ?", (_hash(token),))


def cleanup(db: Database) -> None:
    """Verlopen sessies en keuze-uitdagingen opruimen."""
    now = int(time.time())
    db.execute("DELETE FROM sessions WHERE expires_at < ?", (now,))
    db.execute("DELETE FROM challenges WHERE expires_at < ?", (now,))


class RateLimiter:
    """Hoogstens `limit` verzoeken per `seconds` per sleutel (bijv. IP-adres)."""

    def __init__(self, limit: int, seconds: int):
        self.limit = limit
        self.seconds = seconds
        self.hits: dict[str, deque[float]] = defaultdict(deque)
        self.lock = threading.Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self.lock:
            q = self.hits[key]
            while q and q[0] < now - self.seconds:
                q.popleft()
            if len(q) >= self.limit:
                return False
            q.append(now)
            if len(self.hits) > 10_000:
                # Oude sleutels vergeten, zodat het geheugen niet volloopt.
                for k in [k for k, v in self.hits.items() if not v or v[-1] < now - self.seconds]:
                    del self.hits[k]
            return True
