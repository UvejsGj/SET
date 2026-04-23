from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SET Backend"
    environment: str = "development"
    database_url: str = "sqlite:///./set_backend.db"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24
    admin_email: str = "admin@smart-engineering.tech"
    admin_password: str = "change-me-now"
    allowed_origins: str = "http://127.0.0.1:5500,http://localhost:5500"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    mail_from: str = "no-reply@smart-engineering.tech"
    contact_notify_email: str = "besart@smart-engineering.tech"
    upload_dir: str = "uploads"
    upload_secret: str = "change-upload-secret"
    cors_allow_local_regex: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def allowed_origins_list(self) -> list[str]:
        raw = self.allowed_origins.strip()
        if raw.startswith("[") and raw.endswith("]"):
            raw = raw[1:-1]
        return [part.strip().strip('"').strip("'") for part in raw.split(",") if part.strip()]

    @property
    def cors_origin_regex(self) -> str | None:
        if not self.cors_allow_local_regex:
            return None
        return r"^https?://(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$"


def get_settings() -> Settings:
    return Settings()
