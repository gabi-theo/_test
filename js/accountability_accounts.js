import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let accountModal, submitBtn;
let editMode = false;
let currentId = null;

export async function init() {
  const tableBody = document.getElementById("accountMappingTableBody");
  const addBtn = document.getElementById("addAccountBtn");

  accountModal = new bootstrap.Modal(document.getElementById("accountMappingModal"));
  submitBtn = document.getElementById("submitBtn");

  const downloadBtn = document.getElementById("downloadExcelBtn");
  const uploadInput = document.getElementById("uploadExcelInput");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", handleDownloadExcel);
  }

  if (uploadInput) {
    uploadInput.addEventListener("change", handleUploadExcel);
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => openForm());
  }

  document.getElementById("accountMappingForm").addEventListener("submit", handleSubmit);
  tableBody.addEventListener("click", handleTableClick);

  await loadAccountMappings();
}

async function loadAccountMappings() {
  const tableBody = document.getElementById("accountMappingTableBody");
  tableBody.innerHTML = `<tr><td colspan="4">Se încarcă...</td></tr>`;

  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BACKEND_URL}/port/account-mapping/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("!!!!!!!!")
    console.log(res)
    if (!res.ok) throw new Error("Eroare la încărcarea datelor");
    const data = await res.json();
    console.log("!!!!!!!!!!!")
    console.log(data)
    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Nu există înregistrări.</td></tr>`;
      return;
    }

    data.forEach(entry => {
      const row = document.createElement("tr");
      console.log("Loaded entry:", entry);

      row.innerHTML = `
        <td>${entry.id}</td>
        <td>${entry.account_saga || "-"}</td>
        <td>${entry.main_account}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-warning me-1 edit-btn" data-id="${entry.id}">Editează</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${entry.id}">Șterge</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `<tr><td colspan="4" class="text-danger">Eroare la încărcarea datelor.</td></tr>`;
  }
}

function openForm(data = null) {
  const form = document.getElementById("accountMappingForm");
  form.reset();
  console.log(data)

  if (data) {
    form.account_saga.value = data.account_saga || "";
    form.main_account.value = data.main_account;

    editMode = true;
    currentId = data.id;
    document.getElementById("formModalLabel").textContent = "Editează înregistrare";
    submitBtn.textContent = "Salvează";
  } else {
    editMode = false;
    currentId = null;
    document.getElementById("formModalLabel").textContent = "Adaugă înregistrare";
    submitBtn.textContent = "Adaugă";
  }

  accountModal.show();
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Se salvează...`;

  const token = localStorage.getItem("accessToken");
  const payload = {
    account_saga: form.account_saga.value,
    main_account: form.main_account.value,
  };

  const url = editMode
    ? `${BACKEND_URL}/port/account-mapping/${currentId}/`
    : `${BACKEND_URL}/port/account-mapping/`;
  const method = editMode ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      showToast("Datele au fost salvate cu succes.", "success");
      await loadAccountMappings();
      accountModal.hide();
    } else {
      showToast(result.detail || "Eroare la salvare.", "error");
    }
  } catch (err) {
    console.error("Submit error:", err);
    showToast("Eroare de rețea.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = editMode ? "Salvează" : "Adaugă";
  }
}

async function handleTableClick(event) {
  const id = event.target.dataset.id;

  if (event.target.classList.contains("edit-btn")) {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/account-mapping/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      console.log(data)
      openForm(data);
    } catch (err) {
      showToast("Nu s-a putut deschide formularul.", "error");
    }
  }

  if (event.target.classList.contains("delete-btn")) {
    if (!confirm("Ești sigur că vrei să ștergi această înregistrare?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/account-mapping/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        showToast("Înregistrarea a fost ștearsă.", "success");
        await loadAccountMappings();
      } else {
        showToast("Eroare la ștergere.", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Eroare de rețea.", "error");
    }
  }
}


async function handleDownloadExcel() {
    const token = localStorage.getItem("accessToken");
  
    try {
      const res = await fetch(`${BACKEND_URL}/port/account-mapping/excel_file/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) throw new Error("Eroare la descărcarea fișierului.");
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "account_mappings.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      showToast("Eroare la descărcarea fișierului Excel.", "error");
    }
  }
  
  async function handleUploadExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch(`${BACKEND_URL}/port/account-mapping/excel_file/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
  
      const result = await res.json();
      if (res.ok) {
        showToast("Fișierul a fost încărcat cu succes.", "success");
        await loadAccountMappings();
      } else {
        console.error(result);
        showToast(result.detail || "Eroare la încărcare.", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Eroare la trimiterea fișierului.", "error");
    } finally {
      event.target.value = "";  // reset input
    }
  }
  