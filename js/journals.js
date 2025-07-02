import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let journalModal, journalSubmitBtn;
let editMode = false;
let editId = null;

let currentSortField = "date";
let currentSortOrder = "desc"; // or "asc"
let currentPage = 1;
let pageSize = 10;
let currentSearch = "";

export async function init() {
    journalModal = new bootstrap.Modal(document.getElementById("journalModal"));
    journalSubmitBtn = document.getElementById("submitJournalBtn");
  
    document.getElementById("addJournalBtn").addEventListener("click", () => openJournalForm());
    document.getElementById("journalForm").addEventListener("submit", handleJournalSubmit);
    document.getElementById("searchInput").addEventListener("input", debounce(handleSearch, 400));
    document.getElementById("dateFrom").addEventListener("change", () => loadJournals(1));
    document.getElementById("dateTo").addEventListener("change", () => loadJournals(1));
    document.getElementById("exportExcelBtn").addEventListener("click", handleExportExcel);
    document.getElementById("exportDbfBtn").addEventListener("click", handleExportDbf);
  
    setupImportModal();
    document.getElementById("journalsTableBody").addEventListener("click", handleTableClick);
  
    document.addEventListener("click", function (e) {
      if (e.target.closest(".sort-link")) {
        e.preventDefault();
        const link = e.target.closest(".sort-link");
        const newField = link.dataset.sort;
  
        if (currentSortField === newField) {
          currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        } else {
          currentSortField = newField;
          currentSortOrder = "asc";
        }
  
        document.querySelectorAll(".sort-icon").forEach(icon => {
          icon.innerHTML = "";
        });
  
        const iconTarget = link.querySelector(".sort-icon");
        iconTarget.innerHTML = currentSortOrder === "asc"
          ? '<i class="bi bi-caret-up-fill"></i>'
          : '<i class="bi bi-caret-down-fill"></i>';
  
        loadJournals(1, document.getElementById("searchInput").value);
      }
    });
  
    await loadJournals();
    await loadSelectOptions();
  }
  

async function handleExportExcel() {
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const token = localStorage.getItem("accessToken");

    const params = new URLSearchParams();
    if (dateFrom) params.append("date_after", dateFrom);
    if (dateTo) params.append("date_before", dateTo);

    const url = `${BACKEND_URL}/port/journals/export/excel/?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!response.ok) throw new Error("Exportul Excel a eșuat.");
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "jurnal_export.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      showToast("Eroare la exportul Excel.", "error");
    }
  }
  
  async function handleExportDbf() {
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const token = localStorage.getItem("accessToken");
  
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_after", dateFrom);
    if (dateTo) params.append("date_before", dateTo);
  
    const url = `${BACKEND_URL}/port/journals/export/dbf/?${params.toString()}`;
  
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!response.ok) throw new Error("Exportul DBF a eșuat.");
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "jurnal_export.dbf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      showToast("Eroare la exportul DBF.", "error");
    }
  }

  async function handleFetchIbkr() {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/trigger-journals-ibkr-fetch/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error("Eroare la importul jurnalelor din IBKR.");
      showToast("Importul din IBKR a fost pornit.", "success");
      await loadJournals();
    } catch (err) {
      console.error(err);
      showToast("Importul din IBKR a eșuat.", "error");
    }
  }
  
  async function handleFetchTdv() {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/trigger-journals-tdv-fetch/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error("Eroare la importul jurnalelor din TDV.");
      showToast("Importul din TDV a fost pornit.", "success");
      await loadJournals();
    } catch (err) {
      console.error(err);
      showToast("Importul din TDV a eșuat.", "error");
    }
  }
  

  function setupImportModal() {
    let importType = null;
    const importModal = new bootstrap.Modal(document.getElementById("importDateModal"));
  
    document.getElementById("fetchIbkrBtn").addEventListener("click", () => {
      importType = "ibkr";
      importModal.show();
    });
  
    document.getElementById("fetchTdvBtn").addEventListener("click", () => {
      importType = "tdv";
      importModal.show();
    });
  
    document.getElementById("confirmImportBtn").addEventListener("click", async () => {
      const importDate = document.getElementById("importDate").value;
      if (!importDate) {
        showToast("Selectează o dată pentru import.", "warning");
        return;
      }
  
      const endpoint =
        importType === "ibkr"
          ? "trigger-journals-ibkr-fetch"
          : "trigger-journals-tdv-fetch";
  
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${BACKEND_URL}/port/${endpoint}/?date=${importDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) throw new Error("Eroare la import.");
        showToast(`Importul din ${importType.toUpperCase()} a fost pornit.`, "success");
        importModal.hide();
        await loadJournals();
      } catch (err) {
        console.error(err);
        showToast(`Importul din ${importType.toUpperCase()} a eșuat.`, "error");
      }
    });
  }
  


async function loadJournals(page = 1, search = "") {
  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;
  const tableBody = document.getElementById("journalsTableBody");
  tableBody.innerHTML = `<tr><td colspan="20">Se încarcă...</td></tr>`;

  try {
    const token = localStorage.getItem("accessToken");
    // const url = new URL(`${BACKEND_URL}/port/journals/`);
    // url.searchParams.append("page", page);
    // url.searchParams.append("ordering", `${currentSortOrder === "desc" ? "-" : ""}${currentSortField}`);
    // if (search) url.searchParams.append("search", search);
    // if (dateFrom) url.searchParams.append("date_after", dateFrom);
    // if (dateTo) url.searchParams.append("date_before", dateTo);

    const params = new URLSearchParams();

    params.append("page", page);
    params.append("ordering", `${currentSortOrder === "desc" ? "-" : ""}${currentSortField}`);
    if (search) params.append("search", search);
    if (dateFrom) params.append("date_after", dateFrom);
    if (dateTo) params.append("date_before", dateTo);

    const url = `${BACKEND_URL}/port/journals/?${params.toString()}`;
    // const res = await fetch(url.toString(), {
      const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();
    const data = json.results || [];

    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="20" class="text-center">Nu există înregistrări.</td></tr>`;
      return;
    }

    data.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.id}</td>
        <td>${entry.date}</td>
        <td>${entry.transactionid}</td>
        <td>${entry.ubo_code}</td>
        <td>${entry.custodian_code}</td>
        <td>${entry.account_code}</td>
        <td>${entry.operation_code}</td>
        <td>${entry.partner_code}</td>
        <td>${entry.symbol}</td>
        <td>${entry.currency_code}</td>
        <td>${entry.quantity}</td>
        <td>${entry.details}</td>
        <td>${entry.value_abs}</td>
        <td>${entry.value_ron_abs}</td>
        <td>${entry.bnr}</td>
        <td>${entry.storno ? "✔️" : ""}</td>
        <td>${entry.lock ? "✔️" : ""}</td>
        <td>${entry.debit_analitic}</td>
        <td>${entry.credit_analitic}</td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-warning edit-btn" data-id="${entry.id}">Editează</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${entry.id}">Șterge</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    updatePagination(json.count, page);
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `<tr><td colspan="20" class="text-danger">Eroare la încărcarea datelor.</td></tr>`;
  }
}

async function handleTableClick(event) {
    console.log("CLICKED")
    const id = event.target.dataset.id;
  
    if (event.target.classList.contains("edit-btn")) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${BACKEND_URL}/port/journals/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        openJournalForm(data);
      } catch (err) {
        showToast("Nu s-a putut deschide formularul jurnalului.", "error");
      }
    }
  
    if (event.target.classList.contains("delete-btn")) {
      if (!confirm("Ești sigur că vrei să ștergi acest jurnal?")) return;
  
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${BACKEND_URL}/port/journals/${id}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (res.ok) {
          showToast("Jurnalul a fost șters.", "success");
          await loadJournals();
        } else {
          showToast("Eroare la ștergere jurnal.", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Eroare de rețea la ștergere jurnal.", "error");
      }
    }
  }
  

function updatePagination(totalCount, currentPage) {
  const paginationContainer = document.getElementById("pagination");
  const totalPages = Math.ceil(totalCount / pageSize);
  paginationContainer.innerHTML = "";

  const createPageButton = (i, label = null) => {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"} px-3`;
    btn.innerText = label || i;
    btn.onclick = () => loadJournals(i, currentSearch);
    return btn;
  };

  const createEllipsis = () => {
    const span = document.createElement("span");
    span.className = "px-2";
    span.innerText = "...";
    return span;
  };

  if (currentPage > 1) {
    const prevBtn = createPageButton(currentPage - 1, "←");
    prevBtn.onclick = () => loadJournals(currentPage - 1, currentSearch);
    paginationContainer.appendChild(prevBtn);
  }

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }
  } else {
    paginationContainer.appendChild(createPageButton(1));
    if (currentPage > 4) paginationContainer.appendChild(createEllipsis());

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }

    if (currentPage < totalPages - 3) paginationContainer.appendChild(createEllipsis());
    paginationContainer.appendChild(createPageButton(totalPages));
  }

  if (currentPage < totalPages) {
    const nextBtn = createPageButton(currentPage + 1, "→");
    nextBtn.onclick = () => loadJournals(currentPage + 1, currentSearch);
    paginationContainer.appendChild(nextBtn);
  }
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function handleSearch(e) {
    currentSearch = e.target.value;
    currentPage = 1;
    loadJournals(currentPage, currentSearch);
  }

function openJournalForm(data = null) {
  const form = document.getElementById("journalForm");
  form.reset();

  if (data) {
    Object.keys(data).forEach(key => {
      const input = form.elements[key];
      if (input) {
        if (input.type === "checkbox") {
          input.checked = data[key];
        } else {
          input.value = data[key];
        }
      }
    });
    editMode = true;
    editId = data.id;
  } else {
    editMode = false;
    editId = null;
  }

  journalModal.show();
}

async function handleJournalSubmit(event) {
  event.preventDefault();
  const form = event.target;

  journalSubmitBtn.disabled = true;
  journalSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Se salvează...`;

  const token = localStorage.getItem("accessToken");
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  payload.storno = form.storno.checked;
  payload.lock = form.lock.checked;

  const method = editMode ? "PUT" : "POST";
  const url = editMode
    ? `${BACKEND_URL}/port/journals/${editId}/`
    : `${BACKEND_URL}/port/journals/`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
      showToast("Jurnalul a fost salvat cu succes.", "success");
      await loadJournals();
      journalModal.hide();
    } else {
      showToast(result.detail || "Eroare la salvare jurnal.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Eroare de rețea la salvare jurnal.", "error");
  } finally {
    journalSubmitBtn.disabled = false;
    journalSubmitBtn.textContent = editMode ? "Salvează" : "Adaugă";
  }
}

async function loadSelectOptions() {
  const endpoints = ["custodians", "accounts", "operations", "partners", "instruments"];

  for (const endpoint of endpoints) {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/${endpoint}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Eroare la încărcarea opțiunilor pentru ${endpoint}.`);
      const data = await res.json();
      const select = document.getElementById(endpoint.slice(0, -1));

      if (select) {
        select.innerHTML = `<option value="">-- Selectează --</option>`;
        (data.results || data).forEach(item => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.name || item.code || item.label || item.symbol;
          select.appendChild(option);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
