import express from "express";
import cors from "cors";
import pool from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully" });
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Insert failed:", error);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.get("/api/requests", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, quantity, subscribe, created_at
       FROM part_requests
       ORDER BY created_at DESC, id DESC
       LIMIT 10`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Request query failed:", error);
    res.status(500).json({ error: "Request query failed" });
  }
});

app.post("/api/requests", async (req, res) => {
  try {
    const { fullName, email, quantity, subscribe } = req.body ?? {};

    const normalizedName = typeof fullName === "string" ? fullName.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const parsedQuantity = Number(quantity);
    const normalizedSubscribe = Boolean(subscribe);

    if (normalizedName.length < 2) {
      return res.status(400).json({
        error: "Name must contain at least 2 characters.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        error: "Email address is not valid.",
      });
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 500) {
      return res.status(400).json({
        error: "Quantity must be an integer between 1 and 500.",
      });
    }

    const result = await pool.query(
      `INSERT INTO part_requests (full_name, email, quantity, subscribe)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, quantity, subscribe, created_at`,
      [normalizedName, normalizedEmail, parsedQuantity, normalizedSubscribe]
    );

    res.status(201).json({
      message: "Request saved successfully.",
      savedRequest: result.rows[0],
      status: 201,
    });
  } catch (error) {
    console.error("Saving request failed:", error);
    res.status(500).json({ error: "Saving request failed." });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
