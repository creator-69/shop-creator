"use strict";

const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const express = require("express");
const helmet = require("helmet");
const multer = require("multer");
const Database = require("better-sqlite3");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, "data"));
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(ROOT, "uploads"));
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

if (process.env.NODE_ENV === "production") {
  if (ADMIN_PASSWORD.length < 14) throw new Error("Set ADMIN_PASSWORD to a unique password at least 14 characters long.");
  if (SESSION_SECRET.length < 32) throw new Error("Set SESSION_SECRET to a random secret of at least 32 characters.");
}

const db = new Database(path.join(DATA_DIR, "creator-shop.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('watch','smart','accessory')),
    tag TEXT NOT NULL DEFAULT 'NEW',
    detail TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL CHECK(price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    image TEXT NOT NULL DEFAULT '',
    active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
if (count === 0) {
  const seedPath = path.join(ROOT, "data", "seed-products.json");
  const seedProducts = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  const insert = db.prepare(`INSERT INTO products
    (id,name,category,tag,detail,price,stock,image,active)
    VALUES (@id,@name,@category,@tag,@detail,@price,@stock,@image,@active)`);
  const seedMany = db.transaction(items => items.forEach(item => insert.run({
    ...item, active: item.active === false ? 0 : 1, stock: Number.isInteger(item.stock) ? item.stock : 10
  })));
  seedMany(seedProducts);
  console.log("Seeded", seedProducts.length, "products into SQLite.");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d", immutable: true }));

const sign = value => crypto.createHmac("sha256", SESSION_SECRET || "local-development-only-change-me").update(value).digest("base64url");
const tokenFor = issuedAt => {
  const payload = String(issuedAt);
  return payload + "." + sign(payload);
};
function isAuthenticated(req) {
  const token = req.cookies?.creator_admin || "";
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature || !/^\d+$/.test(issuedAt)) return false;
  const expected = sign(issuedAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age < 12 * 60 * 60 * 1000;
}
// Parse only the one signed session cookie; no session data is stored client-side.
app.use((req, _res, next) => {
  const raw = req.headers.cookie || "";
  const pair = raw.split(";").map(part => part.trim()).find(part => part.startsWith("creator_admin="));
  req.cookies = { creator_admin: pair ? decodeURIComponent(pair.slice("creator_admin=".length)) : "" };
  next();
});
function requireAdmin(req, res, next) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Admin login required." });
  next();
}

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" })[file.mimetype];
    cb(null, crypto.randomUUID() + ext);
  }
});
const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, ["image/jpeg","image/png","image/webp","image/gif"].includes(file.mimetype))
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/products", (req, res) => {
  const { category, q, includeInactive } = req.query;
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = {};
  if (!(includeInactive === "true" && isAuthenticated(req))) sql += " AND active = 1";
  if (["watch","smart","accessory"].includes(category)) { sql += " AND category = @category"; params.category = category; }
  if (typeof q === "string" && q.trim()) { sql += " AND (name LIKE @q OR detail LIKE @q OR tag LIKE @q)"; params.q = "%" + q.trim().slice(0,100) + "%"; }
  sql += " ORDER BY created_at DESC, name COLLATE NOCASE";
  res.json({ products: db.prepare(sql).all(params).map(row => ({ ...row, active: Boolean(row.active), image_url: row.image })) });
});
app.get("/api/products/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ? AND active = 1").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Product not found." });
  res.json({ product: { ...row, active: Boolean(row.active), image_url: row.image } });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: "Admin password is not configured on the server." });
  const supplied = Buffer.from(String(password || ""));
  const expected = Buffer.from(ADMIN_PASSWORD);
  const passwordOk = supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
  if (String(username || "") !== ADMIN_USERNAME || !passwordOk) return res.status(401).json({ error: "Username or password is incorrect." });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", "creator_admin=" + encodeURIComponent(tokenFor(Date.now())) + "; HttpOnly; Path=/; SameSite=Strict; Max-Age=43200" + secure);
  res.json({ ok: true });
});
app.post("/api/admin/logout", requireAdmin, (_req, res) => {
  res.setHeader("Set-Cookie", "creator_admin=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0" + (process.env.NODE_ENV === "production" ? "; Secure" : ""));
  res.json({ ok: true });
});
app.get("/api/admin/me", requireAdmin, (_req, res) => res.json({ ok: true, username: ADMIN_USERNAME }));
app.get("/api/admin/products", requireAdmin, (_req, res) => {
  const products = db.prepare("SELECT * FROM products ORDER BY updated_at DESC, name COLLATE NOCASE").all();
  res.json({ products: products.map(row => ({ ...row, active: Boolean(row.active), image_url: row.image })) });
});

function validateProduct(input, partial = false) {
  const errors = [];
  const result = {};
  const fields = ["name","category","tag","detail","price","stock","image","active"];
  for (const key of fields) {
    if (partial && !(key in input)) continue;
    const value = input[key];
    if (key === "name") {
      if (typeof value !== "string" || !value.trim() || value.trim().length > 160) errors.push("Name is required (max 160 characters).");
      else result.name = value.trim();
    } else if (key === "category") {
      if (!["watch","smart","accessory"].includes(value)) errors.push("Category must be watch, smart, or accessory.");
      else result.category = value;
    } else if (key === "tag" || key === "detail" || key === "image") {
      if (typeof value !== "string" || value.length > (key === "detail" ? 1200 : 300)) errors.push(key + " must be text.");
      else result[key] = value.trim();
    } else if (key === "price" || key === "stock") {
      const n = Number(value);
      if (!Number.isSafeInteger(n) || n < 0 || (key === "price" && n > 1000000000000) || (key === "stock" && n > 100000000)) errors.push(key + " must be a valid non-negative integer.");
      else result[key] = n;
    } else if (key === "active") {
      if (typeof value !== "boolean") errors.push("active must be true or false.");
      else result.active = value ? 1 : 0;
    }
  }
  return { errors, value: result };
}
const publicId = name => name.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70) || "product";
app.post("/api/admin/products", requireAdmin, (req, res) => {
  const checked = validateProduct(req.body || {});
  if (checked.errors.length) return res.status(400).json({ error: checked.errors.join(" ") });
  const id = publicId(req.body.id || req.body.name) + "-" + crypto.randomBytes(3).toString("hex");
  const p = { id, tag: "NEW", detail: "", stock: 0, image: "", active: 1, ...checked.value };
  db.prepare("INSERT INTO products (id,name,category,tag,detail,price,stock,image,active,updated_at) VALUES (@id,@name,@category,@tag,@detail,@price,@stock,@image,@active,CURRENT_TIMESTAMP)").run(p);
  res.status(201).json({ product: { ...p, active: Boolean(p.active), image_url: p.image } });
});
app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Product not found." });
  const checked = validateProduct(req.body || {}, true);
  if (checked.errors.length) return res.status(400).json({ error: checked.errors.join(" ") });
  const p = { ...existing, ...checked.value };
  db.prepare("UPDATE products SET name=@name,category=@category,tag=@tag,detail=@detail,price=@price,stock=@stock,image=@image,active=@active,updated_at=CURRENT_TIMESTAMP WHERE id=@id").run(p);
  res.json({ product: { ...p, active: Boolean(p.active), image_url: p.image } });
});
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: "Product not found." });
  res.json({ ok: true });
});
app.post("/api/uploads", requireAdmin, (req, res, next) => {
  upload.single("image")(req, res, err => {
    if (err) return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller." : "Upload failed. Use JPG, PNG, WEBP, or GIF." });
    if (!req.file) return res.status(400).json({ error: "Choose an image file (JPG, PNG, WEBP, GIF)." });
    res.status(201).json({ image: "/uploads/" + req.file.filename });
  });
});

app.get("/admin", (_req, res) => res.sendFile(path.join(ROOT, "admin.html")));
app.use(express.static(ROOT, { index: "shop-creator.html", dotfiles: "deny", setHeaders(res, filePath) {
  if (filePath.endsWith(".sqlite") || filePath.endsWith(".env")) res.status(404);
} }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, "0.0.0.0", () => console.log("Creator Shop listening on port", PORT));
