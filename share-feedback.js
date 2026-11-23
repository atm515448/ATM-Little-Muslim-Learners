/* Share the app and send feedback. Added to the About section. */
"use strict";
(function () {
  const APP_URL = location.href.replace(/[^/]*$/, "");
  const SHARE_TEXT = "Little Muslim Learners: learn Wudu, Salah, Arabic letters, Quran and daily duas for children. ";
  const FEEDBACK_EMAIL = "atmdigitalservice@gmail.com";

  const style = document.createElement("style");
  style.textContent = `
    .lml-sf-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .lml-sf-note { position: fixed; left: 50%; bottom: max(20px, env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); background: #14247a; color: #fff; padding: 10px 16px; border-radius: 10px; z-index: 10001; font: 14px system-ui, sans-serif; }
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "card";
  card.id = "lmlShareFeedback";
  card.innerHTML = `
    <h2>📣 Share & Feedback / Raba & ra'ayi</h2>
    <p>Tell your family and friends about the app, or send us your ideas.</p>
    <div class="lml-sf-row">
      <button class="btn" id="lmlShareBtn" type="button">Share the app / Raba app</button>
      <a class="btn alt" id="lmlFeedbackBtn" href="mailto:${FEEDBACK_EMAIL}?subject=Little%20Muslim%20Learners%20feedback">Send feedback / Aika ra'ayi</a>
    </div>`;
  const about = document.getElementById("about");
  if (about) about.appendChild(card);

  function note(text) {
    const el = document.createElement("div");
    el.className = "lml-sf-note";
    el.setAttribute("role", "status");
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  document.getElementById("lmlShareBtn").addEventListener("click", async () => {
    const data = { title: "Little Muslim Learners", text: SHARE_TEXT, url: APP_URL };
    try {
      if (navigator.share) { await navigator.share(data); return; }
    } catch (_) { return; }
    try {
      await navigator.clipboard.writeText(SHARE_TEXT + APP_URL);
      note("Link copied. You can paste it anywhere. / An kwafa link.");
    } catch (_) {
      note("Copy this link: " + APP_URL);
    }
  });
})();
