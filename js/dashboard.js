import { loadSidebar } from "./loadSidebar.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSidebar("sidebar-container"); // sidebar loads first
  setupRouting(); // attach click listeners to sidebar links
  setupLogout();
  setupGoToExtractApp();

  const initialView = window.location.hash.replace("#", "") || "journals";
  loadView(initialView); // load initial view
});

function setupRouting() {
  document.querySelectorAll("[data-view]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const view = link.getAttribute("data-view");
      window.location.hash = view; // triggers hashchange
    });
  });

  window.addEventListener("hashchange", () => {
    const view = window.location.hash.replace("#", "");
    loadView(view);
  });
}

async function loadView(viewName) {
  const contentArea = document.getElementById("contentArea");
  try {
    const response = await fetch(`views/${viewName}.html`);
    const html = await response.text();
    contentArea.innerHTML = html;

    // Optional: Load view-specific JS
    import(`./${viewName}.js`)
      .then(module => module.init?.())
      .catch(() => {}); // ignore if JS doesn't exist
  } catch (error) {
    contentArea.innerHTML = `<div class="alert alert-danger">Eroare la încărcarea paginii: ${viewName}</div>`;
  }
}


function setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        // Optional: clear tokens, cookies, localStorage here
        // localStorage.removeItem('token');
  
        window.location.href = "login.html"; // back to login
      });
    }
  }

function setupGoToExtractApp(){
  const nchExtractBtn = document.getElementById("nchExtractBtn");
    if (nchExtractBtn) {
      nchExtractBtn.addEventListener("click", () => {
        window.location.href = "http://10.100.180.3:8081";
      });
    }
}
