alter table public.pattern_submissions
  add column if not exists captured_at timestamptz;

comment on column public.pattern_submissions.captured_at is
  'Actual onsite capture time from the source photo metadata; distinct from upload and publication time.';
