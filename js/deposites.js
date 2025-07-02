// deposits.js
import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let depositModal;
let editDepositId = null;
let nextPage = null;
let prevPage = null;

export async function init() {
  depositModal = new bootstrap.Modal(document.getElementById("depositModal"));

  document.getElementById("addDepositBtn").addEventListener("click", () => openDepositForm());
  document.getElementById("depositForm").addEventListener("submit", handleDepositSubmit);
  document.getElementById("searchDepositInput").addEventListener("input", () => loadDeposits());

  await loadInstruments();
  await loadDeposits();
}

async function loadDeposits(url = `${BACKEND_URL}/port/deposits/`) {
  const tbody = document.getElementById("depositTableBody");
  tbody.innerHTML = "<tr><td colspan='6' class='text-center'>Se încarcă...</td></tr>";
  const token = localStorage.getItem("accessToken");
  const search = document.getElementById("searchDepositInput").value.toLowerCase();

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const entries = data.results || data;
    nextPage = data.next;
    prevPage = data.previous;
    renderPagination();

    const filtered = entries.filter(dep => !search || dep.deposit.toLowerCase().includes(search));

    tbody.innerHTML = "";
    filtered.forEach(dep => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dep.deposit}</td>
        <td>${dep.principal}</td>
        <td>${dep.interest_rate}</td>
        <td>${dep.start}</td>
        <td>${dep.maturity}</td>
        <td>${dep.details || ''}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-btn" data-id="${dep.id}">Editează</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${dep.id}">Șterge</button>
        </td>`;
      tbody.appendChild(row);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = "<tr><td colspan='7' class='text-center'>Niciun rezultat găsit.</td></tr>";
    }
  } catch (err) {
    showToast("Eroare la încărcare depozite.", "error");
  }
}

async function loadInstruments() {
    const token = localStorage.getItem("accessToken");
    const select = document.getElementById("depositInstrument");
    select.innerHTML = "<option value=''>-- Selectează --</option>";
  
    let url = `${BACKEND_URL}/port/instruments/`;
    const allInstruments = [];
  
    try {
      while (url) {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        allInstruments.push(...(data.results || data));
        url = data.next;
      }

      allInstruments.forEach(inst => {
        const option = new Option(inst.symbol, inst.id);
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Eroare la încărcarea instrumentelor", err);
      showToast("Eroare la încărcarea instrumentelor.", "error");
    }
  }

function openDepositForm(data = null) {
  document.getElementById("depositForm").reset();
  if (data) {
    document.getElementById("depositInstrument").value = data.deposit_id;
    document.getElementById("principal").value = data.principal;
    document.getElementById("interest_rate").value = data.interest_rate;
    document.getElementById("start").value = data.start;
    document.getElementById("maturity").value = data.maturity;
    document.getElementById("convention").value = data.convention;
    document.getElementById("details").value = data.details;
    editDepositId = data.id;
  } else {
    editDepositId = null;
  }
  depositModal.show();
}

async function handleDepositSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem("accessToken");
  const payload = {
    deposit: document.getElementById("depositInstrument").value,
    principal: document.getElementById("principal").value,
    interest_rate: document.getElementById("interest_rate").value,
    start: document.getElementById("start").value,
    maturity: document.getElementById("maturity").value,
    convention: document.getElementById("convention").value,
    details: document.getElementById("details").value,
  };

  const url = editDepositId
    ? `${BACKEND_URL}/port/deposits/${editDepositId}/`
    : `${BACKEND_URL}/port/deposits/`;
  const method = editDepositId ? "PUT" : "POST";

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
      showToast("Depozit salvat.", "success");
      depositModal.hide();
      await loadDeposits();
    } else {
      const err = await res.json();
      showToast(err.detail || "Eroare la salvare.", "error");
    }
  } catch (err) {
    showToast("Eroare rețea.", "error");
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

  document.getElementById("prevPageBtn").addEventListener("click", () => loadDeposits(prevPage));
  document.getElementById("nextPageBtn").addEventListener("click", () => loadDeposits(nextPage));
}
