/* Daily checklist: Salah, Ayatul Kursi, Istighfar and Quran reading. Shows on the Home page with a streak counter. Saved on the device only. */
"use strict";
(function () {
  const KEY = "lmlDailyChecklist";
  const ITEMS = [
    { id: "salah", en: "Salah prayed", ha: "An yi Salah" },
    { id: "ayat", en: "Ayatul Kursi read", ha: "An karanta Ayatul Kursi" },
    { id: "ist", en: "Istighfar said", ha: "An ce Istighfar" },
    { id: "quran", en: "Quran read", ha: "An karanta Alƙur'ani" }
  ];

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function previousDay(day) {
    const [y, m, d] = day.split("-").map(Number);
    const date = new Date(y, m - 1, d - 1);
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; }
    catch (_) { return {}; }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
  }

  // A day counts toward the streak when all four items are done.
  function dayComplete(data, day) {
    const entry = data[day] || {};
    return ITEMS.every(item => entry[item.id] === true);
  }

  function streak(data) {
    let count = 0;
    let day = today();
    // Today may not be finished yet, so a streak can still count from yesterday.
    if (!dayComplete(data, day)) day = previousDay(day);
    while (dayComplete(data, day)) {
      count++;
      day = previousDay(day);
    }
    return count;
  }

  const style = document.createElement("style");
  style.textContent = `
    .lml-check-card { display: grid; gap: 10px; }
    .lml-check-list { display: grid; gap: 8px; list-style: none; padding: 0; margin: 0; }
    .lml-check-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; border: 1px solid currentColor; min-height: 48px; cursor: pointer; background: transparent; color: inherit; font: inherit; text-align: left; width: 100%; }
    .lml-check-item[aria-pressed="true"] { background: rgba(38, 163, 96, 0.18); }
    .lml-check-box { width: 26px; height: 26px; border-radius: 7px; border: 2px solid currentColor; display: grid; place-items: center; flex: 0 0 auto; font-weight: 700; }
    .lml-check-item[aria-pressed="true"] .lml-check-box { background: #26a360; border-color: #26a360; color: #fff; }
    .lml-check-item small { display: block; opacity: .75; font-size: 13px; }
    .lml-check-summary { font-weight: 700; margin: 0; }
    .lml-check-streak { font-size: 15px; margin: 0; }
    .lml-check-item:focus-visible { outline: 3px solid #f2b705; outline-offset: 2px; }
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "card lml-check-card";
  card.id = "lmlDailyChecklist";
  card.innerHTML = `
    <h2>✅ Daily Checklist / Jerin ayyuka na yau</h2>
    <p class="lml-check-summary" id="lmlCheckSummary" aria-live="polite"></p>
    <p class="lml-check-streak" id="lmlCheckStreak"></p>
    <ul class="lml-check-list" id="lmlCheckList"></ul>`;

  const home = document.getElementById("home");
  if (home) {
    const after = home.querySelector(".card") || home.firstElementChild;
    if (after && after.parentNode === home) home.insertBefore(card, after.nextSibling);
    else home.appendChild(card);
  }

  const list = document.getElementById("lmlCheckList");
  const summary = document.getElementById("lmlCheckSummary");
  const streakEl = document.getElementById("lmlCheckStreak");

  function render() {
    const data = load();
    const day = today();
    const entry = data[day] || {};
    list.innerHTML = "";
    let done = 0;
    ITEMS.forEach(item => {
      const checked = entry[item.id] === true;
      if (checked) done++;
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lml-check-item";
      button.setAttribute("aria-pressed", String(checked));
      button.innerHTML = `<span class="lml-check-box" aria-hidden="true">${checked ? "✓" : ""}</span>
        <span>${item.en}<small>${item.ha}</small></span>`;
      button.addEventListener("click", () => {
        const latest = load();
        latest[day] = latest[day] || {};
        latest[day][item.id] = !(latest[day][item.id] === true);
        save(latest);
        render();
      });
      li.appendChild(button);
      list.appendChild(li);
    });
    summary.textContent = done === ITEMS.length
      ? "Masha Allah! All done today. / Masha Allah! An kammala yau."
      : done + " of " + ITEMS.length + " done today / " + done + " daga cikin " + ITEMS.length;
    const count = streak(data);
    streakEl.textContent = count > 0
      ? "🔥 " + count + " day" + (count === 1 ? "" : "s") + " in a row / kwanaki " + count + " a jere"
      : "Complete all four today to start a streak. / Ka kammala duka yau don fara jeri.";
  }

  render();
  window.lmlChecklistRender = render;
})();
