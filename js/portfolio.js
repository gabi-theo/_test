import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let portfolioModal;
let editPortfolioId = null;
let nextPortfolioPage = null;
let prevPortfolioPage = null;

export async function init() {
  portfolioModal = new bootstrap.Modal(document.getElementById("portfolioModal"));
  document.getElementById("addPortfolioBtn").addEventListener("click", () => openPortfolioForm());
  document.getElementById("portfolioForm").addEventListener("submit", handlePortfolioSubmit);
  document.addEventListener("click", handlePortfolioTableClick);
  await Promise.all([loadUbos(), loadInstruments()]);
  await loadPortfolios();
}

async function loadUbos() {
  const select = document.getElementById("ubo");
  select.innerHTML = `<option value=''>-- Selectează --</option>`;
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BACKEND_URL}/port/ubos/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  (data.results || data).forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.ubo_code;
    select.appendChild(opt);
  });
}

async function loadInstruments() {
  const select = document.getElementById("instrument");
  select.innerHTML = `<option value=''>-- Selectează --</option>`;
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BACKEND_URL}/port/instruments/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  (data.results || data).forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.symbol;
    select.appendChild(opt);
  });
}

async function loadPortfolios(url = `${BACKEND_URL}/port/portfolios/`) {
  const tbody = document.getElementById("portfoliosTableBody");
  tbody.innerHTML = `<tr><td colspan="8" class="text-center">Se încarcă...</td></tr>`;
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    nextPortfolioPage = data.next;
    prevPortfolioPage = data.previous;
    renderPortfolioPagination();

    tbody.innerHTML = "";
    (data.results || data).forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.ubo_code}</td>
        <td>${item.instrument_name}</td>
        <td>${item.date}</td>
        <td>${item.cost}</td>
        <td>${item.value}</td>
        <td>${item.quantity}</td>
        <td>${item.accruedint}</td>
        <td class="text-end">
          <button class="btn btn-warning btn-sm edit-portfolio-btn" data-id="${item.id}">Editează</button>
          <button class="btn btn-danger btn-sm delete-portfolio-btn" data-id="${item.id}">Șterge</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="8" class="text-danger">Eroare la încărcare.</td></tr>`;
  }
}

function renderPortfolioPagination() {
  const container = document.getElementById("portfolioPagination");
  container.innerHTML = `
    <button class="btn btn-outline-primary" ${!prevPortfolioPage ? "disabled" : ""} onclick="loadPortfolios('${prevPortfolioPage}')">Anterior</button>
    <button class="btn btn-outline-primary" ${!nextPortfolioPage ? "disabled" : ""} onclick="loadPortfolios('${nextPortfolioPage}')">Următor</button>
  `;
}

function openPortfolioForm(data = null) {
  const form = document.getElementById("portfolioForm");
  form.reset();

  if (data) {
    document.getElementById("ubo").value = data.ubo;
    document.getElementById("instrument").value = data.instrument;
    document.getElementById("date").value = data.date;
    document.getElementById("cost").value = data.cost;
    document.getElementById("value").value = data.value;
    document.getElementById("quantity").value = data.quantity;
    document.getElementById("accruedint").value = data.accruedint;
    editPortfolioId = data.id;
  } else {
    editPortfolioId = null;
  }

  portfolioModal.show();
}

async function handlePortfolioSubmit(event) {
  event.preventDefault();
  const token = localStorage.getItem("accessToken");
  const payload = {
    ubo: document.getElementById("ubo").value,
    instrument: document.getElementById("instrument").value,
    date: document.getElementById("date").value,
    cost: parseFloat(document.getElementById("cost").value),
    value: parseFloat(document.getElementById("value").value),
    quantity: parseFloat(document.getElementById("quantity").value),
    accruedint: parseFloat(document.getElementById("accruedint").value || 0),
  };

  const method = editPortfolioId ? "PUT" : "POST";
  const url = editPortfolioId
    ? `${BACKEND_URL}/port/portfolios/${editPortfolioId}/`
    : `${BACKEND_URL}/port/portfolios/`;

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
      portfolioModal.hide();
      await loadPortfolios();
    } else {
      const err = await res.json();
      showToast(err.detail || "Eroare la salvare.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Eroare rețea.", "error");
  }
}

async function handlePortfolioTableClick(e) {
  const editBtn = e.target.closest(".edit-portfolio-btn");
  const deleteBtn = e.target.closest(".delete-portfolio-btn");

  if (editBtn) {
    const id = editBtn.dataset.id;
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BACKEND_URL}/port/portfolios/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    openPortfolioForm(data);
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    if (!confirm("Ești sigur că vrei să ștergi acest portofoliu?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${BACKEND_URL}/port/portfolios/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Șters cu succes.", "success");
        await loadPortfolios();
      } else {
        showToast("Eroare la ștergere.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare rețea la ștergere.", "error");
    }
  }
}
