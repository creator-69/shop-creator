# Creator Shop — Admin dashboard and REST API

This branch adds a Node.js + Express API, SQLite product storage, a password-protected admin console, product CRUD, inventory/category controls, and local image uploads.

## What's included

- `/admin`: password-protected management dashboard
- `/api/products`, `/api/products/:id`: public read-only catalogue API
- `/api/admin/products`: authenticated list/create/update/delete endpoints
- `/api/uploads`: authenticated image upload (JPG, PNG, WEBP, GIF; max 5 MB)
- SQLite database seeded once with the existing 30 catalogue entries
- Render deployment blueprint with persistent disk for the SQLite database and uploads

## Run locally

Requires Node.js 20 or newer and a compiler toolchain if a prebuilt `better-sqlite3` binary is unavailable.

1. Install dependencies: `npm install`
2. Set environment variables in your terminal (PowerShell example):

```powershell
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="use-a-long-unique-password-here"
$env:SESSION_SECRET="use-a-random-secret-at-least-32-characters-long"
npm start
```

3. Open `http://localhost:3000` for the storefront and `http://localhost:3000/admin` for the dashboard.

The first run creates `data/creator-shop.sqlite` and imports `data/seed-products.json`. Existing product names and prices are preserved; initial stock is set to 10 as editable demo data. The prior image paths are retained, but image files that were never downloaded will not magically appear. Upload local photos for each product from the admin dashboard.

## Deploy online (Render)

1. Push this branch and create a new Render Web Service from the repository.
2. Render can use `render.yaml` as a blueprint. The included starter plan and persistent disk are intended to keep SQLite data and uploaded photos across deploys; verify current Render pricing before provisioning.
3. Set `ADMIN_PASSWORD` to a strong, unique password. The blueprint generates `SESSION_SECRET`; keep both values private.
4. After deploy, open `https://YOUR-SERVICE.onrender.com/admin` and sign in with username `admin` and the configured password.

Do not put real credentials in source code or commit a `.env` file. Back up the persistent disk/database before risky changes.

## API examples

```http
GET /api/products
GET /api/products?category=watch&q=samsung
GET /api/products/:id
POST /api/admin/login
GET /api/admin/products
POST /api/admin/products
PUT /api/admin/products/:id
DELETE /api/admin/products/:id
POST /api/uploads
```

Product categories: `watch`, `smart`, `accessory`. Admin routes require the HttpOnly signed admin cookie set by login.
