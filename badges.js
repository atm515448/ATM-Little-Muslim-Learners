/* Badges: unlocked from total stars and the daily checklist streak. Shown on the Home page. Saved on the device only. */
"use strict";
(function () {
  const BADGE_KEY = "lmlBadges";
  const CHECK_KEY = "lmlDailyChecklist";
  const BADGES = [
    { id: "star1", name: "First Star", ha: "Tauraro na farko", icon: "⭐", test: s => s.stars >= 1 },
    { id: "star10", name: "Star Collector", ha: "Mai tara taurari", icon: "🌟", test: s => s.stars >= 10 },
    { id: "star25", name: "Bright Star", ha: "Tauraro mai haske", icon: "✨", test: s => s.stars >= 25 },
    { id: "star50", name: "Shining Star", ha: "Tauraro mai haskakawa", icon: "💫", test: s => s.stars >= 50 },
    { id: "star100", name: "Champion", ha: "Zakara", icon: "🏆", test: s => s.stars >= 100 },
    { id: "streak3", name: "Consistent", ha: "Mai daidaituwa", icon: "🔥", test: s => s.streak >= 3 },
    { id: "streak7", name: "Week Warrior", ha: "Jarumin mako", icon: "🛡️", test: s => s.streak >= 7 }
  ];

  function readStars() {
    return parseInt(localStorage.getItem("lml_stars") || "0", 10) || 0;
  }

  function readEarned() {
    try { return JSON.parse(localStorage.getItem(BADGE_KEY) || "[]") || []; }
    catch (_) { return []; }
  }

  function saveEarned(list) {
    try { localStorage.setItem(BADGE_KEY, JSON.stringify(list)); } catch (_) {}
  }

  function dayString(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // Same rule as the daily checklist: a day counts when all four items are done.
  function checklistStreak() {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(CHECK_KEY) || "{}") || {}; } catch (_) {}
    const done = day => { const e = data[day] || {}; return ["salah", "ayat", "ist", "quran"].every(k => e[k] === true); };
    let day = new Date();
    if (!done(dayString(day))) day = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
    let count = 0;
    while (done(dayString(day))) {
      count++;
      day = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
    }
    return count;
  }

  const style = document.createElement("style");
  style.textContent = `
    .lml-badge-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
    .lml-badge { border: 1px solid currentColor; border-radius: 12px; padding: 12px; text-align: center; opacity: .45; }
    .lml-badge.earned { opacity: 1; background: rgba(242, 183, 5, 0.18); }
    .lml-badge .icon { font-size: 28px; display: block; }
    .lml-badge strong { display: block; font-size: 14px; margin-top: 4px; }
    .lml-badge small { display: block; font-size: 12px; opacity: .8; }
    .lml-badge-toast {
      position: fixed; left: 50%; bottom: max(20px, env(safe-area-inset-bottom, 0px)); transform: translateX(-50%);
      background: #14247a; color: #fff; padding: 12px 18px; border-radius: 12px; z-index: 10001;
      box-shadow: 0 8px 24px rgba(0,0,0,.3); font: 15px/1.4 system-ui, sans-serif; max-width: calc(100% - 32px); text-align: center;
    }
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "card";
  card.id = "lmlBadges";
  card.innerHTML = `<h2>🏅 Badges / Lambobin girmamawa</h2>
    <p id="lmlBadgeSummary"></p>
    <div class="lml-badge-grid" id="lmlBadgeGrid"></div>`;
  const home = document.getElementById("home");
  if (home) home.appendChild(card);

  function toast(text) {
    const el = document.createElement("div");
    el.className = "lml-badge-toast";
    el.setAttribute("role", "status");
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  function evaluate(announce) {
    const state = { stars: readStars(), streak: checklistStreak() };
    const earned = readEarned();
    const fresh = [];
    BADGES.forEach(b => {
      if (!earned.includes(b.id) && b.test(state)) {
        earned.push(b.id);
        fresh.push(b);
      }
    });
    if (fresh.length) saveEarned(earned);
    render(earned, state);
    if (announce && fresh.length) {
      toast("🏅 New badge: " + fresh.map(b => b.name).join(", "));
    }
  }

  function render(earned, state) {
    const grid = document.getElementById("lmlBadgeGrid");
    const summary = document.getElementById("lmlBadgeSummary");
    if (!grid) return;
    summary.textContent = earned.length + " of " + BADGES.length + " badges earned. You have " + state.stars + " stars.";
    grid.innerHTML = BADGES.map(b => `
      <div class="lml-badge ${earned.includes(b.id) ? "earned" : ""}">
        <span class="icon" aria-hidden="true">${b.icon}</span>
        <strong>${b.name}</strong>
        <small>${b.ha}</small>
      </div>`).join("");
  }

  // Hook into the star rewards the app already gives.
  const originalAddStars = window.addStars;
  if (typeof originalAddStars === "function") {
    window.addStars = function (number) {
      const result = originalAddStars.apply(this, arguments);
      evaluate(true);
      return result;
    };
  }

  // Check whenever the checklist changes, or the page becomes visible again.
  document.addEventListener("click", () => setTimeout(() => evaluate(true), 0));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) evaluate(true); });
  evaluate(false);
  window.lmlBadgesEvaluate = () => evaluate(true);
})();
