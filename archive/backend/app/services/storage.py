from datetime import datetime, timedelta, timezone
from pathlib import Path

import jwt

from app.config import get_settings

settings = get_settings()


def make_upload_token(path: str, minutes: int = 20) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "path": path,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=minutes)).timestamp()),
    }
    return jwt.encode(payload, settings.upload_secret, algorithm=settings.jwt_algorithm)


def validate_upload_token(token: str, path: str) -> bool:
    try:
        payload = jwt.decode(token, settings.upload_secret, algorithms=[settings.jwt_algorithm])
    except Exception:
        return False
    return payload.get("path") == path


def resolve_upload_path(filename: str) -> str:
    safe = Path(filename).name.replace(" ", "_")
    return f"{settings.upload_dir}/{safe}"
