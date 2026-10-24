# Gedeelde races: aanmaken, meedoen, afmelden, keuzes en acties.
#
# De server rekent de race niet uit; dat doet de app, op elke telefoon
# precies hetzelfde (vaste seed + dezelfde racers, route en keuze-events).
# De server bewaart alleen wat nodig is: wie meedoet met welke racer, en de
# keuzes en acties van de spelers, met de tijd van de server.

import json
import secrets
import time
from datetime import datetime
from typing import Any, Callable
from zoneinfo import ZoneInfo

from fastapi import Depends, FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

from .db import Database

DAY_MS = 24 * 3600 * 1000
RACERS_PER_RACE = 6
ALLOWED_DAYS = (7, 14, 21)
# Een race mag tot twee weken vooruit gepland worden.
MAX_PLAN_AHEAD_MS = 14 * DAY_MS
MAX_SNAPSHOT_BYTES = 300 * 1024
# Afgelopen races blijven nog twee weken in de lijst staan.
SHOW_FINISHED_MS = 14 * DAY_MS
ACTIONS = ("voeren", "aanmoedigen", "hoed", "niets")
NL_TIME = ZoneInfo("Europe/Amsterdam")
ID_PATTERN = r"^[a-z0-9-]{1,60}$"


class RaceIn(BaseModel):
    name: str = Field(default="", max_length=40)
    courseId: str = Field(pattern=ID_PATTERN)
    days: int
    startTime: int
    racerId: str = Field(pattern=ID_PATTERN)
    # Racers, route en keuze-events zoals de app ze kent bij het aanmaken.
    snapshot: dict[str, Any]


class JoinIn(BaseModel):
    racerId: str = Field(pattern=ID_PATTERN)


class MoveIn(BaseModel):
    kind: str = Field(pattern=r"^(decision|action)$")
    # Bij een keuze: welk keuze-event. Bij een actie: leeg (de server bepaalt de dag).
    key: str = Field(default="", max_length=80)
    value: str = Field(pattern=ID_PATTERN)


def now_ms() -> int:
    return int(time.time() * 1000)


def nl_day(ms: int) -> str:
    """Kalenderdag in Nederland, bijv. '2026-10-25' (één actie per dag)."""
    return datetime.fromtimestamp(ms / 1000, NL_TIME).strftime("%Y-%m-%d")


def register_race_routes(
    app: FastAPI,
    db: Database,
    approved_user: Callable,
    current_user: Callable,
    admin_user: Callable,
    read_limit: Callable[[Request], None],
) -> None:
    def end_time(row) -> int:
        return row["start_time"] + row["days"] * DAY_MS

    def status_of(row, at: int) -> str:
        if at < row["start_time"]:
            return "open"
        return "running" if at < end_time(row) else "finished"

    def participants_of(race_id: int) -> list[dict]:
        rows = db.all(
            "SELECT racer_id, nickname, user_id, joined_at FROM participants WHERE race_id = ? ORDER BY joined_at, racer_id",
            (race_id,),
        )
        return [
            {"racerId": r["racer_id"], "nickname": r["nickname"], "userId": r["user_id"], "joinedAt": r["joined_at"]}
            for r in rows
        ]

    def summary(row, at: int) -> dict:
        creator = db.one("SELECT nickname FROM users WHERE id = ?", (row["created_by"],)) if row["created_by"] else None
        return {
            "id": row["id"],
            "name": row["name"],
            "courseId": row["course_id"],
            "days": row["days"],
            "startTime": row["start_time"],
            "endTime": end_time(row),
            "status": status_of(row, at),
            "createdBy": creator["nickname"] if creator else None,
            "participants": participants_of(row["id"]),
        }

    def get_race(race_id: int):
        row = db.one("SELECT * FROM races WHERE id = ?", (race_id,))
        if not row:
            raise HTTPException(404, "Deze race bestaat niet (meer).")
        return row

    def busy_race(user_id: int, at: int):
        """De race die nog niet voorbij is waar deze speler in zit, of None."""
        return db.one(
            "SELECT r.id FROM races r JOIN participants p ON p.race_id = r.id "
            "WHERE p.user_id = ? AND r.start_time + r.days * ? > ?",
            (user_id, DAY_MS, at),
        )

    def nickname_of(user_id: int) -> str:
        return db.one("SELECT nickname FROM users WHERE id = ?", (user_id,))["nickname"]

    def snapshot_racer_ids(snapshot: dict) -> set[str]:
        racers = snapshot.get("racers")
        if not isinstance(racers, list):
            return set()
        return {r.get("id") for r in racers if isinstance(r, dict) and isinstance(r.get("id"), str)}

    # ----- Lezen (iedereen) -----

    @app.get("/api/races")
    def list_races(request: Request):
        read_limit(request)
        at = now_ms()
        rows = db.all(
            "SELECT * FROM races WHERE start_time + days * ? > ? ORDER BY start_time DESC LIMIT 200",
            (DAY_MS, at - SHOW_FINISHED_MS),
        )
        return {"races": [summary(r, at) for r in rows], "now": at}

    @app.get("/api/races/{race_id}")
    def race_detail(race_id: int, request: Request):
        read_limit(request)
        row = get_race(race_id)
        moves = db.all(
            "SELECT racer_id, kind, key, value, time FROM moves WHERE race_id = ? ORDER BY time, id", (race_id,)
        )
        return {
            **summary(row, now_ms()),
            "seed": row["seed"],
            "snapshot": json.loads(row["snapshot"]),
            "moves": [
                {"racerId": m["racer_id"], "kind": m["kind"], "key": m["key"], "value": m["value"], "time": m["time"]}
                for m in moves
            ],
            "now": now_ms(),
        }

    @app.get("/api/my-race")
    def my_race(user_id: int = Depends(current_user)):
        """Je huidige race: eerst een die nog niet voorbij is, anders de laatste."""
        at = now_ms()
        row = busy_race(user_id, at) or db.one(
            "SELECT r.id FROM races r JOIN participants p ON p.race_id = r.id WHERE p.user_id = ? "
            "ORDER BY r.start_time DESC LIMIT 1",
            (user_id,),
        )
        return {"raceId": row["id"] if row else None}

    # ----- Meedoen (goedgekeurde spelers) -----

    @app.post("/api/races")
    async def create_race(request: Request, user_id: int = Depends(approved_user)):
        raw = await request.body()
        if len(raw) > MAX_SNAPSHOT_BYTES + 4096:
            raise HTTPException(413, "De race is te groot.")
        try:
            body = RaceIn.model_validate_json(raw)
        except ValueError as err:
            raise HTTPException(422, "Deze race klopt niet.") from err
        at = now_ms()
        if body.days not in ALLOWED_DAYS:
            raise HTTPException(422, "Een race duurt 7, 14 of 21 dagen.")
        if body.startTime < at - 60_000 or body.startTime > at + MAX_PLAN_AHEAD_MS:
            raise HTTPException(422, "Kies een starttijd tussen nu en over twee weken.")
        if body.racerId not in snapshot_racer_ids(body.snapshot) or len(snapshot_racer_ids(body.snapshot)) < RACERS_PER_RACE:
            raise HTTPException(422, "Deze racer bestaat niet.")
        if busy_race(user_id, at):
            raise HTTPException(409, "Je doet al mee aan een race. Eén race tegelijk.")
        name = " ".join(body.name.split())
        with db.transaction():
            cur = db.execute(
                "INSERT INTO races (name, course_id, days, start_time, seed, snapshot, created_by, created_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    name,
                    body.courseId,
                    body.days,
                    max(body.startTime, at),
                    secrets.randbelow(2**32),
                    json.dumps(body.snapshot, separators=(",", ":")),
                    user_id,
                    at,
                ),
            )
            race_id = cur.lastrowid
            db.execute(
                "INSERT INTO participants (race_id, user_id, racer_id, nickname, joined_at) VALUES (?, ?, ?, ?, ?)",
                (race_id, user_id, body.racerId, nickname_of(user_id), at),
            )
        return summary(get_race(race_id), now_ms())

    @app.post("/api/races/{race_id}/join")
    def join_race(race_id: int, body: JoinIn, user_id: int = Depends(approved_user)):
        at = now_ms()
        with db.transaction():
            row = get_race(race_id)
            if status_of(row, at) != "open":
                raise HTTPException(409, "Deze race is al begonnen.")
            if busy_race(user_id, at):
                raise HTTPException(409, "Je doet al mee aan een race. Eén race tegelijk.")
            if body.racerId not in snapshot_racer_ids(json.loads(row["snapshot"])):
                raise HTTPException(422, "Deze racer bestaat niet.")
            count = db.one("SELECT COUNT(*) AS n FROM participants WHERE race_id = ?", (race_id,))["n"]
            if count >= RACERS_PER_RACE:
                raise HTTPException(409, "Deze race is vol.")
            if db.one("SELECT 1 FROM participants WHERE race_id = ? AND racer_id = ?", (race_id, body.racerId)):
                raise HTTPException(409, "Deze racer is al gekozen door iemand anders.")
            db.execute(
                "INSERT INTO participants (race_id, user_id, racer_id, nickname, joined_at) VALUES (?, ?, ?, ?, ?)",
                (race_id, user_id, body.racerId, nickname_of(user_id), at),
            )
        return summary(get_race(race_id), now_ms())

    @app.post("/api/races/{race_id}/leave")
    def leave_race(race_id: int, user_id: int = Depends(current_user)):
        at = now_ms()
        with db.transaction():
            row = get_race(race_id)
            if status_of(row, at) != "open":
                raise HTTPException(409, "De race is al begonnen; afmelden kan niet meer.")
            db.execute("DELETE FROM participants WHERE race_id = ? AND user_id = ?", (race_id, user_id))
            if not db.one("SELECT 1 FROM participants WHERE race_id = ?", (race_id,)):
                db.execute("DELETE FROM races WHERE id = ?", (race_id,))
        return {"ok": True}

    @app.delete("/api/races/{race_id}")
    def cancel_race(race_id: int, user_id: int = Depends(current_user)):
        """Race schrappen: de maker zolang hij niet begonnen is, de beheerder altijd."""
        row = get_race(race_id)
        is_admin = bool(db.one("SELECT is_admin FROM users WHERE id = ?", (user_id,))["is_admin"])
        if not is_admin and (row["created_by"] != user_id or status_of(row, now_ms()) != "open"):
            raise HTTPException(403, "Alleen de maker kan deze race schrappen, en alleen voor de start.")
        db.execute("DELETE FROM races WHERE id = ?", (race_id,))
        return {"ok": True}

    @app.post("/api/races/{race_id}/moves")
    def add_move(race_id: int, body: MoveIn, user_id: int = Depends(approved_user)):
        at = now_ms()
        row = get_race(race_id)
        if status_of(row, at) != "running":
            raise HTTPException(409, "De race loopt nu niet.")
        me = db.one("SELECT racer_id FROM participants WHERE race_id = ? AND user_id = ?", (race_id, user_id))
        if not me:
            raise HTTPException(403, "Je doet niet mee aan deze race.")
        if body.kind == "action":
            if body.value not in ACTIONS:
                raise HTTPException(422, "Onbekende actie.")
            key = nl_day(at)
        else:
            if not body.key:
                raise HTTPException(422, "Welk keuze-event?")
            key = body.key
        try:
            db.execute(
                "INSERT INTO moves (race_id, racer_id, kind, key, value, time) VALUES (?, ?, ?, ?, ?, ?)",
                (race_id, me["racer_id"], body.kind, key, body.value, at),
            )
        except Exception as err:  # dubbel (UNIQUE)
            message = "Vandaag is er al een actie gedaan." if body.kind == "action" else "Hier is al een keuze gemaakt."
            raise HTTPException(409, message) from err
        return {"time": at, "key": key}
