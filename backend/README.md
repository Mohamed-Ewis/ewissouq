# EwiSSouq Backend

Express + Mongoose API (same structure as `e-commerece-v1-learning`).

## Structure

```
backend/
  server.js
  config.env          # gitignored secrets (copy from example)
  config/db.js
  models/
  controllers/
  routes/
  middleware/
  utils/
  seed/
```

## Setup

```bash
cd backend
yarn install
# ensure config.env has DATABASE_URL (same Atlas DB as learning project)
yarn seed
```

From the **repo root** (runs frontend + backend together):

```bash
yarn install
yarn dev
```

- Frontend: http://localhost:3000  
- Backend:  http://localhost:5000/api  

Or separately:

```bash
yarn dev:front      # Nuxt only
yarn dev:backend    # API only
```

## Demo user

- Email: `ahmed@example.com`
- Password: `password123`
