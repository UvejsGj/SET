import smtplib
from email.message import EmailMessage

from app.config import get_settings
from app.models import Lead

settings = get_settings()


def send_lead_notification(lead: Lead) -> None:
    if not settings.smtp_host or not settings.contact_notify_email:
        # Fallback no-op for local dev if SMTP not configured.
        return

    msg = EmailMessage()
    msg["Subject"] = f"New website lead: {lead.subject}"
    msg["From"] = settings.mail_from
    msg["To"] = settings.contact_notify_email
    msg.set_content(
        "\n".join(
            [
                f"Name: {lead.name}",
                f"Email: {lead.email}",
                f"Locale: {lead.locale}",
                f"Source: {lead.source}",
                "",
                lead.message,
            ]
        )
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
        server.starttls()
        if settings.smtp_user and settings.smtp_password:
            server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(msg)
