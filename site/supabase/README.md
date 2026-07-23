# Supabase handoff

The browser is read-only for public archive rows. New submissions go through
`submit-pattern`, where the event code is checked and the service credential
performs Storage and database writes.

## Apply to an approved project

1. Link this folder to the chosen Supabase project.
2. Apply `migrations/202607230001_create_pattern_archive.sql`.
3. Set Edge Function secrets:
   - `PATTERN_SUBMISSION_CODE`: the code shared in the event group.
   - `SUPABASE_SECRET_KEY`: a server-only Supabase secret key. The function also
     accepts the legacy automatic `SUPABASE_SERVICE_ROLE_KEY`.
   - `ALLOWED_ORIGIN`: the final public site origin. Multiple origins can be
     comma-separated.
4. Deploy `submit-pattern`.
5. Copy `.env.example` to `.env.local` and add the public project URL and
   publishable key.

Do not put the event code or a secret/service-role key in any `VITE_` variable.
