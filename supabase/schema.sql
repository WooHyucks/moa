-- MOA free digital storybook applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  partner1_name text not null,
  partner2_name text not null,
  anniversary_date text,
  story_answers jsonb not null,
  instagram_username text not null,
  consent_given boolean not null default false,
  consent_version text not null,
  consented_at timestamptz,
  application_status text not null default 'pending'
    check (application_status in ('pending', 'selected', 'rejected', 'completed')),
  created_at timestamptz not null default now(),
  utm_source text,
  utm_campaign text
);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

alter table public.applications enable row level security;

-- No public read. Inserts only via service role / server route.
revoke all on public.applications from anon, authenticated;
