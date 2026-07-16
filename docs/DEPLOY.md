# Deploy guide (Frontend + Backend)

## Why GitHub Pages still looks like the old (mock) app

| Piece | Where it runs |
|--------|----------------|
| **Frontend** (Nuxt SPA) | GitHub Pages — static files from `yarn generate` |
| **Backend** (Express + MongoDB) | **Not** on GitHub Pages — needs a Node host |

The workflow currently builds with:

```yaml
NUXT_PUBLIC_USE_MOCK: true   # default — in-browser mock API
NUXT_PUBLIC_API_BASE_URL: /api
```

So the live site never talks to your Express API until you change those vars and host the backend somewhere.

## Local (already works)

```bash
yarn dev   # front :3000 + back :5000, mock off, proxy /api → backend
```

## Production setup

### 1) Host the backend

Deploy the `backend/` folder to any Node host, for example:

- [Render](https://render.com) — Web Service, root `backend`, start `yarn start`
- Railway / Fly.io / VPS

Set on that host (same idea as `backend/config.env`):

- `DATABASE_URL` — your Atlas URL  
- `PORT` — provided by the host  
- `JWT_SECRET` / `JWT_REFRESH_SECRET`  
- `CLIENT_URL` — your GitHub Pages URL, e.g. `https://USER.github.io/ewiSSouq`  
- `NODE_ENV=production`

After deploy you get something like:  
`https://ewissouq-api.onrender.com`

### 2) Point the frontend build at that API

In the GitHub repo → **Settings → Secrets and variables → Actions → Variables**:

| Variable | Value |
|----------|--------|
| `NUXT_PUBLIC_USE_MOCK` | `false` |
| `NUXT_PUBLIC_API_BASE_URL` | `https://ewissouq-api.onrender.com/api` |
| `NUXT_PUBLIC_SITE_URL` | `https://USER.github.io/REPO` (optional) |

Then push to `main` (or re-run the **Deploy** workflow).

### 3) CORS

Backend already uses `cors({ origin: true })`. Prefer setting `CLIENT_URL` to your Pages URL.

## Same-host later (optional)

If you move both to one VPS/Docker:

1. Build front: `yarn generate`
2. Serve `.output/public` with nginx **or** from Express
3. Proxy `/api` → Express on the same domain  
4. Set `NUXT_PUBLIC_API_BASE_URL=/api` and `NUXT_PUBLIC_USE_MOCK=false`
