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

## Deploy on Render (Web Service)

1. Create a **Web Service** pointing at this repo (root directory `PORTFOLIO/im a developer` or your repo layout).
2. **Build:** `npm install` · **Start:** `npm start` (uses `server.js`; Express serves static files + `/api/contact`).
3. In the Render dashboard, add **Environment** variable `DATABASE_URL` (same Supabase connection string as locally).
4. **Contact form URL behavior:**
   - **Same service:** Your site opens at `https://YOUR-SERVICE.onrender.com` and the form posts to `/api/contact` on the same host — leave `<meta name="portfolio-api-base" content="" />` **empty** in `index.html` (default).
   - **API on a different URL** (e.g. static frontend elsewhere): set the meta to your API root, e.g. `content="https://YOUR-SERVICE.onrender.com"` (no trailing slash).

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
