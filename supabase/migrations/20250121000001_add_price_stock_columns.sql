-- Add price and stock columns to products table
create extension if not exists pgcrypto;

alter table if exists public.products add column if not exists prix_15ml DECIMAL(10,2);
alter table if exists public.products add column if not exists stock_15ml INTEGER DEFAULT 0;
alter table if exists public.products add column if not exists prix_30ml DECIMAL(10,2);
alter table if exists public.products add column if not exists stock_30ml INTEGER DEFAULT 0;
alter table if exists public.products add column if not exists prix_50ml DECIMAL(10,2);
alter table if exists public.products add column if not exists stock_50ml INTEGER DEFAULT 0;

