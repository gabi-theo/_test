export function showToast(message, type = "primary") {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("toastMessage");

  if (!toastEl || !toastBody) {
    console.warn("Toast element not found.");
    return;
  }

  toastEl.classList.remove("bg-primary", "bg-danger", "bg-success", "bg-warning");
  toastEl.classList.add(`bg-${type}`);
  toastBody.textContent = message;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}