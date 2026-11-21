
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

/* ---------- SETTINGS ---------- */

function getSavedSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
}

function updateSettingsControls() {
  const theme = document.documentElement.dataset.theme || "light";
  const textSize = document.documentElement.dataset.textSize || "medium";

  const controls = {
    themeLight: theme === "light",
    themeDark: theme === "dark",
    textSmall: textSize === "small",
    textMedium: textSize === "medium",
    textLarge: textSize === "large"
  };

  Object.entries(controls).forEach(([id, active]) => {
    const button = $(id);
    if (!button) return;

    button.classList.toggle("alt", !active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function applySettings() {
  let theme = getSavedSetting("lml_theme", "light");
  let textSize = getSavedSetting("lml_text_size", "medium");

  if (!["light", "dark"].includes(theme)) theme = "light";
  if (!["small", "medium", "large"].includes(textSize)) {
    textSize = "medium";
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.textSize = textSize;

  updateSettingsControls();
}

function saveTheme(theme) {
  if (!["light", "dark"].includes(theme)) return;

  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem("lml_theme", theme);
  } catch (e) {}

  updateSettingsControls();
}

function saveTextSize(size) {
  if (!["small", "medium", "large"].includes(size)) return;

  document.documentElement.dataset.textSize = size;

  try {
    localStorage.setItem("lml_text_size", size);
  } catch (e) {}

  updateSettingsControls();
}

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

function addHomeButton(panel) {
  if (!panel || panel.id === "home") return;

  if (panel.querySelector("[data-home-return]")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "card";
  wrapper.setAttribute("data-home-return", "true");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn alt";
  button.textContent = "← 🏠 Home";
  button.addEventListener("click", () => openTab("home"));

  wrapper.appendChild(button);
  panel.prepend(wrapper);
}

function openTab(tabId) {
  const panel = $(tabId);

  if (!panel || !panel.classList.contains("panel")) return;

  document.querySelectorAll(".panel").forEach(section => {
    section.classList.toggle("active", section.id === tabId);
  });

  document.querySelectorAll(".tab").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  addHomeButton(panel);

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


/* ---------- AUDIO + AYATUL KURSI PHRASE PLAYER ---------- */

let ayatulParts = [];
let ayatulIndex = 0;
let ayatulPlaying = false;
let ayatulPaused = false;
let ayatulTimer = null;
let ayatulToken = 0;

const AYATUL_KURSI_PHRASES = [
  "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
  "لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
  "لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
  "مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ",
  "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ",
  "وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ",
  "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ",
  "وَلَا يَئُودُهُ حِفْظُهُمَا",
  "وَهُوَ الْعَلِيُّ الْعَظِيمُ"
];

function stopAyatulKursi() {
  ayatulToken++;
  ayatulPlaying = false;
  ayatulPaused = false;

  if (ayatulTimer) {
    clearTimeout(ayatulTimer);
    ayatulTimer = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  updateAyatulStatus("Stopped");
}

function updateAyatulStatus(message) {
  const status = document.getElementById("ayatulStatus");
  if (!status) return;

  if (message === "Stopped") {
    status.textContent = "Stopped";
  } else if (message === "Completed") {
    status.textContent = "Completed — 9 of 9 phrases";
  } else {
    status.textContent =
      message + " — Phrase " + (ayatulIndex + 1) +
      " of " + ayatulParts.length;
  }
}

function speakAyatulPhrase() {
  if (!("speechSynthesis" in window)) {
    alert("Speech is not supported by this browser.");
    return;
  }

  if (ayatulIndex >= ayatulParts.length) {
    ayatulPlaying = false;
    ayatulPaused = false;
    updateAyatulStatus("Completed");
    return;
  }

  const token = ayatulToken;
  const text = ayatulParts[ayatulIndex];

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.50;
  utterance.pitch = 1;

  updateAyatulStatus("Playing");

  utterance.onend = function () {
    if (token !== ayatulToken || !ayatulPlaying) return;

    ayatulTimer = setTimeout(function () {
      if (token !== ayatulToken || !ayatulPlaying) return;

      ayatulIndex++;

      if (ayatulIndex < ayatulParts.length) {
        speakAyatulPhrase();
      } else {
        ayatulPlaying = false;
        ayatulPaused = false;
        updateAyatulStatus("Completed");
      }
    }, 1000);
  };

  utterance.onerror = function (event) {
    if (token !== ayatulToken) return;

    ayatulPlaying = false;
    ayatulPaused = false;
    updateAyatulStatus("Audio error");

    console.log("Ayatul Kursi speech error:", event.error);
  };

  window.speechSynthesis.speak(utterance);
}

function playAyatulKursi() {
  if (!("speechSynthesis" in window)) {
    alert("Audio is not supported by this browser.");
    return;
  }

  if (ayatulPaused) {
    window.speechSynthesis.resume();
    ayatulPaused = false;
    ayatulPlaying = true;
    updateAyatulStatus("Playing");
    return;
  }

  if (ayatulPlaying) return;

  if (!ayatulParts.length || ayatulIndex >= ayatulParts.length) {
    ayatulParts = [...AYATUL_KURSI_PHRASES];
    ayatulIndex = 0;
  }

  ayatulToken++;
  ayatulPlaying = true;
  ayatulPaused = false;

  speakAyatulPhrase();
}

function pauseAyatulKursi() {
  if (!("speechSynthesis" in window)) return;
  if (!ayatulPlaying) return;

  window.speechSynthesis.pause();
  ayatulPaused = true;
  ayatulPlaying = false;
  updateAyatulStatus("Paused");
}

function repeatAyatulPhrase() {
  if (!ayatulParts.length) {
    ayatulParts = [...AYATUL_KURSI_PHRASES];
    ayatulIndex = 0;
  }

  ayatulToken++;

  if (ayatulTimer) {
    clearTimeout(ayatulTimer);
    ayatulTimer = null;
  }

  ayatulPlaying = true;
  ayatulPaused = false;

  speakAyatulPhrase();
}

function nextAyatulPhrase() {
  ayatulToken++;

  if (ayatulTimer) {
    clearTimeout(ayatulTimer);
    ayatulTimer = null;
  }

  if (!ayatulParts.length) {
    ayatulParts = [...AYATUL_KURSI_PHRASES];
    ayatulIndex = 0;
  } else {
    ayatulIndex++;
  }

  if (ayatulIndex >= ayatulParts.length) {
    ayatulPlaying = false;
    ayatulPaused = false;
    updateAyatulStatus("Completed");
    window.speechSynthesis.cancel();
    return;
  }

  ayatulPlaying = true;
  ayatulPaused = false;

  speakAyatulPhrase();
}

/* Regular audio for the other lessons */

function speak(text, voiceLang) {
  if (!("speechSynthesis" in window)) {
    alert("Audio is not supported by this browser.");
    return;
  }

  stopAyatulKursi();

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(
    String(text).replace(/۝/g, "،")
  );

  utterance.lang = voiceLang || "ar-SA";
  utterance.rate = 0.55;
  utterance.pitch = 1;

  utterance.onerror = function (event) {
    console.log("Speech error:", event.error);
  };

  window.speechSynthesis.speak(utterance);
}

/* Add phrase controls automatically to the Ayatul Kursi card */

function installAyatulKursiControls() {
  const listenButton = document.getElementById("s4");

  if (!listenButton) return;

  listenButton.onclick = function () {
    ayatulParts = [...AYATUL_KURSI_PHRASES];
    ayatulIndex = 0;
    stopAyatulKursi();
    playAyatulKursi();
  };

  if (document.getElementById("ayatulControls")) return;

  listenButton.insertAdjacentHTML("afterend", `
    <div id="ayatulControls" class="card" style="margin-top:12px;">
      <h3>Ayatul Kursiyyu — Phrase-by-Phrase Learning</h3>

      <p id="ayatulStatus" class="meaning">
        Ready — Phrase 1 of 9
      </p>

      <div class="btn-row">
        <button class="btn" type="button"
          onclick="playAyatulKursi()">Play / Resume</button>

        <button class="btn" type="button"
          onclick="pauseAyatulKursi()">Pause</button>

        <button class="btn" type="button"
          onclick="repeatAyatulPhrase()">Repeat</button>

        <button class="btn" type="button"
          onclick="nextAyatulPhrase()">Next Phrase</button>

        <button class="btn" type="button"
          onclick="stopAyatulKursi()">Stop</button>
      </div>

      <p class="meaning">
        Listen carefully to each phrase before moving to the next one.
      </p>
    </div>
  `);
}

/* Watch the Azkar section because its cards are rendered dynamically */

function watchAyatulKursiSection() {
  const azkarBox = document.getElementById("azkar");

  if (!azkarBox || !("MutationObserver" in window)) return;

  const observer = new MutationObserver(function () {
    installAyatulKursiControls();
  });

  observer.observe(azkarBox, {
    childList: true,
    subtree: true
  });

  installAyatulKursiControls();
}

watchAyatulKursiSection();


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
  `;

  $("lsName").onclick = () => speak(letter[1], "ar-SA");
  $("lsWord").onclick = () => speak(letter[3], "ar-SA");

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

/* ---------- WUDU AND SALAH ---------- */

function renderLesson(box, steps, state, key, headerHtml) {
  if (!box) return;

  box.innerHTML = headerHtml + `<div class="card" id="${key}Card"></div>`;

  const card = $(key + "Card");

  function draw() {
    if (state.finished) {
      card.innerHTML = `
        <div class="emoji">🎉</div>
        <h2 style="text-align:center">${ui("done_h")}</h2>
        <p style="text-align:center">${ui("done_p")}</p>
        <div class="btn-row">
          <button class="btn" id="${key}Again">
            ${ui("learn_again")}
          </button>
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
  if (!box) return;

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
  if (!box) return;

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
  const activePanel = document.querySelector(".panel.active");
  const currentTab = activePanel ? activePanel.id : "home";

  applyStatic();
  renderLetters();
  renderWudu();
  renderSalah();
  renderAzkar();
  renderQuiz();

  openTab(currentTab);
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

/* ---------- SETTINGS BUTTONS ---------- */

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

/* ---------- START APPLICATION ---------- */

applySettings();
renderAll();
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
