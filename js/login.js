import { BACKEND_URL } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        console.log("TRYING")
        console.log("Sending login request to:", `${BACKEND_URL}/auth/login/`);
        console.log("Payload:", { username, password });

        const response = await fetch(`${BACKEND_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          window.location.href = "dashboard.html";
        } else {
          const err = await response.json();
          alert(err.error || "Autentificare eșuată");
        }
      } catch (error) {
        alert("Eroare la conectare.");
        console.error(error);
      }
    });
  }
});
