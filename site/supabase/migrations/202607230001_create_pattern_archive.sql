create sequence if not exists public.pattern_archive_number_seq start with 1;

create table if not exists public.pattern_submissions (
  id uuid primary key default gen_random_uuid(),
  archive_number text not null unique default (
    'CMI-LN-' || lpad(nextval('public.pattern_archive_number_seq')::text, 4, '0')
  ),
  museum text not null check (museum in ('lanna_folklife', 'fam', 'other')),
  source_title text not null default '未命名纹样采集',
  source_location text not null default '来源待补充',
  observation text not null,
  verified_information text not null default '',
  open_question text not null default '',
  carrier_tags text[] not null default '{}',
  position_tags text[] not null default '{}',
  structure_tags text[] not null default '{}',
  material_tags text[] not null default '{}',
  detail_image_urls text[] not null,
  context_image_urls text[] not null,
  label_image_urls text[] not null default '{}',
  collector_name text not null default '匿名采集者',
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now(),
  published_at timestamptz not null default now(),
  constraint pattern_submissions_detail_images_check
    check (cardinality(detail_image_urls) between 1 and 6),
  constraint pattern_submissions_context_images_check
    check (cardinality(context_image_urls) between 1 and 6),
  constraint pattern_submissions_label_images_check
    check (cardinality(label_image_urls) between 0 and 3)
);

create index if not exists pattern_submissions_public_order_idx
  on public.pattern_submissions (published_at desc, archive_number desc)
  where status = 'published';

alter table public.pattern_submissions enable row level security;

revoke all on public.pattern_submissions from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.pattern_submissions to anon, authenticated;

drop policy if exists "Public archive entries are readable" on public.pattern_submissions;
create policy "Public archive entries are readable"
  on public.pattern_submissions
  for select
  to anon, authenticated
  using (status = 'published');

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'pattern-submissions',
  'pattern-submissions',
  true,
  1572864,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public pattern images are readable" on storage.objects;
create policy "Public pattern images are readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'pattern-submissions');
