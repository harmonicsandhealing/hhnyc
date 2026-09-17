# Setting up the CRM

## 1. Create the Supabase project
1. Go to supabase.com → New project. Pick any name (e.g. "hhnyc-crm") and a strong database password (save it somewhere safe — you won't need it day-to-day, just for admin recovery).
2. Once it's created, go to **SQL Editor → New query**, paste the contents of `schema.sql`, and run it. This creates the `clients` and `sessions` tables with Row Level Security already locked down.
3. Go to **Settings → API**. Copy the **Project URL** and the **anon public** key.
4. Open `config.js` and paste those two values in place of the placeholders.

## 2. Create your login (no public sign-up)
The app has no sign-up form on purpose — you're the only user.
1. In Supabase, go to **Authentication → Users → Add user**.
2. Enter your email and a password. Confirm the email manually (there's a checkbox) so you don't need to click a verification link.
3. That's the login you'll use in the app.

## 3. Add the files to your repo
Copy the whole `crm` folder into your `hhnyc` repo, so the structure looks like:

```
hhnyc/
  index.html          (your existing site)
  styles.css
  script.js
  crm/
    index.html
    style.css
    app.js
    config.js
    schema.sql
    SETUP.md
```

Commit and push (GitHub Desktop or CLI, whichever you normally use). Once GitHub Pages redeploys, your CRM is live at:

`https://harmonicsandhealing.com/crm/` (or `https://harmonicsandhealing.github.io/hhnyc/crm/` if you haven't pointed the custom domain there)

## 4. Using it after a session
1. Talk the session through with Claude, same as you already do.
2. Ask Claude to output the two documents **plus** a paste-ready block in this exact shape:

```
CLIENT: Jerusa's mother
AGE: 73
DATE: 2026-09-15
---FOLLOWUP---
<the short client-facing message>
---INTERNAL---
<the complete internal record>
```

3. On your phone, open the CRM, tap the client (or create them if new), tap **+ New session**, paste the block in, tap **Parse**, check it looks right, tap **Save session**.

## Notes
- The anon key in `config.js` is meant to be public — Supabase's security model relies on Row Level Security (which `schema.sql` sets up), not on hiding that key.
- Because there's no public sign-up, anyone who doesn't have your login simply can't get past the login screen — RLS blocks all access without a valid session on top of that.
- If you ever want a second practitioner logging in, just add another user the same way in step 2 — the RLS policy already allows any authenticated user.
