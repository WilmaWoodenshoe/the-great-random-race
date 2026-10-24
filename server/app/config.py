# Instellingen, uit omgevingsvariabelen (op de server in het systemd-bestand).
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    # Het domein waar passkeys bij horen. Een passkey werkt alleen op dit domein.
    rp_id: str
    # Het adres van de app, precies zoals de browser het meldt.
    origin: str
    # Naam die de telefoon toont bij het aanmaken van een passkey.
    rp_name: str
    # Het databasebestand (SQLite).
    db_path: str
    # Cookies alleen via HTTPS sturen (uit voor lokaal testen).
    cookie_secure: bool


def load_settings() -> Settings:
    return Settings(
        rp_id=os.environ.get("GRR_RP_ID", "thegreatrandomrace.nl"),
        origin=os.environ.get("GRR_ORIGIN", "https://thegreatrandomrace.nl"),
        rp_name=os.environ.get("GRR_RP_NAME", "The Great Random Race"),
        db_path=os.environ.get("GRR_DB", "/var/lib/thegreatrandomrace/grr.db"),
        cookie_secure=os.environ.get("GRR_COOKIE_SECURE", "1") == "1",
    )
