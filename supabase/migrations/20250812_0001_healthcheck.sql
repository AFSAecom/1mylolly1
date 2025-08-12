-- Healthcheck idempotent pour valider le pipeline CI
create extension if not exists pgcrypto;

create table if not exists public._migrations_healthcheck (
  id bigint generated always as identity primary key,
  created_at timestamptz default now()
);

comment on table public._migrations_healthcheck is 'Table de vérification du pipeline de migrations CI';
