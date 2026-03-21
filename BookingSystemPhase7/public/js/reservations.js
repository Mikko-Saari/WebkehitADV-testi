import { getTokenPayload, initAuthUI, requireAuthOrBlockPage, logout } from "./auth-ui.js";

initAuthUI();
if (!requireAuthOrBlockPage()) {
  throw new Error("Authentication required");
}
window.logout = logout;

const form = document.getElementById("reservationForm");
const actions = document.getElementById("reservationActions");
const listEl = document.getElementById("reservationList");
const messageEl = document.getElementById("formMessage");

const reservationIdInput = document.getElementById("reservationId");
const resourceIdInput = document.getElementById("resourceId");
const userIdInput = document.getElementById("userId");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const noteInput = document.getElementById("note");
const statusInput = document.getElementById("status");

const BUTTON_BASE = "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";
const BUTTON_STYLE = "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

let reservationsCache = [];
let formMode = "create";

function keepOnlyDigits(value) {
  return value.replace(/\D+/g, "");
}

function parsePositiveInteger(value) {
  const trimmed = String(value ?? "").trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function enforceNumericInput(inputEl) {
  if (!inputEl) return;

  inputEl.addEventListener("input", () => {
    const cleaned = keepOnlyDigits(inputEl.value);
    if (cleaned !== inputEl.value) {
      inputEl.value = cleaned;
    }
  });
}

function prefillUserIdFromToken() {
  const payload = getTokenPayload();
  const tokenUserId = parsePositiveInteger(payload?.sub);
  if (!tokenUserId || userIdInput.value.trim() !== "") return;
  userIdInput.value = String(tokenUserId);
}

function addActionButton({ label, value, type = "submit" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.value = value;
  btn.name = "action";
  btn.className = `${BUTTON_BASE} ${BUTTON_STYLE}`;
  btn.textContent = label;
  actions.appendChild(btn);
  return btn;
}

function renderActionButtons() {
  actions.innerHTML = "";
  addActionButton({ label: "Create", value: "create" });
  const update = addActionButton({ label: "Update", value: "update" });
  const del = addActionButton({ label: "Delete", value: "delete" });
  const clear = addActionButton({ label: "Clear", value: "clear", type: "button" });

  const selected = Boolean(reservationIdInput.value);
  update.disabled = !selected;
  del.disabled = !selected;

  [update, del].forEach((btn) => {
    if (btn.disabled) {
      btn.classList.add("cursor-not-allowed", "opacity-50");
      btn.classList.remove("hover:bg-brand-dark/80");
    }
  });

  clear.addEventListener("click", () => {
    clearForm();
    clearMessage();
  });
}

function showMessage(type, text) {
  messageEl.className = "mt-6 rounded-2xl border px-4 py-3 text-sm whitespace-pre-line";
  messageEl.classList.remove("hidden");

  if (type === "success") {
    messageEl.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-900");
  } else {
    messageEl.classList.add("border-rose-200", "bg-rose-50", "text-rose-900");
  }

  messageEl.textContent = text;
}

function clearMessage() {
  messageEl.className = "hidden mt-6 rounded-2xl border px-4 py-3 text-sm";
  messageEl.textContent = "";
}

function toIsoOrEmpty(inputValue) {
  if (!inputValue) return "";
  const d = new Date(inputValue);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

function toLocalInputValue(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const offsetMinutes = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offsetMinutes * 60000);
  return local.toISOString().slice(0, 16);
}

function getPayload() {
  return {
    resourceId: parsePositiveInteger(resourceIdInput.value),
    userId: parsePositiveInteger(userIdInput.value),
    startTime: toIsoOrEmpty(startTimeInput.value),
    endTime: toIsoOrEmpty(endTimeInput.value),
    note: noteInput.value.trim(),
    status: statusInput.value,
  };
}

function validatePayload(payload, action) {
  if (action !== "create" && payload.resourceId === null) {
    return "Resource ID must be a positive number.";
  }
  if (action !== "create" && payload.userId === null) {
    return "User ID must be a positive number.";
  }
  if (!payload.startTime || !payload.endTime) {
    return "Start and end times are required.";
  }
  if (new Date(payload.endTime) <= new Date(payload.startTime)) {
    return "End time must be later than start time.";
  }
  return null;
}

function getHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function readBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }
  return response.text().catch(() => "");
}

function selectReservation(reservation) {
  reservationIdInput.value = String(reservation.id);
  resourceIdInput.value = reservation.resource_id;
  userIdInput.value = reservation.user_id;
  startTimeInput.value = toLocalInputValue(reservation.start_time);
  endTimeInput.value = toLocalInputValue(reservation.end_time);
  noteInput.value = reservation.note || "";
  statusInput.value = reservation.status || "active";
  formMode = "edit";
  renderActionButtons();
  highlightSelection(reservation.id);
}

function clearForm() {
  form.reset();
  reservationIdInput.value = "";
  statusInput.value = "active";
  formMode = "create";
  renderActionButtons();
  highlightSelection(null);
}

function renderReservationList(items) {
  if (!items.length) {
    listEl.innerHTML = '<p class="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/60">No reservations yet.</p>';
    return;
  }

  listEl.innerHTML = items
    .map((item) => {
      const startText = new Date(item.start_time).toLocaleString();
      const endText = new Date(item.end_time).toLocaleString();

      return `
        <button
          type="button"
          data-reservation-id="${item.id}"
          class="w-full text-left rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:bg-black/5"
          title="Select reservation"
        >
          <div class="font-semibold">#${item.id} - ${item.resource_name || "Resource " + item.resource_id}</div>
          <div class="mt-1 text-xs text-black/60">User ${item.user_id}${item.user_email ? " - " + item.user_email : ""}</div>
          <div class="mt-1 text-xs text-black/60">${startText} -> ${endText}</div>
          <div class="mt-1 text-xs text-black/60">Status: ${item.status}</div>
        </button>
      `;
    })
    .join("");

  listEl.querySelectorAll("[data-reservation-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.reservationId);
      const reservation = reservationsCache.find((r) => Number(r.id) === id);
      if (!reservation) return;
      clearMessage();
      selectReservation(reservation);
    });
  });
}

function highlightSelection(id) {
  listEl.querySelectorAll("[data-reservation-id]").forEach((el) => {
    const selected = id && Number(el.dataset.reservationId) === Number(id);
    el.classList.toggle("ring-2", selected);
    el.classList.toggle("ring-brand-blue/40", selected);
    el.classList.toggle("bg-brand-blue/5", selected);
  });
}

async function loadReservations() {
  try {
    const response = await fetch("/api/reservations", {
      headers: getHeaders(),
      credentials: "same-origin",
    });
    const body = await readBody(response);

    if (!response.ok) {
      throw new Error(body?.error || `Failed to load reservations (${response.status})`);
    }

    reservationsCache = Array.isArray(body.data) ? body.data : [];
    renderReservationList(reservationsCache);

    if (reservationIdInput.value) {
      const selected = reservationsCache.find((r) => Number(r.id) === Number(reservationIdInput.value));
      if (selected) {
        highlightSelection(selected.id);
      } else {
        clearForm();
      }
    }
  } catch (err) {
    console.error(err);
    reservationsCache = [];
    renderReservationList([]);
    showMessage("error", "Could not load reservations. Please try again.");
  }
}

async function submitReservation(event) {
  event.preventDefault();
  clearMessage();

  const action = event.submitter?.value || formMode;
  if (action === "clear") {
    clearForm();
    return;
  }

  const id = Number(reservationIdInput.value);

  if ((action === "update" || action === "delete") && !id) {
    showMessage("error", "Select a reservation from the list first.");
    return;
  }

  if (action === "delete") {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "same-origin",
      });

      if (!response.ok) {
        const body = await readBody(response);
        throw new Error(body?.error || `Delete failed (${response.status})`);
      }

      showMessage("success", `Reservation #${id} deleted successfully.`);
      clearForm();
      await loadReservations();
      return;
    } catch (err) {
      showMessage("error", err.message || "Delete failed.");
      return;
    }
  }

  const payload = getPayload();
  const validationError = validatePayload(payload, action);
  if (validationError) {
    showMessage("error", validationError);
    return;
  }

  const method = action === "update" ? "PUT" : "POST";
  const url = action === "update" ? `/api/reservations/${id}` : "/api/reservations";

  try {
    const response = await fetch(url, {
      method,
      headers: getHeaders(),
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });

    const body = await readBody(response);

    if (!response.ok) {
      throw new Error(body?.error || `${action} failed (${response.status})`);
    }

    const reservation = body?.data;
    if (action === "create") {
      showMessage("success", `Reservation #${reservation?.id || ""} created successfully.`);
      clearForm();
    } else {
      showMessage("success", `Reservation #${id} updated successfully.`);
    }

    await loadReservations();
  } catch (err) {
    showMessage("error", err.message || "Request failed.");
  }
}

renderActionButtons();
enforceNumericInput(resourceIdInput);
enforceNumericInput(userIdInput);
prefillUserIdFromToken();
form.addEventListener("submit", submitReservation);
loadReservations();
