
/* ATM Little Muslim Learners
   ATM Digital Solutions & Services
   Phone: 08133515448 | Email: atmdigitalservice@gmail.com */

"use strict";

/* ---------- LANGUAGE ---------- */

const LANGS = ["en", "ha", "ar"];
let lang = "en";

try {
  const savedLanguage = localStorage.getItem("lml_lang");
  if (LANGS.includes(savedLanguage)) lang = savedLanguage;
} catch (e) {}

const li = () => LANGS.indexOf(lang);
const tx = value => Array.isArray(value) ? value[li()] : value;
const ui = key => tx(UI[key]);
const $ = id => document.getElementById(id);

/* ---------- SETTINGS: THEME AND TEXT SIZE ---------- */

function applySettings() {
  let theme = "light";
  let textSize = "medium";

  try {
    theme = localStorage.getItem("lml_theme") || "light";
    textSize = localStorage.getItem("lml_text_size") || "medium";
  } catch (e) {}

  if (!["light", "dark"].includes(theme)) theme = "light";
  if (!["small", "medium", "large"].includes(textSize)) {
    textSize = "medium";
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.textSize = textSize;
}

function saveTheme(theme) {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem("lml_theme", theme);
  } catch (e) {}
}

function saveTextSize(size) {
  document.documentElement.dataset.textSize = size;

  try {
    localStorage.setItem("lml_text_size", size);
  } catch (e) {}
}

if ($("themeLight")) {
  $("themeLight").addEventListener("click", () => saveTheme("light"));
}

if ($("themeDark")) {
  $("themeDark").addEventListener("click", () => saveTheme("dark"));
}

if ($("textSmall")) {
  $("textSmall").addEventListener("click", () => saveTextSize("small"));
}

if ($("textMedium")) {
  $("textMedium").addEventListener("click", () => saveTextSize("medium"));
}

if ($("textLarge")) {
  $("textLarge").addEventListener("click", () => saveTextSize("large"));
}

applySettings();

/* ---------- STARS ---------- */

let stars = 0;

try {
  stars = parseInt(localStorage.getItem("lml_stars") || "0", 10) || 0;
} catch (e) {}

function updateStarDisplays() {
  if ($("starCount")) $("starCount").textContent = stars;
  if ($("homeStarCount")) $("homeStarCount").textContent = stars;
}

function addStars(number) {
  stars += number;
  updateStarDisplays();

  try {
    localStorage.setItem("lml_stars", String(stars));
  } catch (e) {}
}

/* ---------- NAVIGATION ---------- */

function openTab(tabId) {
  const panel = $(tabId);

  if (!panel || !panel.classList.contains("panel")) return;

  document.querySelectorAll(".tab").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  document.querySelectorAll(".panel").forEach(section => {
    section.classList.toggle("active", section.id === tabId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    openTab(button.dataset.tab);
  });
});

document.querySelectorAll("[data-open-tab]").forEach(button => {
  button.addEventListener("click", () => {
    openTab(button.dataset.openTab);
  });
});

/* ---------- AUDIO HELPER ---------- */

function speak(text, voiceLang) {
  if (!("speechSynthesis" in window)) {
    alert("Audio is not supported by this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(String(text));
  utterance.lang = voiceLang || "ar-SA";
  utterance.rate = 0.65;
  utterance.pitch = 1;

  utterance.onerror = event => {
    console.log("Speech error:", event.error);
  };

  window.speechSynthesis.speak(utterance);
}

/* ---------- ARABIC LETTERS ---------- */

let seen = new Set();

try {
  seen = new Set(JSON.parse(localStorage.getItem("lml_seen") || "[]"));
} catch (e) {}

const letterState = { sel: 0 };

function markSeen(key) {
  if (seen.has(key)) return;

  seen.add(key);
  addStars(1);

  try {
    localStorage.setItem("lml_seen", JSON.stringify([...seen]));
  } catch (e) {}
}

function renderLetters() {
  const box = $("letters");
  if (!box) return;

  const scrollPosition = window.scrollY;
  const letter = LETTERS[letterState.sel];

  markSeen(letterState.sel);

  const meaning = lang === "ha" ? letter[7] : letter[6];

  box.innerHTML = `
    <div class="card">
      <h2>🔤 ${ui("letters_h")}</h2>
      <p>${ui("letters_p")}</p>
    </div>

    <div class="card letter-detail">
      <div class="big-letter">${letter[0]}</div>

      <div class="letter-name">
        <span class="ar-inline">${letter[1]}</span>
        ${lang !== "ar" ? " · " + letter[2] : ""}
      </div>

      <div class="emoji">${letter[4]}</div>

      <div class="arabic">${letter[3]}</div>

      ${lang !== "ar"
        ? `<div class="translit">${letter[5]} = ${meaning}</div>`
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
      ${LETTERS.map((item, index) => `
        <button
          class="letter-tile ${index === letterState.sel ? "sel" : ""} ${seen.has(index) ? "seen" : ""}"
          data-k="${index}"
          aria-label="${item[2]}">
          ${item[0]}
        </button>
      `).join("")}
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
    </div>
  `;

  $("lsName").onclick = () => speak(letter[1], "ar-SA");
  $("lsWord").onclick = () => speak(letter[3], "ar-SA");

  $("soundFatha").onclick = () => speak("بَ", "ar-SA");
  $("soundKasra").onclick = () => speak("بِ", "ar-SA");
  $("soundDamma").onclick = () => speak("بُ", "ar-SA");
  $("soundSukun").onclick = () => speak("بْ", "ar-SA");

  box.querySelectorAll(".letter-tile").forEach(button => {
    button.onclick = () => {
      letterState.sel = parseInt(button.dataset.k, 10);

      const selectedLetter = LETTERS[letterState.sel];

      renderLetters();
      window.scrollTo(0, scrollPosition);

      speak(selectedLetter[1], "ar-SA");
    };
  });
}

/* ---------- WUDU AND SALAH LESSONS ---------- */

function renderLesson(box, steps, state, key, headerHtml) {
  box.innerHTML = headerHtml + `<div class="card" id="${key}Card"></div>`;

  const card = $(key + "Card");

  function draw() {
    if (state.finished) {
      card.innerHTML = `
        <div class="emoji">🎉</div>
        <h2 style="text-align:center">${ui("done_h")}</h2>
        <p style="text-align:center">${ui("done_p")}</p>
        <div class="btn-row">
          <button class="btn" id="${key}Again">${ui("learn_again")}</button>
        </div>
      `;

      $(key + "Again").onclick = () => {
        state.finished = false;
        state.i = 0;
        draw();
      };

      return;
    }

    const step = steps[state.i];
    const last = state.i === steps.length - 1;

    card.innerHTML = `
      <div class="step-count">
        ${ui("step")} ${state.i + 1} ${ui("of")} ${steps.length}
      </div>

      <div class="progress">
        <div style="width:${((state.i + 1) / steps.length) * 100}%"></div>
      </div>

      <div class="emoji">${step.emoji}</div>
      <h2>${tx(step.title)}</h2>
      <p>${tx(step.text)}</p>

      ${step.arabic ? `<div class="arabic">${step.arabic}</div>` : ""}
      ${step.translit && lang !== "ar"
        ? `<div class="translit">${step.translit}</div>` : ""}
      ${step.meaning
        ? `<div class="meaning">${tx(step.meaning)}</div>` : ""}

      <div class="btn-row">
        ${step.arabic
          ? `<button class="btn alt" id="${key}Say">${ui("listen")}</button>`
          : ""}

        <button class="btn" id="${key}Prev"
          ${state.i === 0 ? "disabled" : ""}>
          ${ui("back")}
        </button>

        <button class="btn red" id="${key}Next">
          ${last ? ui("finish") : ui("next")}
        </button>
      </div>
    `;

    const sayButton = $(key + "Say");

    if (sayButton) {
      sayButton.onclick = () => speak(step.arabic);
    }

    $(key + "Prev").onclick = () => {
      if (state.i > 0) {
        state.i--;
        draw();
      }
    };

    $(key + "Next").onclick = () => {
      if (!state.rewarded.has(state.i)) {
        state.rewarded.add(state.i);
        addStars(1);
      }

      if (last) {
        addStars(5);
        state.finished = true;
      } else {
        state.i++;
      }

      draw();
    };
  }

  draw();
}

const wuduState = {
  i: 0,
  rewarded: new Set(),
  finished: false
};

const salahState = {
  i: 0,
  rewarded: new Set(),
  finished: false
};

function renderWudu() {
  renderLesson(
    $("wudu"),
    WUDU_STEPS,
    wuduState,
    "wudu",
    `<div class="card">
      <h2>💧 ${ui("wudu_h")}</h2>
      <p>${ui("wudu_p")}</p>
    </div>`
  );
}

function renderSalah() {
  const grid = SALAH_COUNTS.map(prayer => `
    <div>
      ${tx(prayer.name)}
      <b>${prayer.rakah}</b>
      ${ui("rakahs")}
    </div>
  `).join("");

  renderLesson(
    $("salah"),
    SALAH_STEPS,
    salahState,
    "salah",
    `<div class="card">
      <h2>🕌 ${ui("salah_h")}</h2>
      <p>${ui("salah_p")}</p>
    </div>
    <div class="rakah-grid">${grid}</div>`
  );
}

/* ---------- AZKAR ---------- */

const azkarCounts = AZKAR.map(() => 0);

function renderAzkar() {
  const box = $("azkar");

  box.innerHTML = `
    <div class="card">
      <h2>📿 ${ui("azkar_h")}</h2>
      <p>${ui("azkar_p")}</p>
    </div>
  ` + AZKAR.map((item, index) => `
    <div class="card">
      <h2>${tx(item.title)}</h2>

      <div class="arabic">${item.arabic}</div>

      ${lang !== "ar"
        ? `<div class="translit">${item.translit}</div>`
        : ""}

      <div class="meaning">${tx(item.meaning)}</div>

      <div class="counter">
        <span id="c${index}">
          ${azkarCounts[index] >= item.count
            ? azkarCounts[index] + " ✅"
            : azkarCounts[index]}
        </span>
        / ${item.count}
      </div>

      <button class="tap" id="t${index}">${ui("tap")}</button>

      <div class="btn-row">
        <button class="btn alt" id="s${index}">${ui("listen")}</button>
        <button class="btn" id="r${index}">${ui("reset")}</button>
      </div>
    </div>
  `).join("");

  AZKAR.forEach((item, index) => {
    const counter = $("c" + index);

    $("t" + index).onclick = () => {
      if (azkarCounts[index] >= item.count) return;

      azkarCounts[index]++;
      counter.textContent = azkarCounts[index];

      if (azkarCounts[index] === item.count) {
        addStars(2);
        counter.textContent = azkarCounts[index] + " ✅";
      }
    };

    $("r" + index).onclick = () => {
      azkarCounts[index] = 0;
      counter.textContent = 0;
    };

    $("s" + index).onclick = () => speak(item.arabic);
  });
}

/* ---------- QUIZ ---------- */

const quiz = {
  order: [],
  qi: 0,
  score: 0,
  answered: false,
  token: 0,
  rewardGiven: false
};

function quizStart() {
  quiz.order = QUIZ
    .map((item, index) => index)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  quiz.qi = 0;
  quiz.score = 0;
  quiz.answered = false;
  quiz.rewardGiven = false;

  renderQuiz();
}

function renderQuiz() {
  const box = $("quiz");

  quiz.token++;
  const myToken = quiz.token;

  if (quiz.answered) {
    quiz.qi++;
    quiz.answered = false;
  }

  if (quiz.qi >= quiz.order.length) {
    const reward = quiz.score * 2;

    if (!quiz.rewardGiven) {
      addStars(reward);
      quiz.rewardGiven = true;
    }

    box.innerHTML = `
      <div class="card">
        <div class="emoji">🏆</div>

        <h2 style="text-align:center">
          ${ui("quiz_score")
            .replace("{n}", quiz.score)
            .replace("{t}", quiz.order.length)}
        </h2>

        <p style="text-align:center">
          ${quiz.score >= 4 ? ui("quiz_great") : ui("quiz_try")}
        </p>

        <p style="text-align:center">
          ${ui("earned").replace("{n}", reward)}
        </p>

        <div class="btn-row">
          <button class="btn" id="qAgain">
            ${ui("play_again")}
          </button>
        </div>
      </div>
    `;

    $("qAgain").onclick = quizStart;
    return;
  }

  const question = QUIZ[quiz.order[quiz.qi]];

  box.innerHTML = `
    <div class="card">
      <div class="step-count">
        ${ui("quiz_q")} ${quiz.qi + 1} ${ui("of")} ${quiz.order.length}
      </div>

      <h2>${tx(question.q)}</h2>

      <div class="options">
        ${question.o.map((option, index) => `
          <button class="option" dir="auto" data-k="${index}">
            ${tx(option)}
          </button>
        `).join("")}
      </div>

      <div class="result" id="res"></div>
    </div>
  `;

  const buttons = box.querySelectorAll(".option");

  buttons.forEach(button => {
    button.onclick = () => {
      if (quiz.answered) return;

      const selected = parseInt(button.dataset.k, 10);

      buttons.forEach(item => item.disabled = true);
      quiz.answered = true;

      if (selected === question.a) {
        button.classList.add("correct");
        quiz.score++;
        $("res").textContent = ui("quiz_ok");
      } else {
        button.classList.add("wrong");
        buttons[question.a].classList.add("correct");
        $("res").textContent = ui("quiz_no");
      }

      setTimeout(() => {
        if (quiz.token === myToken) renderQuiz();
      }, 1700);
    };
  });
}

/* ---------- STATIC TEXT AND LANGUAGE ---------- */

function applyStatic() {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = ui(element.dataset.i18n);
  });

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll(".lang").forEach(button => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  updateStarDisplays();
}

function renderAll() {
  applyStatic();
  renderLetters();
  renderWudu();
  renderSalah();
  renderAzkar();
  renderQuiz();
}

/* ---------- LANGUAGE BUTTONS ---------- */

document.querySelectorAll(".lang").forEach(button => {
  button.addEventListener("click", () => {
    lang = button.dataset.lang;

    try {
      localStorage.setItem("lml_lang", lang);
    } catch (e) {}

    renderAll();
  });
});

/* ---------- START APPLICATION ---------- */

renderAll();

/* Open the Home screen first */
openTab("home");

/* ---------- SERVICE WORKER / OFFLINE SUPPORT ---------- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => console.log("App offline support activated"))
      .catch(error => console.error("Service worker error:", error));
  });
     }
   
