// operations.js
import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let operationModal, accountModal;
let editOperationId = null;
let lastSelectUpdated = null;
let nextPage = null;
let prevPage = null;

export async function init() {
  operationModal = new bootstrap.Modal(document.getElementById("operationModal"));
  accountModal = new bootstrap.Modal(document.getElementById("accountModal"));

  document.getElementById("addOperationBtn").addEventListener("click", () => openOperationForm());
  document.getElementById("operationForm").addEventListener("submit", handleOperationSubmit);
  document.getElementById("accountForm").addEventListener("submit", handleAccountSubmit);
  document.addEventListener("click", handleTableClick);

  document.getElementById("addDebitAccountBtn").addEventListener("click", () => {
    lastSelectUpdated = "debit";
    accountModal.show();
  });
  document.getElementById("addCreditAccountBtn").addEventListener("click", () => {
    lastSelectUpdated = "credit";
    accountModal.show();
  });

  document.getElementById("searchOperationInput").addEventListener("input", () => loadOperations());

  await loadOperations();
  await loadAccounts();
}

async function loadOperations(url = `${BACKEND_URL}/port/operations/`) {
    const tbody = document.getElementById("operationTableBody");
    tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Se încarcă...</td></tr>";
    const token = localStorage.getItem("accessToken");
    const search = document.getElementById("searchOperationInput").value.toLowerCase();
  
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const entries = data.results || data;
  
      nextPage = data.next;
      prevPage = data.previous;
      renderPagination();
  
      const filtered = entries.filter(op => {
        return (
          !search ||
          op.operation_code.toLowerCase().includes(search) ||
          op.operation_name.toLowerCase().includes(search)
        );
      });
  
      tbody.innerHTML = "";
      filtered.forEach(op => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${op.operation_code}</td>
          <td>${op.operation_name}</td>
          <td>${op.debit_display || op.debit}</td>
          <td>${op.credit_display || op.credit}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${op.id}">Editează</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${op.id}">Șterge</button>
          </td>`;
        tbody.appendChild(row);
      });
  
      if (filtered.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Niciun rezultat găsit.</td></tr>";
      }
    } catch (err) {
      showToast("Eroare la încărcare operațiuni.", "error");
    }
  }

  async function loadAccounts() {
    const token = localStorage.getItem("accessToken");
    const selects = ["debit", "credit"].map(id => document.getElementById(id));
    selects.forEach(select => (select.innerHTML = "<option value=''>-- Selectează --</option>"));
  
    let url = `${BACKEND_URL}/port/accountings/`;
    const allAccounts = [];
  
    try {
      while (url) {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        allAccounts.push(...(data.results || data));
        url = data.next;
      }
  
      allAccounts.forEach(acc => {
        const option = new Option(`${acc.account_code} - ${acc.account_name}`, acc.id);
        selects.forEach(select => select.appendChild(option.cloneNode(true)));
      });
    } catch (err) {
      console.error("Eroare la încărcarea conturilor", err);
    }
  }

function openOperationForm(data = null) {
  document.getElementById("operationForm").reset();
  if (data) {
    document.getElementById("operation_code").value = data.operation_code;
    document.getElementById("operation_name").value = data.operation_name;
    document.getElementById("debit").value = data.debit;
    document.getElementById("credit").value = data.credit;
    editOperationId = data.id;
  } else {
    editOperationId = null;
  }
  operationModal.show();
}

async function handleOperationSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem("accessToken");
  const payload = {
    operation_code: document.getElementById("operation_code").value,
    operation_name: document.getElementById("operation_name").value,
    debit: document.getElementById("debit").value,
    credit: document.getElementById("credit").value,
  };

  const url = editOperationId
    ? `${BACKEND_URL}/port/operations/${editOperationId}/`
    : `${BACKEND_URL}/port/operations/`;
  const method = editOperationId ? "PUT" : "POST";

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
      showToast("Salvat cu succes.", "success");
      operationModal.hide();
      await loadOperations();
    } else {
      const err = await res.json();
      showToast(err.detail || "Eroare la salvare.", "error");
    }
  } catch (err) {
    showToast("Eroare rețea.", "error");
  }
}

async function handleTableClick(e) {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("edit-btn")) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BACKEND_URL}/port/operations/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    openOperationForm(data);
  } else if (e.target.classList.contains("delete-btn")) {
    if (!confirm("Ești sigur că vrei să ștergi această operațiune?")) return;
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BACKEND_URL}/port/operations/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast("Șters cu succes.", "success");
      await loadOperations();
    } else {
      showToast("Eroare la ștergere.", "error");
    }
  }
}

async function handleAccountSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem("accessToken");
  const payload = {
    account_code: document.getElementById("account_code").value,
    account_name: document.getElementById("account_name").value,
  };

  try {
    const res = await fetch(`${BACKEND_URL}/port/accountings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast("Cont adăugat.", "success");
      accountModal.hide();
      await loadAccounts();
    } else {
      const err = await res.json();
      showToast(err.detail || "Eroare la salvare cont.", "error");
    }
  } catch (err) {
    showToast("Eroare rețea la cont.", "error");
  }
}

function renderPagination() {
    let pagination = document.getElementById("paginationControls");
    if (!pagination) {
      pagination = document.createElement("div");
      pagination.id = "paginationControls";
      pagination.className = "d-flex justify-content-between mt-3";
      document.querySelector(".card-body").appendChild(pagination);
    }
  
    pagination.innerHTML = `
      <button class="btn btn-outline-primary" id="prevPageBtn" ${!prevPage ? "disabled" : ""}>Pagina anterioară</button>
      <button class="btn btn-outline-primary" id="nextPageBtn" ${!nextPage ? "disabled" : ""}>Pagina următoare</button>
    `;
  
    document.getElementById("prevPageBtn").addEventListener("click", () => loadOperations(prevPage));
    document.getElementById("nextPageBtn").addEventListener("click", () => loadOperations(nextPage));
  }