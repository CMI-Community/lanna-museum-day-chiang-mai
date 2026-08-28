# Supabase handoff

The browser is read-only for public archive rows. New submissions go through
`submit-pattern`, where the event code is checked and the service credential
performs Storage and database writes.

## Apply to an approved project

1. Link this folder to the chosen Supabase project.
2. Apply `migrations/202607230001_create_pattern_archive.sql`.
3. Set Edge Function secrets:
   - `PATTERN_SUBMISSION_CODE`: set to the event code supplied by CMI Studio. The
     function ignores letter case, leading/trailing spaces, and repeated spaces.
   - `ALLOWED_ORIGIN`: the final public site origin. Multiple origins can be
     comma-separated.
   - Supabase automatically provides `SUPABASE_URL` and the default secret key
     through `SUPABASE_SECRET_KEYS`. The legacy automatic
     `SUPABASE_SERVICE_ROLE_KEY` remains a fallback.
4. Deploy `submit-pattern`.
5. Copy `.env.example` to `.env.local` and add the public project URL and
   publishable key.

Do not put the event code or a secret/service-role key in any `VITE_` variable.
