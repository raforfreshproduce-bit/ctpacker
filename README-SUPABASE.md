Supabase Setup and Local Migration Guide
======================================

This guide describes how to create the necessary tables and seed default data for the CTPackerTracker app.

1) Create the database tables via Supabase SQL Editor
---------------------------------------------------
Open the Supabase Dashboard > SQL Editor and execute the SQL in `db/migrations/001_create_tables.sql`.

2) Grant permissions
--------------------
The migration file grants SELECT/INSERT/UPDATE/DELETE to the `anon` role so the REST endpoints can be used from the client.
If you have a more restrictive policy, adjust accordingly.

3) Seed data using the provided script (or from Dashboard):
---------------------------------------------------------
Run the following to run the seeder script (uses `NEXT_PUBLIC_SUPABASE_*` vars):

```powershell
# from repo root
npm install
node scripts/seed-supabase.js
```

If seed fails due to permission issues or missing tables, use `run-migration.js` to run the SQL using the DB connection string:

```powershell
# Example:
# DB_URL="postgresql://db_user:password@db_host:5432/postgres" node scripts/run-migration.js
```

4) API routes (debugging)
-------------------------
You can check Supabase connectivity with the app's health endpoint:

`GET /api/supabase-health` - returns counts of assignments and supervisors when the DB is available.

`POST /api/seed` - attempts to insert sample seed data using server-side privileges. If you run this in production, ensure proper auth.

Notes
-----
Be careful with the service role keys; never commit them to a public repo. Use the `DB_URL` or service key only in a secure environment.
