# De server van The Great Random Race (v0.2, fase B).
#
# - Accounts met een passkey (vingerafdruk of gezicht) en een bijnaam.
#   Geen wachtwoord, geen e-mailadres.
# - Per account een kopie van het spel, zodat je op een nieuwe telefoon
#   verder kunt.
# - Nieuwe accounts wachten op goedkeuring door de beheerder (de eigenaar).
# - Gedeelde races: aanmaken, meedoen, keuzes en acties (zie races.py).
#
# Draait achter nginx op https://thegreatrandomrace.nl/api. Starten:
#   uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8100

import asyncio
import json
import re
import secrets
import time
import unicodedata
from contextlib import asynccontextmanager
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from webauthn import (
    generate_authentication_options,
    generate_registration_options,
    options_to_json,
    verify_authentication_response,
    verify_registration_response,
)
from webauthn.helpers import base64url_to_bytes, generate_user_handle
from webauthn.helpers.exceptions import InvalidAuthenticationResponse, InvalidRegistrationResponse
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)

from .config import Settings, load_settings
from .db import Database
from .push import Pusher, register_push_routes
from .races import register_race_routes
from .security import SESSION_COOKIE, SESSION_SECONDS, RateLimiter, cleanup, create_session, end_session, session_user

# Een keuze-uitdaging (het 'raadsel' voor de passkey) is 5 minuten geldig.
CHALLENGE_SECONDS = 300
# Een opgeslagen spel is normaal een paar tientallen kB.
MAX_SAVE_BYTES = 512 * 1024
NICKNAME_MIN, NICKNAME_MAX = 2, 20
# Letters (ook met accenten), cijfers, spatie, - _ . '
NICKNAME_RE = re.compile(r"^[\w .'\-]+$")


def normalize_nickname(raw: str) -> str:
    nick = unicodedata.normalize("NFC", raw)
    nick = " ".join(nick.split())
    if not (NICKNAME_MIN <= len(nick) <= NICKNAME_MAX) or not NICKNAME_RE.match(nick):
        raise HTTPException(422, "Een bijnaam heeft 2 tot 20 tekens: letters, cijfers, spaties, - _ . of '.")
    return nick


def nickname_key(nick: str) -> str:
    return nick.casefold()


# ---------- Verzoeken ----------


class RegisterStart(BaseModel):
    nickname: str


class Finish(BaseModel):
    flowId: str
    credential: dict[str, Any]


class SaveIn(BaseModel):
    # Je eigen spelgegevens (uitslagen, wat je al gezien hebt); de gedeelde races staan apart.
    save: dict[str, Any]


# ---------- De app ----------


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or load_settings()
    db = Database(settings.db_path)
    register_limit = RateLimiter(20, 600)
    login_limit = RateLimiter(60, 600)
    save_limit = RateLimiter(240, 3600)
    read_limit = RateLimiter(300, 600)

    pusher = Pusher(db, settings.db_path, settings.origin)

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        cleanup(db)
        task = asyncio.create_task(pusher.run_forever())
        yield
        task.cancel()

    app = FastAPI(title="The Great Random Race", docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan)
    app.state.db = db
    app.state.settings = settings
    app.state.pusher = pusher

    @app.middleware("http")
    async def check_origin(request: Request, call_next):
        # Wijzigingen alleen vanuit de app zelf (bescherming tegen andere websites).
        if request.method not in ("GET", "HEAD", "OPTIONS"):
            if request.headers.get("origin") != settings.origin:
                return JSONResponse({"detail": "Verkeerde herkomst."}, status_code=403)
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        return response

    def client_ip(request: Request) -> str:
        # nginx geeft het echte adres door; het adres wordt niet bewaard.
        return request.headers.get("x-real-ip") or (request.client.host if request.client else "?")

    def limit(limiter: RateLimiter, key: str) -> None:
        if not limiter.allow(key):
            raise HTTPException(429, "Even rustig aan. Probeer het over een paar minuten opnieuw.")

    def current_user(request: Request) -> int:
        user_id = session_user(db, request.cookies.get(SESSION_COOKIE))
        if user_id is None:
            raise HTTPException(401, "Niet ingelogd.")
        return user_id

    def set_session_cookie(response: Response, user_id: int) -> None:
        response.set_cookie(
            SESSION_COOKIE,
            create_session(db, user_id),
            max_age=SESSION_SECONDS,
            httponly=True,
            secure=settings.cookie_secure,
            samesite="lax",
            path="/api",
        )

    def new_flow(kind: str, challenge: bytes, user_handle: bytes | None = None, nickname: str | None = None) -> str:
        flow_id = secrets.token_urlsafe(16)
        db.execute(
            "INSERT INTO challenges (id, kind, challenge, user_handle, nickname, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
            (flow_id, kind, challenge, user_handle, nickname, int(time.time()) + CHALLENGE_SECONDS),
        )
        return flow_id

    def take_flow(flow_id: str, kind: str):
        """Een uitdaging mag maar één keer gebruikt worden."""
        with db.transaction():
            row = db.one("SELECT * FROM challenges WHERE id = ? AND kind = ?", (flow_id, kind))
            db.execute("DELETE FROM challenges WHERE id = ?", (flow_id,))
        if not row or row["expires_at"] < time.time():
            raise HTTPException(400, "Dit duurde te lang. Probeer het opnieuw.")
        return row

    def me_json(user_id: int) -> dict:
        row = db.one("SELECT nickname, created_at, status, is_admin FROM users WHERE id = ?", (user_id,))
        return {
            "id": user_id,
            "nickname": row["nickname"],
            "createdAt": row["created_at"],
            "status": row["status"],
            "isAdmin": bool(row["is_admin"]),
        }

    def approved_user(user_id: int = Depends(current_user)) -> int:
        row = db.one("SELECT status FROM users WHERE id = ?", (user_id,))
        if not row or row["status"] != "approved":
            raise HTTPException(403, "Je account wacht nog op goedkeuring.")
        return user_id

    def admin_user(user_id: int = Depends(current_user)) -> int:
        row = db.one("SELECT is_admin FROM users WHERE id = ?", (user_id,))
        if not row or not row["is_admin"]:
            raise HTTPException(403, "Alleen voor de beheerder.")
        return user_id

    def delete_user(user_id: int) -> None:
        """Account weg. In races die nog niet begonnen zijn, verdwijnt de racer;
        in lopende races rijdt hij verder als computerracer."""
        now_ms = int(time.time() * 1000)
        with db.transaction():
            db.execute(
                "DELETE FROM participants WHERE user_id = ? AND race_id IN (SELECT id FROM races WHERE start_time > ?)",
                (user_id, now_ms),
            )
            db.execute("UPDATE participants SET nickname = '' WHERE user_id = ?", (user_id,))
            db.execute("DELETE FROM users WHERE id = ?", (user_id,))
            # Lege races die nog niet begonnen zijn, hebben geen zin meer.
            # (Races van de beheerder blijven staan, ook als ze leeg zijn.)
            db.execute(
                "DELETE FROM races WHERE start_time > ? AND id NOT IN (SELECT race_id FROM participants) "
                "AND (created_by IS NULL OR created_by NOT IN (SELECT id FROM users WHERE is_admin = 1))",
                (now_ms,),
            )

    @app.get("/api/health")
    def health():
        return {"ok": True}

    # ----- Account aanmaken -----

    @app.post("/api/register/start")
    def register_start(body: RegisterStart, request: Request):
        limit(register_limit, client_ip(request))
        nick = normalize_nickname(body.nickname)
        if db.one("SELECT 1 FROM users WHERE nickname_key = ?", (nickname_key(nick),)):
            raise HTTPException(409, "Deze bijnaam is al bezet. Kies een andere.")
        user_handle = generate_user_handle()
        options = generate_registration_options(
            rp_id=settings.rp_id,
            rp_name=settings.rp_name,
            user_id=user_handle,
            user_name=nick,
            user_display_name=nick,
            authenticator_selection=AuthenticatorSelectionCriteria(
                # De passkey onthoudt zelf bij wie hij hoort: inloggen zonder bijnaam te typen.
                resident_key=ResidentKeyRequirement.REQUIRED,
                user_verification=UserVerificationRequirement.PREFERRED,
            ),
        )
        flow_id = new_flow("register", options.challenge, user_handle, nick)
        return {"flowId": flow_id, "options": json.loads(options_to_json(options))}

    @app.post("/api/register/finish")
    def register_finish(body: Finish, response: Response):
        flow = take_flow(body.flowId, "register")
        try:
            verified = verify_registration_response(
                credential=body.credential,
                expected_challenge=flow["challenge"],
                expected_rp_id=settings.rp_id,
                expected_origin=settings.origin,
            )
        except (InvalidRegistrationResponse, ValueError, KeyError, TypeError) as err:
            raise HTTPException(400, "De passkey kon niet worden gecontroleerd.") from err
        nick = flow["nickname"]
        now = int(time.time())
        with db.transaction():
            if db.one("SELECT 1 FROM users WHERE nickname_key = ?", (nickname_key(nick),)):
                raise HTTPException(409, "Deze bijnaam is net door iemand anders gekozen. Kies een andere.")
            if db.one("SELECT 1 FROM credentials WHERE id = ?", (verified.credential_id,)):
                raise HTTPException(409, "Deze passkey is al in gebruik.")
            # Het allereerste account is van de eigenaar: beheerder en meteen goedgekeurd.
            first = db.one("SELECT 1 FROM users WHERE is_admin = 1") is None
            cur = db.execute(
                "INSERT INTO users (handle, nickname, nickname_key, created_at, status, is_admin) VALUES (?, ?, ?, ?, ?, ?)",
                (flow["user_handle"], nick, nickname_key(nick), now, "approved" if first else "pending", int(first)),
            )
            user_id = cur.lastrowid
            db.execute(
                "INSERT INTO credentials (id, user_id, public_key, sign_count, created_at) VALUES (?, ?, ?, ?, ?)",
                (verified.credential_id, user_id, verified.credential_public_key, verified.sign_count, now),
            )
        set_session_cookie(response, user_id)
        return me_json(user_id)

    # ----- Inloggen -----

    @app.post("/api/login/start")
    def login_start(request: Request):
        limit(login_limit, client_ip(request))
        # Geen lijst met passkeys meegeven: de telefoon laat zelf zien welke er zijn.
        options = generate_authentication_options(
            rp_id=settings.rp_id,
            user_verification=UserVerificationRequirement.PREFERRED,
        )
        flow_id = new_flow("login", options.challenge)
        return {"flowId": flow_id, "options": json.loads(options_to_json(options))}

    @app.post("/api/login/finish")
    def login_finish(body: Finish, response: Response):
        flow = take_flow(body.flowId, "login")
        try:
            credential_id = base64url_to_bytes(str(body.credential.get("rawId") or body.credential.get("id")))
        except (ValueError, TypeError) as err:
            raise HTTPException(400, "Onbekende passkey.") from err
        cred = db.one("SELECT * FROM credentials WHERE id = ?", (credential_id,))
        if not cred:
            raise HTTPException(400, "Deze passkey kennen we niet. Misschien is het account verwijderd.")
        try:
            verified = verify_authentication_response(
                credential=body.credential,
                expected_challenge=flow["challenge"],
                expected_rp_id=settings.rp_id,
                expected_origin=settings.origin,
                credential_public_key=cred["public_key"],
                credential_current_sign_count=cred["sign_count"],
            )
        except (InvalidAuthenticationResponse, ValueError, KeyError, TypeError) as err:
            raise HTTPException(400, "De passkey kon niet worden gecontroleerd.") from err
        db.execute(
            "UPDATE credentials SET sign_count = ?, last_used_at = ? WHERE id = ?",
            (verified.new_sign_count, int(time.time()), credential_id),
        )
        set_session_cookie(response, cred["user_id"])
        return me_json(cred["user_id"])

    @app.post("/api/logout")
    def logout(request: Request, response: Response):
        end_session(db, request.cookies.get(SESSION_COOKIE))
        response.delete_cookie(SESSION_COOKIE, path="/api")
        return {"ok": True}

    # ----- Account -----

    @app.get("/api/me")
    def me(user_id: int = Depends(current_user)):
        return me_json(user_id)

    @app.delete("/api/me")
    def delete_me(response: Response, user_id: int = Depends(current_user)):
        # Alles van dit account gaat weg: passkeys, sessies en spel.
        delete_user(user_id)
        response.delete_cookie(SESSION_COOKIE, path="/api")
        return {"ok": True}

    # ----- Beheer (alleen de beheerder) -----

    @app.get("/api/admin/users")
    def admin_users(_admin: int = Depends(admin_user)):
        rows = db.all(
            "SELECT u.id, u.nickname, u.status, u.is_admin, u.created_at, "
            "(SELECT MAX(last_used_at) FROM credentials c WHERE c.user_id = u.id) AS last_login "
            "FROM users u ORDER BY (u.status = 'pending') DESC, u.created_at DESC"
        )
        return {
            "users": [
                {
                    "id": r["id"],
                    "nickname": r["nickname"],
                    "status": r["status"],
                    "isAdmin": bool(r["is_admin"]),
                    "createdAt": r["created_at"],
                    "lastLogin": r["last_login"],
                }
                for r in rows
            ]
        }

    @app.post("/api/admin/users/{target}/approve")
    def admin_approve(target: int, _admin: int = Depends(admin_user)):
        cur = db.execute("UPDATE users SET status = 'approved' WHERE id = ?", (target,))
        if cur.rowcount == 0:
            raise HTTPException(404, "Dit account bestaat niet (meer).")
        return {"ok": True}

    @app.delete("/api/admin/users/{target}")
    def admin_delete(target: int, admin: int = Depends(admin_user)):
        row = db.one("SELECT is_admin FROM users WHERE id = ?", (target,))
        if not row:
            raise HTTPException(404, "Dit account bestaat niet (meer).")
        if target == admin or row["is_admin"]:
            raise HTTPException(400, "Een beheerder kan hier niet verwijderd worden.")
        delete_user(target)
        return {"ok": True}

    register_race_routes(app, db, approved_user, current_user, admin_user, lambda r: limit(read_limit, client_ip(r)))
    register_push_routes(app, db, pusher, current_user)

    # ----- Spel bewaren -----

    @app.get("/api/save")
    def get_save(user_id: int = Depends(current_user)):
        row = db.one("SELECT data, updated_at FROM saves WHERE user_id = ?", (user_id,))
        if not row:
            return {"save": None, "updatedAt": None}
        return {"save": json.loads(row["data"]), "updatedAt": row["updated_at"]}

    @app.put("/api/save")
    async def put_save(request: Request, user_id: int = Depends(current_user)):
        limit(save_limit, f"user:{user_id}")
        raw = await request.body()
        if len(raw) > MAX_SAVE_BYTES:
            raise HTTPException(413, "Het spel is te groot om te bewaren.")
        try:
            body = SaveIn.model_validate_json(raw)
        except ValueError as err:
            raise HTTPException(422, "Dit is geen geldig spel.") from err
        now = int(time.time())
        data = json.dumps(body.save, separators=(",", ":"))
        with db.transaction():
            db.execute(
                "INSERT INTO saves (user_id, data, updated_at) VALUES (?, ?, ?) "
                "ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
                (user_id, data, now),
            )
        return {"updatedAt": now}

    return app

