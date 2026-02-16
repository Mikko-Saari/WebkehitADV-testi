require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");

// Timestamp
function timestamp() {
  const now = new Date();
  return now.toISOString().replace("T", " ").replace("Z", "");
}

// --- Middleware ---
app.use(express.json());

// Serve everything in ./public as static assets
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// --- Views (HTML pages) ---
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/resources", (req, res) => {
  res.sendFile(path.join(publicDir, "resources.html"));
});

// --- Postgres pool (reads PG* from .env) ---
const pool = new Pool({});

// --- express-validator rules for the payload ---
const resourceValidators = [
  body("action")
    .exists({ checkFalsy: true })
    .withMessage("action is required")
    .trim()
    .isIn(["create"])
    .withMessage("action must be 'create'"),

  body("resourceName")
    .exists({ checkFalsy: true })
    .withMessage("resourceName is required")
    .isString()
    .withMessage("resourceName must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("resourceName must be 2-50 characters")
    .custom((v) => {
      if (/[<>]/.test(v)) throw new Error("resourceName must not contain < or >");
      return true;
    }),

  body("resourceDescription")
    .exists({ checkFalsy: true })
    .withMessage("resourceDescription is required")
    .isString()
    .withMessage("resourceDescription must be a string")
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("resourceDescription must be 10-200 characters")
    .custom((v) => {
      if (/[<>]/.test(v)) throw new Error("resourceDescription must not contain < or >");
      return true;
    }),

  body("resourceAvailable")
    .exists()
    .withMessage("resourceAvailable is required")
    .isBoolean()
    .withMessage("resourceAvailable must be boolean")
    .toBoolean(),

  body("resourcePrice")
    .exists()
    .withMessage("resourcePrice is required")
    .isFloat({ min: 0 })
    .withMessage("resourcePrice must be a non-negative number")
    .toFloat(),

  body("resourcePriceUnit")
    .exists({ checkFalsy: true })
    .withMessage("resourcePriceUnit is required")
    .isString()
    .withMessage("resourcePriceUnit must be a string")
    .trim()
    .isIn(["hour", "day", "week", "month"])
    .withMessage("resourcePriceUnit must be 'hour', 'day', 'week', or 'month'"),
];

// POST /api/resources -> create
app.post("/api/resources", resourceValidators, async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      ok: false,
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }

  const {
    action,
    resourceName,
    resourceDescription,
    resourceAvailable,
    resourcePrice,
    resourcePriceUnit,
  } = req.body;

  console.log("The client's POST request ", `[${timestamp()}]`);
  console.log("------------------------------");
  console.log("Action ➡️ ", action);
  console.log("Name ➡️ ", resourceName);
  console.log("Description ➡️ ", resourceDescription);
  console.log("Availability ➡️ ", resourceAvailable);
  console.log("Price ➡️ ", resourcePrice);
  console.log("Price unit ➡️ ", resourcePriceUnit);
  console.log("------------------------------");

  if (action !== "create") {
    return res.status(400).json({ ok: false, error: "Only action='create' is supported" });
  }

  try {
    const insertSql = `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, available, price, price_unit, created_at
    `;

    const params = [
      resourceName.trim(), 
      resourceDescription.trim(),
      Boolean(resourceAvailable), 
      Number(resourcePrice), 
      resourcePriceUnit.trim(),
    ];

    const { rows } = await pool.query(insertSql, params);
    return res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error("DB insert failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

// --- Fallback 404 for unknown API routes ---
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- Start server ---
const PORT = Number(process.env.IPORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
