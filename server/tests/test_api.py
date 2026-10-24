import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from tests.softauthn import SoftAuthenticator

RP_ID = "localhost"
ORIGIN = "http://localhost:5173"
HEADERS = {"Origin": ORIGIN}


@pytest.fixture
def client(tmp_path):
    settings = Settings(rp_id=RP_ID, origin=ORIGIN, rp_name="Test", db_path=str(tmp_path / "test.db"), cookie_secure=False)
    with TestClient(create_app(settings), base_url="http://localhost") as c:
        yield c


def register(client, nickname="Wilma", auth=None):
    auth = auth or SoftAuthenticator(RP_ID, ORIGIN)
    start = client.post("/api/register/start", json={"nickname": nickname}, headers=HEADERS)
    assert start.status_code == 200, start.text
    body = start.json()
    finish = client.post(
        "/api/register/finish",
        json={"flowId": body["flowId"], "credential": auth.create(body["options"])},
        headers=HEADERS,
    )
    return auth, finish


def login(client, auth):
    start = client.post("/api/login/start", headers=HEADERS).json()
    return client.post(
        "/api/login/finish", json={"flowId": start["flowId"], "credential": auth.get(start["options"])}, headers=HEADERS
    )


SAVE = {"version": 1, "race": None, "history": [], "raceCounter": 0}
SUMMARY = {"racerId": "isabelle", "raceNumber": 1, "position": 2, "racersCount": 6, "km": 13.7, "finished": False}


def test_account_aanmaken_en_ingelogd_blijven(client):
    _, res = register(client)
    assert res.status_code == 200, res.text
    assert res.json()["nickname"] == "Wilma"
    assert client.get("/api/me").json()["nickname"] == "Wilma"


def test_passkey_vraagt_om_een_inlogbare_sleutel(client):
    opts = client.post("/api/register/start", json={"nickname": "Wilma"}, headers=HEADERS).json()["options"]
    assert opts["rp"]["id"] == RP_ID
    assert opts["authenticatorSelection"]["residentKey"] == "required"


def test_uitloggen_en_weer_inloggen_met_de_passkey(client):
    auth, _ = register(client)
    assert client.post("/api/logout", headers=HEADERS).status_code == 200
    assert client.get("/api/me").status_code == 401
    res = login(client, auth)
    assert res.status_code == 200, res.text
    assert res.json()["nickname"] == "Wilma"
    assert client.get("/api/me").status_code == 200


def test_een_onbekende_passkey_kan_niet_inloggen(client):
    register(client)
    client.post("/api/logout", headers=HEADERS)
    stranger = SoftAuthenticator(RP_ID, ORIGIN)
    stranger.user_handle = b"x" * 16
    assert login(client, stranger).status_code == 400
    assert client.get("/api/me").status_code == 401


def test_passkey_van_een_andere_website_telt_niet(client):
    auth = SoftAuthenticator(RP_ID, ORIGIN)
    start = client.post("/api/register/start", json={"nickname": "Wilma"}, headers=HEADERS).json()
    cred = auth.create(start["options"], origin="https://nep-site.example")
    res = client.post("/api/register/finish", json={"flowId": start["flowId"], "credential": cred}, headers=HEADERS)
    assert res.status_code == 400


def test_een_uitdaging_werkt_maar_een_keer(client):
    auth = SoftAuthenticator(RP_ID, ORIGIN)
    start = client.post("/api/register/start", json={"nickname": "Wilma"}, headers=HEADERS).json()
    cred = auth.create(start["options"])
    assert client.post("/api/register/finish", json={"flowId": start["flowId"], "credential": cred}, headers=HEADERS).status_code == 200
    again = client.post("/api/register/finish", json={"flowId": start["flowId"], "credential": cred}, headers=HEADERS)
    assert again.status_code == 400


@pytest.mark.parametrize("nick", ["W", "x" * 21, "<script>", "a/b", "   "])
def test_bijnaam_regels(client, nick):
    res = client.post("/api/register/start", json={"nickname": nick}, headers=HEADERS)
    assert res.status_code == 422


def test_bijnaam_is_uniek_ook_met_andere_hoofdletters(client):
    register(client, "Wilma")
    client.post("/api/logout", headers=HEADERS)
    res = client.post("/api/register/start", json={"nickname": "  wilma "}, headers=HEADERS)
    assert res.status_code == 409


def test_bijnaam_met_accenten_en_spaties_mag(client):
    _, res = register(client, "  René   de Slak ")
    assert res.status_code == 200
    assert res.json()["nickname"] == "René de Slak"


def test_wijzigen_alleen_vanuit_de_app(client):
    res = client.post("/api/register/start", json={"nickname": "Wilma"}, headers={"Origin": "https://evil.example"})
    assert res.status_code == 403
    res = client.post("/api/register/start", json={"nickname": "Wilma"})
    assert res.status_code == 403


def test_spel_bewaren_en_terughalen(client):
    register(client)
    assert client.get("/api/save").json() == {"save": None, "updatedAt": None}
    res = client.put("/api/save", json={"save": SAVE, "summary": SUMMARY}, headers=HEADERS)
    assert res.status_code == 200, res.text
    got = client.get("/api/save").json()
    assert got["save"] == SAVE
    assert got["updatedAt"] == res.json()["updatedAt"]


def test_spel_op_een_nieuwe_telefoon(client):
    auth, _ = register(client)
    client.put("/api/save", json={"save": SAVE}, headers=HEADERS)
    client.cookies.clear()  # zoals een andere telefoon zonder cookie
    assert client.get("/api/save").status_code == 401
    login(client, auth)
    assert client.get("/api/save").json()["save"] == SAVE


def test_zonder_inloggen_geen_spel(client):
    assert client.get("/api/save").status_code == 401
    assert client.put("/api/save", json={"save": SAVE}, headers=HEADERS).status_code == 401


def test_rare_samenvatting_wordt_geweigerd(client):
    register(client)
    bad = {**SUMMARY, "racerId": "<b>hoi</b>"}
    assert client.put("/api/save", json={"save": SAVE, "summary": bad}, headers=HEADERS).status_code == 422


def test_te_groot_spel_wordt_geweigerd(client):
    register(client)
    big = {"x": "a" * (600 * 1024)}
    assert client.put("/api/save", json={"save": big}, headers=HEADERS).status_code == 413


def test_account_verwijderen_wist_alles(client):
    auth, _ = register(client)
    client.put("/api/save", json={"save": SAVE, "summary": SUMMARY}, headers=HEADERS)
    assert client.delete("/api/me", headers=HEADERS).status_code == 200
    assert client.get("/api/me").status_code == 401
    db = client.app.state.db
    for table in ["users", "credentials", "sessions", "saves", "players"]:
        assert db.one(f"SELECT COUNT(*) AS n FROM {table}")["n"] == 0, table
    # De bijnaam is weer vrij, en de oude passkey werkt niet meer.
    assert login(client, auth).status_code == 400
    _, res = register(client, "Wilma")
    assert res.status_code == 200


def test_te_veel_pogingen_worden_afgeremd(client):
    codes = [client.post("/api/register/start", json={"nickname": f"Speler{i}"}, headers=HEADERS).status_code for i in range(25)]
    assert 429 in codes


def test_spelersoverzicht_voor_iedereen(client):
    register(client, "Wilma")
    client.put("/api/save", json={"save": SAVE, "summary": SUMMARY}, headers=HEADERS)
    client.post("/api/logout", headers=HEADERS)
    register(client, "Piet")  # Piet heeft nog geen race: staat er niet in
    client.cookies.clear()
    res = client.get("/api/players")
    assert res.status_code == 200
    players = res.json()["players"]
    assert [p["nickname"] for p in players] == ["Wilma"]
    assert players[0]["racerId"] == "isabelle"
    assert players[0]["position"] == 2
    # Geen geheime dingen in het overzicht.
    assert set(players[0]) == {"nickname", "racerId", "raceNumber", "position", "racersCount", "km", "finished", "updatedAt"}
