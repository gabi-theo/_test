import { BACKEND_URL } from "./constants.js";
import { showToast } from "./utils.js";

let errorModal;
let nextErrorPage = null;
let prevErrorPage = null;

export async function init() {
  errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  await loadErrors();
}

async function loadErrors(url = `${BACKEND_URL}/port/errors/`) {
  const tbody = document.getElementById("errorsTableBody");
  tbody.innerHTML = `<tr><td colspan="6" class="text-center">Se încarcă...</td></tr>`;

  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    nextErrorPage = data.next;
    prevErrorPage = data.previous;
    renderErrorPagination();

    tbody.innerHTML = "";
    (data.results || data).forEach(err => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(err.created_at).toLocaleString()}</td>
        <td>${err.logger_name}</td>
        <td>${err.level}</td>
        <td>${err.message.substring(0, 60)}...</td>
        <td>${err.viewed ? '✔️' : '❌'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-info" onclick='showErrorDetails(${JSON.stringify(err)})'>Detalii</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger">Eroare la încărcare.</td></tr>`;
  }
}

function renderErrorPagination() {
  const container = document.getElementById("errorPagination");
  container.innerHTML = `
    <button class="btn btn-outline-primary" id="prevErrors" ${!prevErrorPage ? "disabled" : ""}>Pagina anterioară</button>
    <button class="btn btn-outline-primary" id="nextErrors" ${!nextErrorPage ? "disabled" : ""}>Pagina următoare</button>
  `;
  document.getElementById("prevErrors").onclick = () => loadErrors(prevErrorPage);
  document.getElementById("nextErrors").onclick = () => loadErrors(nextErrorPage);
}

window.showErrorDetails = function (error) {
  document.getElementById("modalLogger").textContent = error.logger_name;
  document.getElementById("modalLevel").textContent = error.level;
  document.getElementById("modalDate").textContent = new Date(error.created_at).toLocaleString();
  document.getElementById("modalMessage").textContent = error.message;
  document.getElementById("modalTrace").textContent = error.trace || "";
  errorModal.show();
};