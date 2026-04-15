# Node.js Contact Backend Setup

1. Create your env file:
   - Copy `.env.example` to `.env`
   - Update DB credentials

2. Create database and table:
   - Open MySQL and run `database.sql`

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
