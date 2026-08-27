# ShopNest — Full-Stack E-Commerce Platform

A complete MERN e-commerce site: authentication, role-based access, product catalog with
category-relevant images, cart, Razorpay checkout, order tracking with email notifications,
and password reset — built from scratch with a custom design system.

## Project structure

```
shopnest/
├── backend/     Express + MongoDB API
└── frontend/    React (Vite) + Tailwind CSS
```

## 1. Local setup

### Backend
```bash
cd backend
npm install
```
Edit `backend/config/config.env` and fill in real values (see "Services you need" below).

```bash
npm run seed   # populates ~480 demo products across 6 categories
npm run dev    # starts the API on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev    # starts on http://localhost:5173, proxies /api to the backend
```

Open **http://localhost:5173**.

## 2. Services you need (all free tiers)

| Service | What it's for | Where to get it |
|---|---|---|
| MongoDB Atlas | Database | https://www.mongodb.com/cloud/atlas/register — create a free M0 cluster, get the connection string, paste into `DB_URI` |
| Razorpay | Payments | https://dashboard.razorpay.com/app/keys — use **Test Mode** keys, no business verification needed. Paste into `RAZORPAY_API_KEY` / `RAZORPAY_API_SECRET` |
| Gmail App Password | Sending emails (order confirmations, password reset) | Turn on 2-Step Verification, then https://myaccount.google.com/apppasswords — paste the 16-character password into `SMTP_PASSWORD` |

Until these are filled in with real values, the app still runs — checkout and email-sending will
just show clear error messages instead of silently failing.

## 3. First admin account

The seeder (`npm run seed`) automatically creates a demo admin using your `SMTP_MAIL` value,
with password `Admin@1234`. Log in with that, then **change the password** from the Profile page.
To promote any other account to admin, go to Admin → Users after logging in as an admin.

## 4. Deploying online

### Backend → Render
1. Push this project to a GitHub repo
2. On [render.com](https://render.com), create a **New Web Service**, connect your repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all the environment variables from `config.env` in Render's dashboard (Environment tab) —
   don't upload `config.env` itself, set each variable individually
7. Set `FRONTEND_URL` to your deployed frontend URL (you'll get this in the next step — you can
   update it after)

### Frontend → Vercel
1. On [vercel.com](https://vercel.com), import the same repo
2. Root directory: `frontend`
3. Framework preset: Vite
4. Add an environment variable `VITE_API_URL` if you want to point directly at your Render backend
   URL instead of relying on the dev proxy (the proxy in `vite.config.js` only works locally) —
   see note below
5. Deploy

**Important for production:** the dev proxy (`vite.config.js`) only works when running `npm run dev`
locally. Once deployed, the frontend and backend are on different domains, so:
- Set `VITE_API_URL=https://your-backend.onrender.com/api/v1` in Vercel's environment variables
  (`frontend/src/api/axios.js` already reads this automatically — no code changes needed)
- In `backend/config.env` (or Render's environment settings), set `FRONTEND_URL` to your Vercel URL exactly — this is used for CORS and for building password reset links
- Cookies need `secure: true` and `sameSite: 'none'` in production for cross-domain auth to work — this is already handled automatically in `utils/sendToken.js` based on `NODE_ENV`, just make sure `NODE_ENV=production` is set on Render

### Database
Once deployed, run the seeder against your production database once (you can run it locally — it
just needs the production `DB_URI` in your local `config.env` temporarily, or run it as a one-off
job on Render).

## 5. What's included

- **Auth**: register, login, logout, forgot/reset password (emailed), change password, role-based access (user/admin)
- **Products**: browse, search, filter by category, sort (price/rating/newest), pagination, reviews & ratings
- **Cart**: add/update/remove items, persists in localStorage across sessions
- **Checkout**: 3-step flow (shipping → confirm → Razorpay payment), stock auto-decrements on purchase
- **Orders**: order history, visual status tracker (Processing → Shipped → Delivered), email notification on every status change
- **Admin**: dashboard with stats, product CRUD, order status management, user role management
