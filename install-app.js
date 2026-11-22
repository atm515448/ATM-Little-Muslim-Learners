/* PWA installation helper */
"use strict";
(function () {
  const button = document.getElementById("installAppButton");
  if (!button) return;
  let installPrompt = null;
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  function setInstalledState() {
    if (isStandalone()) {
      button.textContent = "✓ APP INSTALLED";
      button.disabled = true;
      button.setAttribute("aria-label", "App is installed");
    }
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    button.textContent = "📲 INSTALL APP";
    button.disabled = false;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    button.textContent = "✓ APP INSTALLED";
    button.disabled = true;
  });

  button.addEventListener("click", async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      return;
    }
    if (isStandalone()) {
      button.textContent = "✓ APP INSTALLED";
      button.disabled = true;
      return;
    }
    alert("To install this app in Chrome:\\n\\n1. Open the browser menu (⋮).\\n2. Tap 'Install app' or 'Add to Home screen'.\\n3. Confirm the installation.\\n\\nIf the install option is not shown, update Chrome and open the app using its HTTPS website link.");
  });

  setInstalledState();
})();
