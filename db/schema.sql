-- Visitor counter schema
-- Run this once against your Neon database to create the required table.
-- Do NOT execute this from the API handlers.
--
-- Local:      psql $DATABASE_URL -f db/schema.sql
-- Neon UI:    paste into the SQL Editor at console.neon.tech

CREATE TABLE IF NOT EXISTS visitors (
    visitor_id    TEXT        PRIMARY KEY,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
