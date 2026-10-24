# De database: één SQLite-bestand. Eenvoudig te back-uppen (kopie van het bestand).
import sqlite3
import threading

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY,
    handle       BLOB NOT NULL UNIQUE,      -- willekeurige code voor de passkey
    nickname     TEXT NOT NULL,             -- bijnaam zoals getypt
    nickname_key TEXT NOT NULL UNIQUE,      -- bijnaam in kleine letters, voor 'bestaat al'
    created_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials (
    id           BLOB PRIMARY KEY,          -- id van de passkey
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    public_key   BLOB NOT NULL,
    sign_count   INTEGER NOT NULL,
    created_at   INTEGER NOT NULL,
    last_used_at INTEGER
);

CREATE TABLE IF NOT EXISTS sessions (
    token_hash   TEXT PRIMARY KEY,          -- alleen een hash; de sleutel zelf staat in de cookie
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   INTEGER NOT NULL,
    expires_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS challenges (
    id           TEXT PRIMARY KEY,
    kind         TEXT NOT NULL,             -- 'register' of 'login'
    challenge    BLOB NOT NULL,
    user_handle  BLOB,
    nickname     TEXT,
    expires_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS saves (
    user_id      INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    data         TEXT NOT NULL,             -- het spel (JSON), zoals de app het bewaart
    updated_at   INTEGER NOT NULL
);

-- Wat iedereen mag zien: met welke racer iemand speelt en hoe het gaat.
CREATE TABLE IF NOT EXISTS players (
    user_id      INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    racer_id     TEXT NOT NULL,
    race_number  INTEGER NOT NULL,
    position     INTEGER NOT NULL,
    racers_count INTEGER NOT NULL,
    km           REAL NOT NULL,
    finished     INTEGER NOT NULL,
    updated_at   INTEGER NOT NULL
);
"""


class Database:
    """Eén verbinding, beschermd met een slot: ruim genoeg voor dit spel."""

    def __init__(self, path: str):
        self.conn = sqlite3.connect(path, check_same_thread=False, isolation_level=None)
        self.conn.row_factory = sqlite3.Row
        self.lock = threading.RLock()
        with self.lock:
            self.conn.execute("PRAGMA foreign_keys = ON")
            if path != ":memory:":
                self.conn.execute("PRAGMA journal_mode = WAL")
            self.conn.executescript(SCHEMA)

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor:
        with self.lock:
            return self.conn.execute(sql, params)

    def one(self, sql: str, params: tuple = ()) -> sqlite3.Row | None:
        with self.lock:
            return self.conn.execute(sql, params).fetchone()

    def all(self, sql: str, params: tuple = ()) -> list[sqlite3.Row]:
        with self.lock:
            return self.conn.execute(sql, params).fetchall()

    def transaction(self):
        return _Transaction(self)


class _Transaction:
    def __init__(self, db: Database):
        self.db = db

    def __enter__(self):
        self.db.lock.acquire()
        self.db.conn.execute("BEGIN")
        return self.db

    def __exit__(self, exc_type, exc, tb):
        try:
            self.db.conn.execute("ROLLBACK" if exc_type else "COMMIT")
        finally:
            self.db.lock.release()
        return False
