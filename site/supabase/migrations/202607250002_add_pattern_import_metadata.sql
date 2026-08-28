alter table public.pattern_submissions
  add column if not exists source_import_id text,
  add column if not exists rights_review boolean not null default false;

create unique index if not exists pattern_submissions_source_import_id_idx
  on public.pattern_submissions (source_import_id)
  where source_import_id is not null;

comment on column public.pattern_submissions.source_import_id is
  'Stable identifier for idempotent curator-led batch imports.';

comment on column public.pattern_submissions.rights_review is
  'Whether public image and artwork rights still require curator review.';
