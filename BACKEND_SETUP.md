# Node.js Contact Backend Setup (Supabase Postgres)

1. Create your env file:
   - Copy `.env.example` to `.env`
   - Set `DATABASE_URL` from Supabase Connection string (Session pooler URI)

2. Create database table:
   - Open Supabase SQL Editor and run:

```sql
create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);
```

3. Start server:
   - `npm install`
   - `npm run dev`

4. Open site:
   - Visit `http://localhost:3000`
   - Send a message in Contact section

## API Endpoint

- `POST /api/contact`
- Body:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "message": "Your message"
}
```
