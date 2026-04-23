const customerList = document.getElementById("customer-list");
const customerForm = document.getElementById("customer-management-form");
const formModeText = document.getElementById("form-mode-text");
const formStatus = document.getElementById("form-status");
const saveButton = document.getElementById("save-button");
const updateButton = document.getElementById("update-button");
const deleteButton = document.getElementById("delete-button");
const clearButton = document.getElementById("clear-button");

let customers = [];
let selectedCustomerId = null;

function getFormData() {
  const formData = new FormData(customerForm);

  return {
    first_name: formData.get("first_name").trim(),
    last_name: formData.get("last_name").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    birth_date: formData.get("birth_date"),
  };
}

function fillForm(customer) {
  customerForm.elements.first_name.value = customer.first_name || "";
  customerForm.elements.last_name.value = customer.last_name || "";
  customerForm.elements.email.value = customer.email || "";
  customerForm.elements.phone.value = customer.phone || "";
  customerForm.elements.birth_date.value = customer.birth_date ? customer.birth_date.slice(0, 10) : "";
}

function clearForm() {
  customerForm.reset();
  selectedCustomerId = null;
  formModeText.textContent = "Add a new customer using the form below.";
  saveButton.textContent = "Add customer";
  formStatus.textContent = "";
  renderCustomers();
}

function setStatus(message, isError = false) {
  formStatus.textContent = message;
  formStatus.className = isError ? "form-status error-text" : "form-status success-text";
}

function setSelectedCustomer(customer) {
  selectedCustomerId = customer.id;
  fillForm(customer);
  formModeText.textContent = `Editing customer #${customer.id}. You can update or delete this record.`;
  setStatus(`Loaded ${customer.first_name} ${customer.last_name} into the form.`);
  renderCustomers();
}

function createCustomerCard(customer) {
  const div = document.createElement("div");
  div.className = "customer-card";

  if (customer.id === selectedCustomerId) {
    div.classList.add("selected");
  }

  const birthDateText = customer.birth_date
    ? customer.birth_date.slice(0, 10)
    : "-";

  div.innerHTML = `
    <strong>${customer.first_name} ${customer.last_name}</strong>
    <p>Email: ${customer.email}</p>
    <p>Phone: ${customer.phone || "-"}</p>
    <p>Birth date: ${birthDateText}</p>
  `;

  div.addEventListener("click", () => {
    setSelectedCustomer(customer);
  });

  return div;
}

function renderCustomers() {
  customerList.innerHTML = "";

  if (customers.length === 0) {
    customerList.innerHTML = "<p>No customers found.</p>";
    return;
  }

  customers.forEach((customer) => {
    customerList.appendChild(createCustomerCard(customer));
  });
}

async function loadCustomers() {
  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    customers = await res.json();
    renderCustomers();
  } catch (error) {
    console.error(error);
    customerList.innerHTML = "<p class='error-text'>Error loading customers.</p>";
  }
}

async function createCustomer(customerData) {
  const res = await fetch("/api/persons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to add customer");
  }

  return result.person;
}

async function updateCustomer(id, customerData) {
  const res = await fetch(`/api/persons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update customer");
  }

  return result.person;
}

async function deleteCustomer(id) {
  const res = await fetch(`/api/persons/${id}`, {
    method: "DELETE",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to delete customer");
  }
}

customerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const customerData = getFormData();

  try {
    await createCustomer(customerData);
    await loadCustomers();
    clearForm();
    setStatus("Customer added successfully.");
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
});

updateButton.addEventListener("click", async () => {
  if (!selectedCustomerId) {
    setStatus("Select a customer first before updating.", true);
    return;
  }

  const customerData = getFormData();

  try {
    const updatedCustomer = await updateCustomer(selectedCustomerId, customerData);
    await loadCustomers();
    setSelectedCustomer(updatedCustomer);
    setStatus("Customer updated successfully.");
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
});

deleteButton.addEventListener("click", async () => {
  if (!selectedCustomerId) {
    setStatus("Select a customer first before deleting.", true);
    return;
  }

  const confirmed = window.confirm("Delete this customer?");

  if (!confirmed) {
    return;
  }

  try {
    await deleteCustomer(selectedCustomerId);
    await loadCustomers();
    clearForm();
    setStatus("Customer deleted successfully.");
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
});

clearButton.addEventListener("click", () => {
  clearForm();
});

loadCustomers();
