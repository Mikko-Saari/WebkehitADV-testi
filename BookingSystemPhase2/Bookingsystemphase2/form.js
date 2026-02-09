// ===============================
// Form handling for resources page
// ===============================

// -------------- Helpers --------------
function $(id) {
  return document.getElementById(id);
}

function setFieldState(field, isValid) {
  field.classList.remove(
    "border-red-500",
    "border-green-500",
    "ring-red-500/30",
    "ring-green-500/30"
  );

  if (isValid === true) {
    field.classList.add("border-green-500", "ring-2", "ring-green-500/30");
  } else if (isValid === false) {
    field.classList.add("border-red-500", "ring-2", "ring-red-500/30");
  }
}

// -------------- Validation rules --------------
function validateName(value) {
  const trimmed = value.trim();
  const regex = /^[A-Za-z0-9 ]{5,30}$/;
  return regex.test(trimmed);
}

function validateDescription(value) {
  const trimmed = value.trim();
  const regex = /^[A-Za-z0-9 ]{10,50}$/;
  return regex.test(trimmed);
}

function isFormValid() {
  return (
    validateName($("resourceName").value) &&
    validateDescription($("resourceDescription").value)
  );
}

// -------------- Form wiring --------------
document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (!form) return;

  const nameInput = $("resourceName");
  const descInput = $("resourceDescription");
  const actions = $("resourceActions");

  // Create button
  const createBtn = document.createElement("button");
  createBtn.type = "submit";
  createBtn.value = "create";
  createBtn.textContent = "Create";
  createBtn.disabled = true;
  createBtn.className =
    "rounded-2xl bg-brand-primary px-4 py-3 text-sm text-white opacity-50 cursor-not-allowed transition";

  actions.appendChild(createBtn);

  function updateValidation() {
    const nameValid = validateName(nameInput.value);
    const descValid = validateDescription(descInput.value);

    setFieldState(nameInput, nameValid);
    setFieldState(descInput, descValid);

    createBtn.disabled = !(nameValid && descValid);
    createBtn.classList.toggle("opacity-50", createBtn.disabled);
    createBtn.classList.toggle("cursor-not-allowed", createBtn.disabled);
  }

  nameInput.addEventListener("input", updateValidation);
  descInput.addEventListener("input", updateValidation);

  form.addEventListener("submit", onSubmit);
});

// -------------- Submit handler --------------
async function onSubmit(event) {
  event.preventDefault();

  // Final safety check (frontend must not send invalid data)
  if (!isFormValid()) {
    console.warn("Invalid form — request not sent");
    return;
  }

  const payload = {
    action: event.submitter.value,
    resourceName: $("resourceName").value.trim(),
    resourceDescription: $("resourceDescription").value.trim(),
    resourceAvailable: $("resourceAvailable").checked,
    resourcePrice: Number($("resourcePrice").value || 0),
    resourcePriceUnit: document.querySelector(
      "input[name='resourcePriceUnit']:checked"
    ).value
  };

  try {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    console.log("Create success", await response.json());

  } catch (err) {
    console.error("Submission failed:", err);
    alert("Failed to create resource. Please try again.");
  }
}
