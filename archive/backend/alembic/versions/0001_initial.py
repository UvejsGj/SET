"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-04-23
"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "leads",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("locale", sa.String(length=8), nullable=False),
        sa.Column("source", sa.String(length=64), nullable=False),
        sa.Column("ip_address", sa.String(length=64), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_leads_created_at"), "leads", ["created_at"], unique=False)
    op.create_index(op.f("ix_leads_email"), "leads", ["email"], unique=False)
    op.create_index(op.f("ix_leads_status"), "leads", ["status"], unique=False)

    op.create_table(
        "portfolio_projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("locale", sa.String(length=8), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_portfolio_projects_is_published"), "portfolio_projects", ["is_published"], unique=False)
    op.create_index(op.f("ix_portfolio_projects_locale"), "portfolio_projects", ["locale"], unique=False)
    op.create_index(op.f("ix_portfolio_projects_slug"), "portfolio_projects", ["slug"], unique=True)
    op.create_index(op.f("ix_portfolio_projects_sort_order"), "portfolio_projects", ["sort_order"], unique=False)

    op.create_table(
        "portfolio_media",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.String(length=400), nullable=False),
        sa.Column("alt_text", sa.String(length=255), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["portfolio_projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_portfolio_media_id"), "portfolio_media", ["id"], unique=False)
    op.create_index(op.f("ix_portfolio_media_sort_order"), "portfolio_media", ["sort_order"], unique=False)

    op.create_table(
        "content_blocks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("locale", sa.String(length=8), nullable=False),
        sa.Column("key", sa.String(length=120), nullable=False),
        sa.Column("value", sa.JSON(), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("is_latest", sa.Boolean(), nullable=False),
        sa.Column("updated_by", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("locale", "key", "version", name="uq_content_locale_key_version"),
    )
    op.create_index(op.f("ix_content_blocks_created_at"), "content_blocks", ["created_at"], unique=False)
    op.create_index(op.f("ix_content_blocks_id"), "content_blocks", ["id"], unique=False)
    op.create_index(op.f("ix_content_blocks_is_latest"), "content_blocks", ["is_latest"], unique=False)
    op.create_index(op.f("ix_content_blocks_key"), "content_blocks", ["key"], unique=False)
    op.create_index(op.f("ix_content_blocks_locale"), "content_blocks", ["locale"], unique=False)
    op.create_index(op.f("ix_content_blocks_version"), "content_blocks", ["version"], unique=False)

    op.create_table(
        "analytics_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("event_name", sa.String(length=120), nullable=False),
        sa.Column("route", sa.String(length=255), nullable=False),
        sa.Column("section", sa.String(length=120), nullable=True),
        sa.Column("locale", sa.String(length=8), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("ip_address", sa.String(length=64), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_analytics_events_created_at"), "analytics_events", ["created_at"], unique=False)
    op.create_index(op.f("ix_analytics_events_event_name"), "analytics_events", ["event_name"], unique=False)
    op.create_index(op.f("ix_analytics_events_id"), "analytics_events", ["id"], unique=False)
    op.create_index(op.f("ix_analytics_events_locale"), "analytics_events", ["locale"], unique=False)
    op.create_index(op.f("ix_analytics_events_route"), "analytics_events", ["route"], unique=False)
    op.create_index(op.f("ix_analytics_events_section"), "analytics_events", ["section"], unique=False)


def downgrade() -> None:
    op.drop_table("analytics_events")
    op.drop_table("content_blocks")
    op.drop_table("portfolio_media")
    op.drop_table("portfolio_projects")
    op.drop_table("leads")
    op.drop_table("users")
