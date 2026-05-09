# Netlify Deployment Guide

You will create **3 Netlify sites** — one each for `backend`, `frontend`, `admin`.

## Known limitation (until Cloudinary is added)

The admin "Add Food" image upload **will not work** in production. Netlify Functions have a read-only filesystem, so multer's disk storage cannot save uploads. The rest of the app (login, list food, cart, orders, Stripe) works fine. To fix uploads later: migrate `backend/routes/foodRoute.js` and `backend/controllers/foodController.js` to upload images to Cloudinary (or S3) instead of local disk.

---

## Step 1 — Push code to GitHub

```bash
git add .
git commit -m "configure for Netlify deployment"
git push
```

## Step 2 — Deploy backend (Netlify Functions)

1. Netlify dashboard → **Add new site → Import an existing project** → pick this repo.
2. **Base directory:** `backend`
3. **Build command:** `npm install`
4. **Publish directory:** `backend/public`
5. **Functions directory:** `backend/netlify/functions` (auto-detected from `netlify.toml`)
6. **Environment variables** (Site settings → Environment variables):
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — long random string
   - `STRIPE_SECRET_KEY` — your Stripe secret key
   - `FRONTEND_URL` — set after Step 3 (e.g. `https://food-del-frontend.netlify.app`)
7. Deploy. After it builds, test: `https://<your-backend>.netlify.app/api/food/list` should return JSON.

## Step 3 — Deploy frontend

1. Add new site → import repo (same repo).
2. **Base directory:** `frontend`
3. Build command and publish are read from `frontend/netlify.toml`.
4. **Environment variables:**
   - `VITE_API_URL` = the backend URL from Step 2 (e.g. `https://food-del-backend.netlify.app`)
5. Deploy. Note the URL — paste it back into the backend's `FRONTEND_URL` env var and **redeploy backend** (so Stripe redirects go to the right place).

## Step 4 — Deploy admin

1. Add new site → import repo.
2. **Base directory:** `admin`
3. **Environment variables:**
   - `VITE_API_URL` = the backend URL from Step 2
4. Deploy.

---

## Local development still works

```bash
# backend
cd backend && npm install && npm run server

# frontend (in another terminal)
cd frontend && npm install && npm run dev

# admin (in another terminal)
cd admin && npm install && npm run dev
```

Frontend and admin fall back to `http://localhost:4000` when `VITE_API_URL` isn't set.

## Rotate your secrets

Your `STRIPE_SECRET_KEY` and Mongo password are committed in git history. Rotate both before going public:
- Stripe dashboard → API keys → roll the secret key.
- MongoDB Atlas → Database Access → reset the user's password.
