// src/routes/reservations.routes.js
import express from "express";
import pool from "../db/pool.js";
import { logEvent } from "../services/log.service.js";

const router = express.Router();

function parsePositiveInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseReservationPayload(body) {
  const resourceId = parsePositiveInt(body?.resourceId);
  const userId = parsePositiveInt(body?.userId);
  const startDate = new Date(body?.startTime);
  const endDate = new Date(body?.endTime);
  const note = typeof body?.note === "string" ? body.note.trim() : "";
  const status = body?.status || "active";

  if (!resourceId) {
    return { ok: false, error: "resourceId must be a positive integer" };
  }

  if (!userId) {
    return { ok: false, error: "userId must be a positive integer" };
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return { ok: false, error: "startTime and endTime must be valid date-time values" };
  }

  if (endDate <= startDate) {
    return { ok: false, error: "endTime must be later than startTime" };
  }

  if (!["active", "cancelled", "completed"].includes(status)) {
    return { ok: false, error: "status must be one of: active, cancelled, completed" };
  }

  return {
    ok: true,
    value: {
      resourceId,
      userId,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      note: note || null,
      status,
    },
  };
}

async function findExistingUserId(client, preferredUserId) {
  if (preferredUserId) {
    const preferred = await client.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [preferredUserId]);
    if (preferred.rows.length > 0) {
      return preferred.rows[0].id;
    }
  }

  const fallback = await client.query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
  return fallback.rows[0]?.id ?? null;
}

async function findOrCreateResourceId(client, preferredResourceId) {
  if (preferredResourceId) {
    const preferred = await client.query("SELECT id FROM resources WHERE id = $1 LIMIT 1", [preferredResourceId]);
    if (preferred.rows.length > 0) {
      return preferred.rows[0].id;
    }
  }

  const fallback = await client.query("SELECT id FROM resources ORDER BY id ASC LIMIT 1");
  if (fallback.rows.length > 0) {
    return fallback.rows[0].id;
  }

  const autoName = `Auto Resource ${Date.now()}`;
  const created = await client.query(
    `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [autoName, "Automatically created resource", true, 0, "hour"]
  );

  return created.rows[0]?.id ?? null;
}

function handleReservationDbError(res, err) {
  if (err?.code === "23503") {
    return res.status(400).json({
      ok: false,
      error: "Invalid resourceId or userId (referenced record was not found)",
    });
  }

  if (err?.code === "23514") {
    return res.status(400).json({
      ok: false,
      error: "Invalid reservation values (check time range and status)",
    });
  }

  if (err?.code === "22P02") {
    return res.status(400).json({
      ok: false,
      error: "Invalid input format",
    });
  }

  return res.status(500).json({ ok: false, error: "Database error" });
}

/* =====================================================
   CREATE
   POST /api/reservations
===================================================== */
router.post("/", async (req, res) => {
  const actorUserId = null;

  const preferredResourceId = parsePositiveInt(req.body?.resourceId);
  const preferredUserId = parsePositiveInt(req.body?.userId);
  const startDate = new Date(req.body?.startTime);
  const endDate = new Date(req.body?.endTime);
  const status = req.body?.status || "active";
  const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return res.status(400).json({
      ok: false,
      error: "startTime and endTime must be valid date-time values",
    });
  }

  if (endDate <= startDate) {
    return res.status(400).json({
      ok: false,
      error: "endTime must be later than startTime",
    });
  }

  if (!["active", "cancelled", "completed"].includes(status)) {
    return res.status(400).json({
      ok: false,
      error: "status must be one of: active, cancelled, completed",
    });
  }

  try {
    const userId = await findExistingUserId(pool, preferredUserId);
    if (!userId) {
      return res.status(400).json({
        ok: false,
        error: "No users available. Register a user first.",
      });
    }

    const resourceId = await findOrCreateResourceId(pool, preferredResourceId);
    if (!resourceId) {
      return res.status(400).json({
        ok: false,
        error: "No resource could be resolved for reservation.",
      });
    }

    const insertSql = `
      INSERT INTO reservations
      (resource_id, user_id, start_time, end_time, note, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const params = [
      resourceId,
      userId,
      startDate.toISOString(),
      endDate.toISOString(),
      note || null,
      status
    ];

    const { rows } = await pool.query(insertSql, params);

    await logEvent({
      actorUserId,
      action: "reserve",
      message: `Reservation created (ID ${rows[0].id})`,
      entityType: "reservation",
      entityId: rows[0].id,
    });

    return res.status(201).json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error("DB insert failed:", err);
    return handleReservationDbError(res, err);
  }
});


/* =====================================================
   READ ALL
   GET /api/reservations
===================================================== */
router.get("/", async (req, res) => {

  try {

    const sql = `
      SELECT
        r.*,
        u.email AS user_email,
        res.name AS resource_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN resources res ON r.resource_id = res.id
      ORDER BY r.start_time DESC
    `;

    const { rows } = await pool.query(sql);

    return res.status(200).json({ ok: true, data: rows });

  } catch (err) {
    console.error("READ ALL failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }

});


/* =====================================================
   READ ONE
   GET /api/reservations/:id
===================================================== */
router.get("/:id", async (req, res) => {

  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, error: "Invalid ID" });
  }

  try {

    const sql = `
      SELECT
        r.*,
        u.email AS user_email,
        res.name AS resource_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN resources res ON r.resource_id = res.id
      WHERE r.id = $1
    `;

    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Reservation not found" });
    }

    return res.status(200).json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error("READ ONE failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }

});


/* =====================================================
   UPDATE
   PUT /api/reservations/:id
===================================================== */
router.put("/:id", async (req, res) => {

  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, error: "Invalid ID" });
  }

  const actorUserId = null;

  const parsedPayload = parseReservationPayload(req.body);
  if (!parsedPayload.ok) {
    return res.status(400).json({ ok: false, error: parsedPayload.error });
  }

  const { resourceId, userId, startTime, endTime, note, status } = parsedPayload.value;

  try {

    const sql = `
      UPDATE reservations
      SET resource_id = $1,
          user_id = $2,
          start_time = $3,
          end_time = $4,
          note = $5,
          status = $6
      WHERE id = $7
      RETURNING *
    `;

    const params = [
      Number(resourceId),
      Number(userId),
      startTime,
      endTime,
      note || null,
      status || "active",
      id
    ];

    const { rows } = await pool.query(sql, params);

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Reservation not found" });
    }

    await logEvent({
      actorUserId,
      action: "reserve",
      message: `Reservation updated (ID ${id})`,
      entityType: "reservation",
      entityId: id,
    });

    return res.status(200).json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error("UPDATE failed:", err);
    return handleReservationDbError(res, err);
  }

});


/* =====================================================
   DELETE
   DELETE /api/reservations/:id
===================================================== */
router.delete("/:id", async (req, res) => {

  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, error: "Invalid ID" });
  }

  const actorUserId = null;

  try {

    const { rowCount } = await pool.query(
      "DELETE FROM reservations WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Reservation not found" });
    }

    await logEvent({
      actorUserId,
      action: "reserve",
      message: `Reservation deleted (ID ${id})`,
      entityType: "reservation",
      entityId: id,
    });

    return res.status(204).send();

  } catch (err) {
    console.error("DELETE failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }

});


export default router;
