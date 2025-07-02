import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let instrumentModal;
let editInstrumentId = null;
let nextPage = null;
let prevPage = null;

export async function init() {
  instrumentModal = new bootstrap.Modal(document.getElementById("instrumentModal"));
  document.getElementById("addInstrumentBtn").addEventListener("click", () => openInstrumentForm());
  document.getElementById("instrumentForm").addEventListener("submit", handleInstrumentSubmit);
  document.addEventListener("click", handleInstrumentTableClick);

  await loadInstruments();
  await Promise.all([loadCustodians(), loadCurrencies()]);
  document.getElementById("searchInput").addEventListener("input", () => loadInstruments());
  document.getElementById("filterCustodian").addEventListener("change", () => loadInstruments());
  document.getElementById("filterCurrency").addEventListener("change", () => loadInstruments());
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("filterCustodian").value = "";
    document.getElementById("filterCurrency").value = "";
    loadInstruments();
  });
}

async function loadInstruments(url = `${BACKEND_URL}/port/instruments/`) {
  const tableBody = document.getElementById("instrumentsTableBody");
  tableBody.innerHTML = `<tr><td colspan="20" class="text-center">Se încarcă...</td></tr>`;

  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const entries = data.results || data;

    const search = document.getElementById("searchInput").value.toLowerCase();
    const custodianFilter = document.getElementById("filterCustodian").value;
    const currencyFilter = document.getElementById("filterCurrency").value;

    const filtered = entries.filter(entry => {
      return (
        (!search || [
          entry.symbol, entry.isin, entry.name, entry.type, entry.sector, entry.country
        ].some(val => val?.toLowerCase().includes(search))) &&
        (!custodianFilter || entry.custodian == custodianFilter) &&
        (!currencyFilter || entry.currency == currencyFilter)
      );
    });

    tableBody.innerHTML = "";
    nextPage = data.next;
    prevPage = data.previous;
    renderPagination();

    filtered.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.symbol}</td>
        <td>${entry.isin}</td>
        <td>${entry.custodian_name}</td>
        <td>${entry.currency_name}</td>
        <td>${entry.name ?? ""}</td>
        <td>${entry.type ?? ""}</td>
        <td>${entry.principal ?? ""}</td>
        <td>${entry.face_value ?? ""}</td>
        <td>${entry.interest ?? ""}</td>
        <td>${entry.depo_start ?? ""}</td>
        <td>${entry.bond_issue ?? ""}</td>
        <td>${entry.bond_first_coupon ?? ""}</td>
        <td>${entry.maturity ?? ""}</td>
        <td>${entry.convention ?? ""}</td>
        <td>${entry.calendar ?? ""}</td>
        <td>${entry.bond_coupon_count ?? ""}</td>
        <td>${entry.sector ?? ""}</td>
        <td>${entry.country ?? ""}</td>
        <td>${entry.needs_to_be_checked ? "✔" : ""}</td>
        <td class="text-end">
          <button class="btn btn-warning btn-sm edit-instrument-btn" data-id="${entry.id}">Editează</button>
          <button class="btn btn-danger btn-sm delete-instrument-btn" data-id="${entry.id}">Șterge</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="20" class="text-center">Niciun rezultat.</td></tr>`;
    }
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="20" class="text-danger">Eroare la încărcarea datelor.</td></tr>`;
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

  document.getElementById("prevPageBtn").addEventListener("click", () => loadInstruments(prevPage));
  document.getElementById("nextPageBtn").addEventListener("click", () => loadInstruments(nextPage));
}

function openInstrumentForm(data = null) {
  const form = document.getElementById("instrumentForm");
  form.reset();

  if (data) {
    document.getElementById("symbol").value = data.symbol;
    document.getElementById("isin").value = data.isin;
    document.getElementById("custodian").value = data.custodian;
    document.getElementById("currency").value = data.currency;
    document.getElementById("name").value = data.name;
    document.getElementById("type").value = data.type;
    document.getElementById("sector").value = data.sector;
    document.getElementById("country").value = data.country;
    document.getElementById("principal").value = data.principal ?? '';
    document.getElementById("face_value").value = data.face_value ?? 1.0;
    document.getElementById("interest").value = data.interest ?? '';
    document.getElementById("depo_start").value = data.depo_start ?? '';
    document.getElementById("bond_issue").value = data.bond_issue ?? '';
    document.getElementById("bond_first_coupon").value = data.bond_first_coupon ?? '';
    document.getElementById("maturity").value = data.maturity ?? '';
    document.getElementById("convention").value = data.convention ?? '';
    document.getElementById("calendar").value = data.calendar ?? '';
    document.getElementById("bond_coupon_count").value = data.bond_coupon_count ?? '';
    document.getElementById("needs_to_be_checked").value = data.needs_to_be_checked ? 'true' : 'false';
    editInstrumentId = data.id;
  } else {
    editInstrumentId = null;
  }

  instrumentModal.show();
}

async function handleInstrumentSubmit(event) {
  event.preventDefault();
  const token = localStorage.getItem("accessToken");

  const payload = {
    symbol: document.getElementById("symbol").value,
    isin: document.getElementById("isin").value,
    custodian: document.getElementById("custodian").value,
    currency: document.getElementById("currency").value,
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    principal: document.getElementById("principal").value || null,
    face_value: document.getElementById("face_value").value || 1.0,
    interest: document.getElementById("interest").value || null,
    depo_start: document.getElementById("depo_start").value || null,
    bond_issue: document.getElementById("bond_issue").value || null,
    bond_first_coupon: document.getElementById("bond_first_coupon").value || null,
    maturity: document.getElementById("maturity").value || null,
    convention: document.getElementById("convention").value,
    calendar: document.getElementById("calendar").value,
    bond_coupon_count: document.getElementById("bond_coupon_count").value || null,
    sector: document.getElementById("sector").value,
    country: document.getElementById("country").value,
    needs_to_be_checked: document.getElementById("needs_to_be_checked").value === "true",
  };
  

  const method = editInstrumentId ? "PUT" : "POST";
  const url = editInstrumentId
    ? `${BACKEND_URL}/port/instruments/${editInstrumentId}/`
    : `${BACKEND_URL}/port/instruments/`;

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
      showToast("Instrument salvat cu succes.", "success");
      instrumentModal.hide();
      await loadInstruments();
    } else {
      const err = await res.json();
      showToast(err.detail || "Eroare la salvare instrument.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Eroare rețea.", "error");
  }
}

async function handleInstrumentTableClick(e) {
  const editBtn = e.target.closest(".edit-instrument-btn");
  const deleteBtn = e.target.closest(".delete-instrument-btn");

  if (editBtn) {
    const id = editBtn.dataset.id;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/instruments/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      openInstrumentForm(data);
    } catch (err) {
      showToast("Nu s-a putut încărca instrumentul.", "error");
    }
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    if (!confirm("Ești sigur că vrei să ștergi acest instrument?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/port/instruments/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast("Instrument șters cu succes.", "success");
        await loadInstruments();
      } else {
        showToast("Eroare la ștergere instrument.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare rețea la ștergere.", "error");
    }
  }
}


async function loadCustodians() {
  const select = document.getElementById("custodian");
  const token = localStorage.getItem("accessToken");
  const filter = document.getElementById("filterCustodian");
  [select, filter].forEach(el => el.innerHTML = "<option value=''>-- Selectează --</option>");

  try {
    const res = await fetch(`${BACKEND_URL}/port/custodians/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    (data.results || data).forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `${c.custodian_code}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Eroare la încărcarea custozilor", err);
  }
}

async function loadCurrencies() {
  const token = localStorage.getItem("accessToken");
  const select = document.getElementById("currency");
  const filter = document.getElementById("filterCurrency");
  [select, filter].forEach(el => el.innerHTML = "<option value=''>-- Selectează --</option>");

  let url = `${BACKEND_URL}/port/currencies/`;
  let allCurrencies = [];

  try {
    while (url) {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      allCurrencies = allCurrencies.concat(data.results || data);
      url = data.next;
    }

    allCurrencies.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `${c.currency_code}`;
      select.appendChild(option.cloneNode(true));
      filter.appendChild(option);
    });
  } catch (err) {
    console.error("Eroare la încărcarea monedelor", err);
  }
}

