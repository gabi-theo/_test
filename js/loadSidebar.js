export async function loadSidebar(containerId) {
    try {
      const response = await fetch("components/sidebar.html");
      const html = await response.text();
      document.getElementById(containerId).innerHTML = html;
    } catch (error) {
      console.error("Failed to load sidebar:", error);
    }
  }
