"""Rate limit key and client IP extraction for /api/contact (no DB)."""

from datetime import datetime, timezone
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.routers import contact as contact_router


@pytest.fixture(autouse=True)
def clear_rate_buckets():
    contact_router.ip_buckets.clear()
    yield
    contact_router.ip_buckets.clear()


def test_client_ip_uses_left_most_xff_hop():
    req = MagicMock()
    req.headers.get.return_value = "203.0.113.1, 10.0.0.1, 10.0.0.2"
    req.client = MagicMock()
    req.client.host = "127.0.0.1"
    assert contact_router.client_ip_for_rate_limit(req) == "203.0.113.1"


def test_same_logical_client_when_only_proxy_tail_changes():
    """Full X-Forwarded-For used to be the dict key; first hop must stay stable for throttling."""
    req_a = MagicMock()
    req_a.headers.get.return_value = "203.0.113.9, 10.0.0.1"
    req_a.client.host = "127.0.0.1"
    req_b = MagicMock()
    req_b.headers.get.return_value = "203.0.113.9, 10.0.0.99"
    req_b.client.host = "127.0.0.1"
    assert contact_router.client_ip_for_rate_limit(req_a) == contact_router.client_ip_for_rate_limit(req_b)


def test_client_ip_falls_back_to_socket_client():
    req = MagicMock()
    req.headers.get.return_value = None
    req.client.host = "198.51.100.2"
    assert contact_router.client_ip_for_rate_limit(req) == "198.51.100.2"


def test_check_rate_limit_blocks_sixth_hit_same_key():
    ip = "203.0.113.50"
    for _ in range(5):
        contact_router.check_rate_limit(ip)
    with pytest.raises(HTTPException) as exc:
        contact_router.check_rate_limit(ip)
    assert exc.value.status_code == 429


def test_check_rate_limit_prunes_stale_window():
    ip = "203.0.113.51"
    contact_router.check_rate_limit(ip)
    old = datetime(2000, 1, 1, tzinfo=timezone.utc)
    contact_router.ip_buckets[ip][0] = old
    contact_router.check_rate_limit(ip)
    assert len(contact_router.ip_buckets[ip]) >= 1
