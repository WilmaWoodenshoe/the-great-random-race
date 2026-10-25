import json
from datetime import datetime

import pytest

from app.config import Settings
from app.main import create_app
from app.push import SEND_HOUR, allowed_endpoint, fill
from app.races import NL_TIME
from tests.test_api import HEADERS, ORIGIN, RP_ID
from tests.test_races import DAY, RACERS, new_race, now_ms, player

SNAPSHOT = {
    "course": {"id": "grote-bosrace", "name": "De Grote Bosrace"},
    "racers": [{"id": r, "name": r.capitalize(), **({"pronoun": "zij"} if r == "isabelle" else {})} for r in RACERS],
    "choices": [],
}
SUB = {"endpoint": "https://fcm.googleapis.com/fcm/send/abc", "keys": {"p256dh": "B" * 40, "auth": "a" * 16}}


@pytest.fixture
def app_(tmp_path):
    settings = Settings(rp_id=RP_ID, origin=ORIGIN, rp_name="Test", db_path=str(tmp_path / "t.db"), cookie_secure=False)
    app = create_app(settings)
    app.state.sent = []
    app.state.pusher.sender = lambda info, data: app.state.sent.append((info, json.loads(data))) or 201
    return app


def running_race(app_, c, racer="gerard"):
    """Een race die gisteren begonnen is (via de database: een starttijd in het verleden mag niet)."""
    res = new_race(c, racer=racer, snapshot=SNAPSHOT)
    assert res.status_code == 200, res.text
    app_.state.db.execute("UPDATE races SET start_time = ?", (at_hour(12) - DAY,))


def at_hour(hour, days_ahead=0):
    d = datetime.now(NL_TIME).replace(hour=hour, minute=5, second=0, microsecond=0)
    return int(d.timestamp() * 1000) + days_ahead * DAY


def test_sleutel_wordt_gemaakt_en_bewaard(tmp_path, app_):
    c = player(app_, "Wilma")
    key = c.get("/api/push/key").json()["key"]
    assert len(key) > 80
    assert (tmp_path / "vapid-private.pem").exists()
    # Na een herstart dezelfde sleutel.
    again = create_app(app_.state.settings)
    assert again.state.pusher.public_key() == key


def test_alleen_echte_meldingendiensten():
    assert allowed_endpoint("https://fcm.googleapis.com/fcm/send/x")
    assert allowed_endpoint("https://web.push.apple.com/abc")
    assert allowed_endpoint("https://updates.push.services.mozilla.com/wpush/v2/x")
    assert not allowed_endpoint("http://fcm.googleapis.com/x")
    assert not allowed_endpoint("https://evil.example/x")
    assert not allowed_endpoint("https://googleapis.com.evil.example/x")


def test_aanmelden_vraagt_een_account(app_):
    from fastapi.testclient import TestClient

    anon = TestClient(app_, base_url="http://localhost")
    assert anon.post("/api/push/subscribe", json=SUB, headers=HEADERS).status_code == 401
    c = player(app_, "Wilma")
    bad = {**SUB, "endpoint": "https://evil.example/x"}
    assert c.post("/api/push/subscribe", json=bad, headers=HEADERS).status_code == 422
    assert c.post("/api/push/subscribe", json=SUB, headers=HEADERS).status_code == 200


def test_een_melding_per_dag_tijdens_de_race(app_):
    c = player(app_, "Wilma")
    running_race(app_, c, racer="isabelle")
    c.post("/api/push/subscribe", json=SUB, headers=HEADERS)
    pusher = app_.state.pusher

    assert pusher.send_due(at_hour(SEND_HOUR - 2)) == 0  # te vroeg
    assert pusher.send_due(at_hour(SEND_HOUR)) == 1
    assert pusher.send_due(at_hour(SEND_HOUR + 1)) == 0  # vandaag al gehad
    info, payload = app_.state.sent[0]
    assert info["endpoint"] == SUB["endpoint"]
    assert payload["title"] == "The Great Random Race"
    assert "{" not in payload["body"]
    assert pusher.send_due(at_hour(SEND_HOUR, days_ahead=1)) == 1  # morgen weer
    # Na de race (7 dagen) niet meer.
    app_.state.db.execute("UPDATE push_subscriptions SET last_sent_day = NULL")
    assert pusher.send_due(at_hour(SEND_HOUR, days_ahead=8)) == 0


def test_geen_melding_zonder_lopende_race(app_):
    c = player(app_, "Wilma")
    new_race(c, start_in=3 * DAY, snapshot=SNAPSHOT)
    c.post("/api/push/subscribe", json=SUB, headers=HEADERS)
    assert app_.state.pusher.send_due(at_hour(SEND_HOUR)) == 0


def test_uitzetten_en_verlopen_adres(app_):
    c = player(app_, "Wilma")
    running_race(app_, c)
    c.post("/api/push/subscribe", json=SUB, headers=HEADERS)
    c.post("/api/push/unsubscribe", json={"endpoint": SUB["endpoint"]}, headers=HEADERS)
    assert app_.state.pusher.send_due(at_hour(SEND_HOUR)) == 0

    c.post("/api/push/subscribe", json=SUB, headers=HEADERS)
    app_.state.pusher.sender = lambda info, data: 410  # telefoon heeft meldingen uitgezet
    app_.state.pusher.send_due(at_hour(SEND_HOUR, days_ahead=1))
    assert app_.state.db.one("SELECT COUNT(*) AS n FROM push_subscriptions")["n"] == 0


def test_account_verwijderen_wist_ook_de_melding(app_):
    c = player(app_, "Wilma")
    c.post("/api/push/subscribe", json=SUB, headers=HEADERS)
    assert c.delete("/api/me", headers=HEADERS).status_code == 200
    assert app_.state.db.one("SELECT COUNT(*) AS n FROM push_subscriptions")["n"] == 0


def test_teksten_invullen():
    assert fill("{Hij} en {zijn} {route}, {naam}", "Isabelle", "zij", "De Strandrace") == "Zij en haar De Strandrace, Isabelle"




def test_alle_berichten_zijn_goed_in_te_vullen():
    from app.push import load_texts

    texts = load_texts()
    assert texts["berichten"]
    for msg in texts["berichten"]:
        assert "{" not in fill(msg, "Gerard", "hij", "De Grote Bosrace"), msg
