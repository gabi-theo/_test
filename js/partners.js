import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let partnerModal;
let editMode = false;
let editId = null;
let editTypeId = null;

export async function init() {
  partnerModal = new bootstrap.Modal(document.getElementById("partnerModal"));
  document.getElementById("addPartnerBtn").addEventListener("click", () => openPartnerForm());
  document.getElementById("partnerForm").addEventListener("submit", handlePartnerSubmit);
  document.getElementById("addPartnerTypeBtn").addEventListener("click", () => openPartnerTypeForm());
  document.getElementById("partnerTypeForm").addEventListener("submit", handlePartnerTypeSubmit);
  document.addEventListener("click", handleTableClick);

  await loadPartnerTypes();
  await loadPartners();
}

async function loadPartners() {
  const tableBody = document.getElementById("partnersTableBody");
  tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Se încarcă...</td></tr>`;

  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BACKEND_URL}/port/partners/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    tableBody.innerHTML = "";

    (data.results || data).forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.partner_code}</td>
        <td>${entry.partner_type}</td>
        <td>${entry.partner_type_code}</td>
        <td>${entry.journal_code}</td>
        <td>${entry.partner_name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-warning edit-btn" data-id="${entry.id}">Editează</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${entry.id}">Șterge</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">Eroare la încărcarea datelor.</td></tr>`;
  }
}

function openPartnerForm(data = null) {
  const form = document.getElementById("partnerForm");
  form.reset();

  if (data) {
    form.querySelector("#partner_code").value = data.partner_code;
    form.querySelector("#partner_name").value = data.partner_name;
    form.querySelector("#partner_type").value = data.partner_type;
    document.getElementById("partner_type_code_display").value = data.partner_type_code;
    document.getElementById("journal_code_display").value = data.journal_code;
    editMode = true;
    editId = data.id;
  } else {
    document.getElementById("partner_type_code_display").value = "";
    document.getElementById("journal_code_display").value = "";
    editMode = false;
    editId = null;
  }

  partnerModal.show();
}

async function handlePartnerSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const token = localStorage.getItem("accessToken");

  const payload = {
    partner_code: form.querySelector("#partner_code").value,
    partner_name: form.querySelector("#partner_name").value,
    partner_type: form.querySelector("#partner_type").value,
  };

  const method = editMode ? "PUT" : "POST";
  const url = editMode
    ? `${BACKEND_URL}/port/partners/${editId}/`
    : `${BACKEND_URL}/port/partners/`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast("Partenerul a fost salvat.", "success");
      partnerModal.hide();
      await loadPartners();
    } else {
      const err = await res.json();
      showToast(err.detail || "Eroare la salvare partener.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Eroare rețea la salvare partener.", "error");
  }
}

async function handleTableClick(e) {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (editBtn) {
    const id = editBtn.dataset.id;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/partners/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      openPartnerForm(data);
    } catch (err) {
      showToast("Nu s-a putut încărca partenerul.", "error");
    }
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    if (!confirm("Ești sigur că vrei să ștergi acest partener?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/partners/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast("Partenerul a fost șters.", "success");
        await loadPartners();
      } else {
        showToast("Eroare la ștergere partener.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare rețea la ștergere partener.", "error");
    }
  }
}


async function loadPartnerTypes() {
  const select = document.getElementById("partner_type");
  if (select) {
    select.innerHTML = `<option value="">-- Selectează --</option>`;
  }

  const token = localStorage.getItem("accessToken");
  const tbody = document.getElementById("partnerTypesTableBody");
  tbody.innerHTML = `<tr><td colspan="4">Se încarcă...</td></tr>`;

  try {
    const res = await fetch(`${BACKEND_URL}/port/partner-types/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    tbody.innerHTML = "";

    (data.results || data).forEach(item => {
      if (select) {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.partner_type_code;
        select.appendChild(option);
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.partner_type_code}</td>
        <td>${item.journal_code}</td>
        <td class="text-end">
          <button class="btn btn-warning btn-sm me-1" onclick="editPartnerType(${item.id}, '${item.partner_type_code}', '${item.journal_code}')">Editează</button>
          <button class="btn btn-danger btn-sm" onclick="deletePartnerType(${item.id})">Șterge</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="4">Eroare la încărcare.</td></tr>`;
  }
}

function openPartnerTypeForm() {
  document.getElementById("partnerTypeForm").reset();
  editTypeId = null;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("partnerTypeModal")).show();
}

async function handlePartnerTypeSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem("accessToken");

  const payload = {
    partner_type_code: document.getElementById("partner_type_code_type").value,
    journal_code: document.getElementById("journal_code_type").value,
  };

  const method = editTypeId ? "PUT" : "POST";
  const url = editTypeId
    ? `${BACKEND_URL}/port/partner-types/${editTypeId}/`
    : `${BACKEND_URL}/port/partner-types/`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast("Tipul de partener a fost salvat.", "success");
      bootstrap.Modal.getOrCreateInstance(document.getElementById("partnerTypeModal")).hide();
      await loadPartnerTypes();
    } else {
      showToast("Eroare la salvare tip partener.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Eroare de rețea.", "error");
  }
}

window.editPartnerType = (id, code, journal) => {
  editTypeId = id;
  document.getElementById("partner_type_code_type").value = code;
  document.getElementById("journal_code_type").value = journal;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("partnerTypeModal")).show();
};

window.deletePartnerType = async (id) => {
  if (!confirm("Ești sigur că vrei să ștergi acest tip de partener?")) return;

  const token = localStorage.getItem("accessToken");
  try {
    const res = await fetch(`${BACKEND_URL}/port/partner-types/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      showToast("Tipul de partener a fost șters.", "success");
      await loadPartnerTypes();
    } else {
      showToast("Eroare la ștergere.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Eroare de rețea la ștergere.", "error");
  }
};