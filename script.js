/* Little Muslim Learners
   ATM Digital Solutions & Services
   Phone: 08133515448 | Email: atmdigitalservice@gmail.com */

"use strict";

/* ---------- LANGUAGE ---------- */

const LANGS = ["en", "ha", "ar"];
let lang = "en";
try { const s = localStorage.getItem("lml_lang"); if (LANGS.includes(s)) lang = s; } catch (e) {}

const li = () => LANGS.indexOf(lang);
const tx = v => (Array.isArray(v) ? v[li()] : v);
const ui = k => tx(UI[k]);
const $ = id => document.getElementById(id);

/* ---------- STARS (saved on the device) ---------- */

let stars = 0;
try { stars = parseInt(localStorage.getItem("lml_stars") || "0", 10) || 0; } catch (e) {}
function addStars(n) {
  stars += n;
  $("starCount").textContent = stars;
  try { localStorage.setItem("lml_stars", String(stars)); } catch (e) {}
}

/* ---------- HELPERS ---------- */

function speak(text, voiceLang) {
  if (!("speechSynthesis" in window)) {
    alert("Audio is not supported by this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = voiceLang || "ar-SA";
  u.rate = 0.65;
  u.pitch = 1;

  u.onerror = function(event) {
    console.log("Speech error:", event.error);
  };

  window.speechSynthesis.speak(u);
}

/* ---------- ARABIC LETTERS ---------- */

let seen = new Set();
try { seen = new Set(JSON.parse(localStorage.getItem("lml_seen") || "[]")); } catch (e) {}
const letterState = { sel: 0 };

function markSeen(k) {
  if (seen.has(k)) return;
  seen.add(k);
  addStars(1);
  try { localStorage.setItem("lml_seen", JSON.stringify([...seen])); } catch (e) {}
}


function renderLetters() {
  const box = $("letters");

  // Remember the current page position
  const scrollPosition = window.scrollY;

  const L = LETTERS[letterState.sel];

  markSeen(letterState.sel);

  const meaning = lang === "ha" ? L[7] : L[6];

  box.innerHTML = `
    <div class="card">
      <h2>🔤 ${ui("letters_h")}</h2>
      <p>${ui("letters_p")}</p>
    </div>

    <div class="card letter-detail">
      <div class="big-letter">${L[0]}</div>

      <div class="letter-name">
        <span class="ar-inline">${L[1]}</span>
        ${lang !== "ar" ? " · " + L[2] : ""}
      </div>

      <div class="emoji">${L[4]}</div>

      <div class="arabic">${L[3]}</div>

      ${lang !== "ar"
        ? `<div class="translit">${L[5]} = ${meaning}</div>`
        : ""}

      <div class="btn-row">
        <button class="btn alt" id="lsName">
          🔊 ${ui("letter_sound")}
        </button>

        <button class="btn alt" id="lsWord">
          🔊 ${ui("word_sound")}
        </button>
      </div>
    </div>

    <div class="letter-grid">
      ${LETTERS.map((l, k) =>
        `<button
          class="letter-tile ${k === letterState.sel ? "sel" : ""} ${seen.has(k) ? "seen" : ""}"
          data-k="${k}"
          aria-label="${l[2]}">
          ${l[0]}
        </button>`
      ).join("")}
    </div>

    <div class="card">
      <h2>${ui("harakat_h")}</h2>
      <p>${ui("harakat_p")}</p>

      <div class="harakat">
  <div>
    <span>بَ</span>
    ${ui("fatha")}<br>ba
    <button class="btn alt" id="soundFatha">🔊</button>
  </div>

  <div>
    <span>بِ</span>
    ${ui("kasra")}<br>bi
    <button class="btn alt" id="soundKasra">🔊</button>
  </div>

  <div>
    <span>بُ</span>
    ${ui("damma")}<br>bu
    <button class="btn alt" id="soundDamma">🔊</button>
  </div>

  <div>
    <span>بْ</span>
    ${ui("sukun")}<br>b
    <button class="btn alt" id="soundSukun">🔊</button>
  </div>
</div>
  `;

  // Pronounce the selected letter name
  $("lsName").onclick = () => speak(L[1], "ar-SA");
   // Pronounce the example Arabic word
$("lsWord").onclick = () => speak(L[3], "ar-SA");

  // Pronounce the example Arabic word
  // Harakat pronunciation
$("soundFatha").onclick = () => speak("بَ", "ar-SA");
$("soundKasra").onclick = () => speak("بِ", "ar-SA");
$("soundDamma").onclick = () => speak("بُ", "ar-SA");
$("soundSukun").onclick = () => speak("بْ", "ar-SA");

  // Select letters without jumping to the top
  box.querySelectorAll(".letter-tile").forEach(b => {
    b.onclick = () => {
      letterState.sel = parseInt(b.dataset.k, 10);

      const selectedLetter = LETTERS[letterState.sel];

      renderLetters();

      // Restore the previous page position
      window.scrollTo(0, scrollPosition);

      // Automatically pronounce the selected letter
      speak(selectedLetter[1], "ar-SA");
    };
  });
}


/* ---------- STEP-BY-STEP LESSON (Wudu and Salah) ---------- */

function renderLesson(box, steps, st, key, headerHtml) {
  box.innerHTML = headerHtml + '<div class="card" id="' + key + 'Card"></div>';
  const card = $(key + "Card");

  function draw() {
    if (st.finished) {
      card.innerHTML = `<div class="emoji">🎉</div><h2 style="text-align:center">${ui("done_h")}</h2>
        <p style="text-align:center">${ui("done_p")}</p>
        <div class="btn-row"><button class="btn" id="${key}Again">${ui("learn_again")}</button></div>`;
      $(key + "Again").onclick = () => { st.finished = false; st.i = 0; draw(); };
      return;
    }
    const s = steps[st.i];
    const last = st.i === steps.length - 1;
    card.innerHTML = `
      <div class="step-count">${ui("step")} ${st.i + 1} ${ui("of")} ${steps.length}</div>
      <div class="progress"><div style="width:${((st.i + 1) / steps.length) * 100}%"></div></div>
      <div class="emoji">${s.emoji}</div>
      <h2>${tx(s.title)}</h2>
      <p>${tx(s.text)}</p>
      ${s.arabic ? `<div class="arabic">${s.arabic}</div>` : ""}
      ${s.translit && lang !== "ar" ? `<div class="translit">${s.translit}</div>` : ""}
      ${s.meaning ? `<div class="meaning">${tx(s.meaning)}</div>` : ""}
      <div class="btn-row">
        ${s.arabic ? `<button class="btn alt" id="${key}Say">${ui("listen")}</button>` : ""}
        <button class="btn" id="${key}Prev" ${st.i === 0 ? "disabled" : ""}>${ui("back")}</button>
        <button class="btn red" id="${key}Next">${last ? ui("finish") : ui("next")}</button>
      </div>`;
    const say = $(key + "Say");
    if (say) say.onclick = () => speak(s.arabic);
    $(key + "Prev").onclick = () => { st.i--; draw(); };
    $(key + "Next").onclick = () => {
      if (!st.rewarded.has(st.i)) { st.rewarded.add(st.i); addStars(1); }
      if (last) { addStars(5); st.finished = true; } else { st.i++; }
      draw();
    };
  }
  draw();
}

const wuduState = { i: 0, rewarded: new Set(), finished: false };
const salahState = { i: 0, rewarded: new Set(), finished: false };

function renderWudu() {
  renderLesson($("wudu"), WUDU_STEPS, wuduState, "wudu",
    `<div class="card"><h2>💧 ${ui("wudu_h")}</h2><p>${ui("wudu_p")}</p></div>`);
}

function renderSalah() {
  const grid = SALAH_COUNTS.map(p => `<div>${tx(p.name)}<b>${p.rakah}</b>${ui("rakahs")}</div>`).join("");
  renderLesson($("salah"), SALAH_STEPS, salahState, "salah",
    `<div class="card"><h2>🕌 ${ui("salah_h")}</h2><p>${ui("salah_p")}</p></div><div class="rakah-grid">${grid}</div>`);
}

/* ---------- AZKAR ---------- */

const azkarCounts = AZKAR.map(() => 0);

function renderAzkar() {
  const box = $("azkar");
  box.innerHTML = `<div class="card"><h2>📿 ${ui("azkar_h")}</h2><p>${ui("azkar_p")}</p></div>` +
    AZKAR.map((z, idx) => `
      <div class="card">
        <h2>${tx(z.title)}</h2>
        <div class="arabic">${z.arabic}</div>
        ${lang !== "ar" ? `<div class="translit">${z.translit}</div>` : ""}
        <div class="meaning">${tx(z.meaning)}</div>
        <div class="counter"><span id="c${idx}">${azkarCounts[idx] >= z.count ? azkarCounts[idx] + " ✅" : azkarCounts[idx]}</span> / ${z.count}</div>
        <button class="tap" id="t${idx}">${ui("tap")}</button>
        <div class="btn-row">
          <button class="btn alt" id="s${idx}">${ui("listen")}</button>
          <button class="btn" id="r${idx}">${ui("reset")}</button>
        </div>
      </div>`).join("");

  AZKAR.forEach((z, idx) => {
    const cnt = $("c" + idx);
    $("t" + idx).onclick = () => {
      if (azkarCounts[idx] >= z.count) return;
      azkarCounts[idx]++;
      cnt.textContent = azkarCounts[idx];
      if (azkarCounts[idx] === z.count) { addStars(2); cnt.textContent = azkarCounts[idx] + " ✅"; }
    };
    $("r" + idx).onclick = () => { azkarCounts[idx] = 0; cnt.textContent = 0; };
    $("s" + idx).onclick = () => speak(z.arabic);
  });
}

/* ---------- QUIZ ---------- */

const quiz = { order: [], qi: 0, score: 0, answered: false, token: 0 };

function quizStart() {
  quiz.order = QUIZ.map((_, k) => k).sort(() => Math.random() - 0.5).slice(0, 5);
  quiz.qi = 0; quiz.score = 0; quiz.answered = false;
  renderQuiz();
}

function renderQuiz() {
  const box = $("quiz");
  quiz.token++;
  const myToken = quiz.token;
  if (quiz.answered) { quiz.qi++; quiz.answered = false; }

  if (quiz.qi >= quiz.order.length) {
    const reward = quiz.score * 2;
    if (!quiz.rewardGiven) { addStars(reward); quiz.rewardGiven = true; }
    box.innerHTML = `<div class="card"><div class="emoji">🏆</div>
      <h2 style="text-align:center">${ui("quiz_score").replace("{n}", quiz.score).replace("{t}", quiz.order.length)}</h2>
      <p style="text-align:center">${quiz.score >= 4 ? ui("quiz_great") : ui("quiz_try")}</p>
      <p style="text-align:center">${ui("earned").replace("{n}", reward)}</p>
      <div class="btn-row"><button class="btn" id="qAgain">${ui("play_again")}</button></div></div>`;
    $("qAgain").onclick = () => { quiz.rewardGiven = false; quizStart(); };
    return;
  }

  const q = QUIZ[quiz.order[quiz.qi]];
  box.innerHTML = `<div class="card">
    <div class="step-count">${ui("quiz_q")} ${quiz.qi + 1} ${ui("of")} ${quiz.order.length}</div>
    <h2>${tx(q.q)}</h2>
    <div class="options">${q.o.map((o, k) => `<button class="option" dir="auto" data-k="${k}">${tx(o)}</button>`).join("")}</div>
    <div class="result" id="res"></div></div>`;
  const buttons = box.querySelectorAll(".option");
  buttons.forEach(b => b.onclick = () => {
    const k = parseInt(b.dataset.k, 10);
    buttons.forEach(x => x.disabled = true);
    quiz.answered = true;
    if (k === q.a) {
      b.classList.add("correct"); quiz.score++;
      $("res").textContent = ui("quiz_ok");
    } else {
      b.classList.add("wrong"); buttons[q.a].classList.add("correct");
      $("res").textContent = ui("quiz_no");
    }
    setTimeout(() => { if (quiz.token === myToken) renderQuiz(); }, 1700);
  });
}

/* ---------- STATIC TEXT, LANGUAGE SWITCH, TABS ---------- */

function applyStatic() {
  document.querySelectorAll("[data-i18n]").forEach(e => { e.textContent = ui(e.dataset.i18n); });
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll(".lang").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  $("starCount").textContent = stars;
}

function renderAll() {
  applyStatic();
  renderLetters();
  renderWudu();
  renderSalah();
  renderAzkar();
  renderQuiz();
}

document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    lang = btn.dataset.lang;
    try { localStorage.setItem("lml_lang", lang); } catch (e) {}
    renderAll();
  });
});

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

quizStart();
renderAll();
// REGISTER SERVICE WORKER FOR OFFLINE SUPPORT
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => console.log("App offline support activated"))
      .catch(error => console.error("Service worker error:", error));
  });
}
