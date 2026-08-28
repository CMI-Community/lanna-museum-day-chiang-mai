-- Public buckets serve object URLs without a SELECT policy. Removing this
-- policy prevents anonymous clients from listing every object in the bucket.
drop policy if exists "Public pattern images are readable" on storage.objects;
