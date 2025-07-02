import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let nextBondPage = null;
let prevBondPage = null;
window.loadBondAccruals = loadBondAccruals;

export async function init() {
  document.addEventListener("click", handleBondTableClick);
  await loadBondAccruals();
}

async function loadBondAccruals(url = `${BACKEND_URL}/port/bond-accruals/`) {
  const tbody = document.getElementById("bondAccrualsTableBody");
  tbody.innerHTML = `<tr><td colspan="28" class="text-center">Se încarcă...</td></tr>`;

  const params = new URLSearchParams();
  const search = document.getElementById("bondSearchInput").value;
  if (search) params.append("search", search);
  if (!url.includes("page=")) {
    url = `${url.split('?')[0]}?${params.toString()}`;
  }

  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    nextBondPage = data.next;
    prevBondPage = data.previous;
    renderBondPagination();

    tbody.innerHTML = "";
    (data.results || data).forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.ubo}</td>
        <td>${item.custodian}</td>
        <td>${item.partner}</td>
        <td>${item.account}</td>
        <td>${item.instrument}</td>
        <td>${item.currency}</td>
        <td>${item.date}</td>
        <td>${item.operation}</td>
        <td>${item.details || ""}</td>
        <td>${item.priority}</td>
        <td>${item.quantity}</td>
        <td>${item.quantity_total}</td>
        <td>${item.value}</td>
        <td>${item.accruals_total}</td>
        <td>${item.accrual}</td>
        <td>${item.accrual_valuta}</td>
        <td>${item.accrual_ron}</td>
        <td>${item.total_accrual_valuta}</td>
        <td>${item.total_accrual_ron}</td>
        <td>${item.revalue_total}</td>
        <td>${item.total_fx_diff}</td>
        <td>${item.fx_diff}</td>
        <td>${item.bnr ?? ""}</td>
        <td>${item.bnr_eom ?? ""}</td>
        <td>${item.coupon_settled}</td>
        <td>${item.accrual_settled}</td>
        <td>${item.accrual_incremental}</td>
        <td class="text-end">
          <button class="btn btn-danger btn-sm delete-bond-btn" data-id="${item.id}">Șterge</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="28" class="text-danger">Eroare la încărcare.</td></tr>`;
  }
}

function renderBondPagination() {
  const container = document.getElementById("bondPagination");
  container.innerHTML = `
    <button class="btn btn-outline-primary" ${!prevBondPage ? "disabled" : ""} onclick="loadBondAccruals('${prevBondPage}')">Anterior</button>
    <button class="btn btn-outline-primary" ${!nextBondPage ? "disabled" : ""} onclick="loadBondAccruals('${nextBondPage}')">Următor</button>
  `;
}

async function handleBondTableClick(e) {
  const deleteBtn = e.target.closest(".delete-bond-btn");
  const generateBtn = e.target.closest("#generateBondAccrualsBtn");

  if (generateBtn) {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${BACKEND_URL}/port/bond-accruals/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Accruals generate cu succes. ${data.message}`, "success");
        if (data.errors && data.errors.length) {
          console.warn("Erori:", data.errors);
          showToast(`Au fost detectate ${data.errors.length} erori. Vezi consola.`, "warning");
        }
        await loadBondAccruals();
      } else {
        showToast(`Eroare la generare: ${data.message || res.statusText}`, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare rețea la generare.", "error");
    }
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    if (!confirm("Ești sigur că vrei să ștergi această înregistrare?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${BACKEND_URL}/port/bond-accruals/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Șters cu succes.", "success");
        await loadBondAccruals();
      } else {
        showToast("Eroare la ștergere.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare rețea la ștergere.", "error");
    }
  }

  if (e.target.id === "bondSearchBtn") {
    await loadBondAccruals();
  }

  if (e.target.id === "exportBondCsvBtn") {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BACKEND_URL}/port/bond-accruals/?format=csv`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bond_accruals.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
