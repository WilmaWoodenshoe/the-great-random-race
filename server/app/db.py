# De database: één SQLite-bestand. Eenvoudig te back-uppen (kopie van het bestand).
import sqlite3
import threading

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY,
    handle       BLOB NOT NULL UNIQUE,      -- willekeurige code voor de passkey
    nickname     TEXT NOT NULL,             -- bijnaam zoals getypt
    nickname_key TEXT NOT NULL UNIQUE,      -- bijnaam in kleine letters, voor 'bestaat al'
    created_at   INTEGER NOT NULL,
    status       TEXT NOT NULL DEFAULT 'pending',  -- 'pending' (wacht op goedkeuring) of 'approved'
    is_admin     INTEGER NOT NULL DEFAULT 0
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

-- Gedeelde races. Tijden in milliseconden (zoals in de app).
CREATE TABLE IF NOT EXISTS races (
    id           INTEGER PRIMARY KEY,       -- ook het racenummer
    name         TEXT NOT NULL,
    course_id    TEXT NOT NULL,
    days         INTEGER NOT NULL,
    start_time   INTEGER NOT NULL,
    seed         INTEGER NOT NULL,
    snapshot     TEXT NOT NULL,             -- racers, route en keuze-events bij het aanmaken
    created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at   INTEGER NOT NULL
);

-- Wie met welke racer meedoet. Wordt een account verwijderd tijdens de
-- race, dan rijdt de racer verder als computerracer (user_id leeg).
CREATE TABLE IF NOT EXISTS participants (
    race_id      INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
    user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    racer_id     TEXT NOT NULL,
    nickname     TEXT NOT NULL,
    joined_at    INTEGER NOT NULL,
    PRIMARY KEY (race_id, racer_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS participants_user ON participants(race_id, user_id);

-- Keuzes en dagelijkse acties van spelers in een gedeelde race.
CREATE TABLE IF NOT EXISTS moves (
    id           INTEGER PRIMARY KEY,
    race_id      INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
    racer_id     TEXT NOT NULL,
    kind         TEXT NOT NULL,             -- 'decision' of 'action'
    key          TEXT NOT NULL,             -- keuze-event (decision) of dag (action)
    value        TEXT NOT NULL,             -- gekozen optie of actie
    time         INTEGER NOT NULL,
    UNIQUE (race_id, racer_id, kind, key)
);

-- Oud (v0.2): het spelersoverzicht staat nu bij de races.
DROP TABLE IF EXISTS players;
"""


def migrate(conn) -> None:
    """Oudere databases bijwerken."""
    columns = {row[1] for row in conn.execute("PRAGMA table_info(users)")}
    if "status" not in columns:
        conn.execute("ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'")
        # Wie er al was, is al goedgekeurd.
        conn.execute("UPDATE users SET status = 'approved'")
    if "is_admin" not in columns:
        conn.execute("ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0")
    # Nog geen beheerder? Dan wordt het oudste account beheerder (dat van de eigenaar).
    if not conn.execute("SELECT 1 FROM users WHERE is_admin = 1").fetchone():
        conn.execute(
            "UPDATE users SET is_admin = 1, status = 'approved' WHERE id = (SELECT id FROM users ORDER BY created_at, id LIMIT 1)"
        )


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
            # Eerst de kolommen bijwerken, dan pas de nieuwe tabellen en indexen.
            if self.conn.execute("SELECT 1 FROM sqlite_master WHERE name = 'users'").fetchone():
                migrate(self.conn)
            self.conn.executescript(SCHEMA)
            migrate(self.conn)

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
