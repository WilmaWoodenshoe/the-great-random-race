import time

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from tests.softauthn import SoftAuthenticator
from tests.test_api import HEADERS, ORIGIN, RP_ID

DAY = 24 * 3600 * 1000
RACERS = ["gerard", "ducky", "turbo", "kevin", "steve", "charles", "bintje", "isabelle", "philippe", "roger"]
SNAPSHOT = {"course": {"id": "grote-bosrace"}, "racers": [{"id": r} for r in RACERS], "choices": []}


@pytest.fixture
def app_(tmp_path):
    settings = Settings(rp_id=RP_ID, origin=ORIGIN, rp_name="Test", db_path=str(tmp_path / "t.db"), cookie_secure=False)
    return create_app(settings)


def player(app_, nickname):
    """Een eigen 'telefoon' (eigen cookies) met een nieuw account."""
    c = TestClient(app_, base_url="http://localhost")
    auth = SoftAuthenticator(RP_ID, ORIGIN)
    start = c.post("/api/register/start", json={"nickname": nickname}, headers=HEADERS).json()
    res = c.post(
        "/api/register/finish", json={"flowId": start["flowId"], "credential": auth.create(start["options"])}, headers=HEADERS
    )
    assert res.status_code == 200, res.text
    return c


def now_ms():
    return int(time.time() * 1000)


def new_race(c, racer="gerard", start_in=3600_000, days=7, **extra):
    body = {"name": "Testrace", "courseId": "grote-bosrace", "days": days, "startTime": now_ms() + start_in, "racerId": racer, "snapshot": SNAPSHOT, **extra}
    return c.post("/api/races", json=body, headers=HEADERS)


def approve(admin, c):
    nick = c.get("/api/me").json()["nickname"]
    users = admin.get("/api/admin/users").json()["users"]
    uid = next(u["id"] for u in users if u["nickname"] == nick)
    assert admin.post(f"/api/admin/users/{uid}/approve", headers=HEADERS).status_code == 200


# ---------- Goedkeuren en beheer ----------


def test_eerste_account_is_beheerder_en_goedgekeurd(app_):
    owner = player(app_, "Wilma")
    me = owner.get("/api/me").json()
    assert me["isAdmin"] is True and me["status"] == "approved"


def test_nieuwe_accounts_wachten_op_goedkeuring(app_):
    owner = player(app_, "Wilma")
    piet = player(app_, "Piet")
    me = piet.get("/api/me").json()
    assert me["status"] == "pending" and me["isAdmin"] is False
    assert new_race(piet).status_code == 403
    users = owner.get("/api/admin/users").json()["users"]
    assert users[0]["nickname"] == "Piet" and users[0]["status"] == "pending"  # wachtenden bovenaan
    approve(owner, piet)
    assert piet.get("/api/me").json()["status"] == "approved"
    assert new_race(piet).status_code == 200


def test_alleen_de_beheerder_ziet_het_beheer(app_):
    player(app_, "Wilma")
    piet = player(app_, "Piet")
    assert piet.get("/api/admin/users").status_code == 403
    assert piet.post("/api/admin/users/1/approve", headers=HEADERS).status_code == 403


def test_beheerder_weigert_een_account(app_):
    owner = player(app_, "Wilma")
    piet = player(app_, "Piet")
    uid = owner.get("/api/admin/users").json()["users"][0]["id"]
    assert owner.delete(f"/api/admin/users/{uid}", headers=HEADERS).status_code == 200
    assert piet.get("/api/me").status_code == 401
    assert [u["nickname"] for u in owner.get("/api/admin/users").json()["users"]] == ["Wilma"]
    # Zichzelf verwijderen via beheer kan niet.
    own_id = owner.get("/api/admin/users").json()["users"][0]["id"]
    assert owner.delete(f"/api/admin/users/{own_id}", headers=HEADERS).status_code == 400


def test_oude_database_bestaande_accounts_blijven_goedgekeurd(tmp_path):
    import sqlite3

    path = tmp_path / "oud.db"
    conn = sqlite3.connect(path)
    conn.executescript(
        "CREATE TABLE users (id INTEGER PRIMARY KEY, handle BLOB NOT NULL UNIQUE, nickname TEXT NOT NULL, "
        "nickname_key TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL);"
        "INSERT INTO users VALUES (1, x'01', 'Wilma', 'wilma', 100), (2, x'02', 'Piet', 'piet', 200);"
        "CREATE TABLE players (user_id INTEGER PRIMARY KEY);"
    )
    conn.commit()
    conn.close()
    from app.db import Database

    db = Database(str(path))
    rows = {r["nickname"]: (r["status"], r["is_admin"]) for r in db.all("SELECT * FROM users")}
    assert rows == {"Wilma": ("approved", 1), "Piet": ("approved", 0)}
    assert db.one("SELECT 1 FROM sqlite_master WHERE name = 'players'") is None


# ---------- Races ----------


def test_race_maken_en_anderen_doen_mee(app_):
    owner = player(app_, "Wilma")
    piet = player(app_, "Piet")
    approve(owner, piet)
    race = new_race(owner, "isabelle", days=21).json()
    assert race["status"] == "open" and race["days"] == 21
    assert race["endTime"] - race["startTime"] == 21 * DAY
    # In de lijst voor iedereen, ook zonder account.
    anon = TestClient(app_, base_url="http://localhost")
    listed = anon.get("/api/races").json()["races"]
    assert [r["id"] for r in listed] == [race["id"]]
    # Dezelfde racer kan niet twee keer.
    assert piet.post(f"/api/races/{race['id']}/join", json={"racerId": "isabelle"}, headers=HEADERS).status_code == 409
    res = piet.post(f"/api/races/{race['id']}/join", json={"racerId": "philippe"}, headers=HEADERS)
    assert res.status_code == 200
    assert [(p["nickname"], p["racerId"]) for p in res.json()["participants"]] == [("Wilma", "isabelle"), ("Piet", "philippe")]
    detail = anon.get(f"/api/races/{race['id']}").json()
    assert detail["seed"] >= 0 and detail["snapshot"] == SNAPSHOT and detail["moves"] == []
    assert piet.get("/api/my-race").json()["raceId"] == race["id"]


def test_een_race_tegelijk(app_):
    owner = player(app_, "Wilma")
    assert new_race(owner).status_code == 200
    assert new_race(owner).status_code == 409


def test_race_is_vol_bij_zes_spelers(app_):
    owner = player(app_, "Wilma")
    race = new_race(owner, "gerard").json()
    for i, racer in enumerate(["ducky", "turbo", "kevin", "steve", "charles"]):
        c = player(app_, f"Speler{i}")
        approve(owner, c)
        assert c.post(f"/api/races/{race['id']}/join", json={"racerId": racer}, headers=HEADERS).status_code == 200
    late = player(app_, "Laat")
    approve(owner, late)
    assert late.post(f"/api/races/{race['id']}/join", json={"racerId": "roger"}, headers=HEADERS).status_code == 409


def test_starttijd_en_duur_worden_gecontroleerd(app_):
    owner = player(app_, "Wilma")
    assert new_race(owner, days=10).status_code == 422
    assert new_race(owner, start_in=-DAY).status_code == 422
    assert new_race(owner, start_in=30 * DAY).status_code == 422
    assert new_race(owner, racer="onbekend").status_code == 422


def test_afmelden_voor_de_start_en_lege_race_verdwijnt(app_):
    owner = player(app_, "Wilma")
    race = new_race(owner).json()
    assert owner.post(f"/api/races/{race['id']}/leave", headers=HEADERS).status_code == 200
    assert owner.get(f"/api/races/{race['id']}").status_code == 404


def test_meedoen_kan_niet_meer_na_de_start(app_):
    owner = player(app_, "Wilma")
    piet = player(app_, "Piet")
    approve(owner, piet)
    race = new_race(owner, start_in=0).json()
    assert race["status"] == "running"
    assert piet.post(f"/api/races/{race['id']}/join", json={"racerId": "roger"}, headers=HEADERS).status_code == 409


def test_keuzes_en_een_actie_per_dag(app_):
    owner = player(app_, "Wilma")
    race = new_race(owner, "isabelle", start_in=0).json()
    rid = race["id"]
    ok = owner.post(f"/api/races/{rid}/moves", json={"kind": "action", "value": "hoed"}, headers=HEADERS)
    assert ok.status_code == 200
    again = owner.post(f"/api/races/{rid}/moves", json={"kind": "action", "value": "voeren"}, headers=HEADERS)
    assert again.status_code == 409
    d = owner.post(f"/api/races/{rid}/moves", json={"kind": "decision", "key": "keuze-isabelle-0", "value": "eten"}, headers=HEADERS)
    assert d.status_code == 200
    assert owner.post(f"/api/races/{rid}/moves", json={"kind": "decision", "key": "keuze-isabelle-0", "value": "zitten"}, headers=HEADERS).status_code == 409
    moves = owner.get(f"/api/races/{rid}").json()["moves"]
    assert [(m["racerId"], m["kind"], m["value"]) for m in moves] == [("isabelle", "action", "hoed"), ("isabelle", "decision", "eten")]
    assert owner.post(f"/api/races/{rid}/moves", json={"kind": "action", "value": "toveren"}, headers=HEADERS).status_code in (409, 422)


def test_wie_niet_meedoet_kan_niets_doen(app_):
    owner = player(app_, "Wilma")
    piet = player(app_, "Piet")
    approve(owner, piet)
    race = new_race(owner, start_in=0).json()
    assert piet.post(f"/api/races/{race['id']}/moves", json={"kind": "action", "value": "hoed"}, headers=HEADERS).status_code == 403


def test_account_weg_tijdens_race_racer_rijdt_door(app_):
    owner = player(app_, "Wilma")
    piet = player(app_, "Piet")
    approve(owner, piet)
    open_race = new_race(piet, "roger").json()
    owner_race = new_race(owner, "gerard", start_in=0).json()
    piet_id = next(u["id"] for u in owner.get("/api/admin/users").json()["users"] if u["nickname"] == "Piet")
    owner.delete(f"/api/admin/users/{piet_id}", headers=HEADERS)
    # De race van Piet was nog niet begonnen en had verder niemand: weg.
    assert owner.get(f"/api/races/{open_race['id']}").status_code == 404
    assert owner.get(f"/api/races/{owner_race['id']}").status_code == 200


def test_maker_kan_race_schrappen_voor_de_start(app_):
    owner = player(app_, "Wilma")
    piet = player(app_, "Piet")
    approve(owner, piet)
    race = new_race(piet).json()
    other = player(app_, "Anna")
    approve(owner, other)
    assert other.delete(f"/api/races/{race['id']}", headers=HEADERS).status_code == 403
    assert piet.delete(f"/api/races/{race['id']}", headers=HEADERS).status_code == 200
