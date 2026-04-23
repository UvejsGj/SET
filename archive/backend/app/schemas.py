from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AuthLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class AuthUserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=2, max_length=255)
    message: str = Field(min_length=5, max_length=4000)
    locale: str = Field(default="en", max_length=8)
    source: str = Field(default="homepage", max_length=64)
    honeypot: str = Field(default="", alias="_gotcha")

    model_config = ConfigDict(populate_by_name=True)


class LeadResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    subject: str
    message: str
    locale: str
    source: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeadStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|contacted|closed)$")


class PortfolioMediaIn(BaseModel):
    image_url: str
    alt_text: str = "Portfolio image"
    title: str = "Project"
    sort_order: int = 0


class PortfolioProjectIn(BaseModel):
    slug: str
    title: str
    summary: str = ""
    locale: str = "en"
    is_published: bool = True
    sort_order: int = 0
    media: list[PortfolioMediaIn] = Field(default_factory=list)


class PortfolioMediaOut(BaseModel):
    id: int
    image_url: str
    alt_text: str
    title: str
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class PortfolioProjectOut(BaseModel):
    id: int
    slug: str
    title: str
    summary: str
    locale: str
    is_published: bool
    sort_order: int
    media: list[PortfolioMediaOut]

    model_config = ConfigDict(from_attributes=True)


class ContentBlockIn(BaseModel):
    key: str
    value: dict[str, Any]
    locale: str = "en"


class ContentBlockOut(BaseModel):
    key: str
    value: dict[str, Any]
    locale: str
    version: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalyticsEventIn(BaseModel):
    event_name: str
    route: str = "/"
    section: str | None = None
    locale: str = "en"
    metadata: dict[str, Any] = Field(default_factory=dict)


class AnalyticsSummaryOut(BaseModel):
    total_events: int
    total_contacts: int
    top_events: list[dict[str, Any]]
    top_sections: list[dict[str, Any]]
    daily_events: list[dict[str, Any]]


class UploadSignRequest(BaseModel):
    filename: str


class UploadSignResponse(BaseModel):
    upload_url: str
    token: str
    path: str
