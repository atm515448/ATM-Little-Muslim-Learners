
"use strict";

/* ATM Little Muslim Learners
   Imam An-Nawawi's 42 Hadith
   Arabic and English: hadith-api
   Audio recitation: Saad al-Ghamadi
   Audio source: Al-Huda Media / Farhat Hashmi
*/

(function () {
  const panel = document.getElementById("hadith");
  if (!panel) return;

  const ARABIC_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi.json";

  const ENGLISH_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-nawawi.json";

  const AUDIO_BASE =
    "https://data.alhudamedia.com/Fh/Forty-Hadith-Audio/nawawi";

  let hadiths = [];
  let current = 0;

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function audioURL(number) {
    return AUDIO_BASE +
      String(number).padStart(2, "0") + ".mp3";
  }

  function getNumber(item, index) {
    return Number(
      item.hadithnumber ||
      item.hadithNumber ||
      item.number ||
      index + 1
    );
  }

  function getText(item) {
    return item.text || item.hadith || "";
  }

  function getNarrator(text) {
    const match = String(text).match(
      /^Narrated\s+([^:]+):/i
    );
    return match ? match[1].trim() : "See the English text";
  }

  function render() {
    if (!hadiths.length) return;

    const hadith = hadiths[current];
    const number = hadith.number;

    panel.innerHTML = `
      <div class="hadith-container">

        <h2>📜 Hadith Learning</h2>
        <p>Imam An-Nawawi's Forty Hadith</p>
        <p>Learn the words and teachings of Prophet Muhammad ﷺ.</p>

        <input
          id="hadithSearch"
          type="search"
          placeholder="Search Hadith..."
          style="width:100%;padding:12px;margin:10px 0;"
        >

        <label for="hadithSelect">Choose Hadith</label>
        <select
          id="hadithSelect"
          style="width:100%;padding:12px;margin:8px 0 16px;"
        >
          ${hadiths.map((item, index) => `
            <option value="${index}" ${index === current ? "selected" : ""}>
              Hadith ${item.number}
            </option>
          `).join("")}
        </select>

        <div style="padding:15px;border-radius:12px;background:var(--card-bg,#f3f3f3);">

          <h3>Hadith ${number} of 42</h3>

          <h4>Arabic / Larabci</h4>
          <div
            dir="rtl"
            lang="ar"
            style="font-size:25px;line-height:2.1;text-align:right;"
          >${escapeHTML(hadith.arabic)}</div>

          <hr>

          <h4>English Translation</h4>
          <p style="line-height:1.8;">
            ${escapeHTML(hadith.english)}
          </p>

          <hr>

          <h4>Hausa / Hausa</h4>
          <p>
            Ana gabatar da fassarar Hausa bayan tantancewa
            daga malamin addini. Ba a ƙirƙirar fassara a
            matsayin ingantacciyar fassarar Hadisi ba.
          </p>

          <hr>

          <h4>🎧 Listen to Hadith ${number}</h4>
          <audio
            id="hadithAudio"
            controls
            preload="none"
            style="width:100%;"
          >
            <source src="${audioURL(number)}" type="audio/mpeg">
            Your browser does not support audio.
          </audio>

          <p style="font-size:13px;">
            Arabic recitation: Saad al-Ghamadi.
            Audio source:
            <a
              href="https://www.farhathashmi.com/hadith-section/arbain-nawawi/hadith-audios/"
              target="_blank"
              rel="noopener"
            >Farhat Hashmi / Al-Huda Media</a>.
          </p>

          <hr>

          <h4>📖 Narrator</h4>
          <p>${escapeHTML(getNarrator(hadith.english))}</p>

          <h4>Collection</h4>
          <p>Imam An-Nawawi's Forty Hadith (42 narrations).</p>

        </div>

        <div style="display:flex;gap:10px;margin-top:15px;">
          <button id="hadithPrevious" type="button" style="flex:1;padding:12px;">
            ← Previous
          </button>
          <button id="hadithNext" type="button" style="flex:1;padding:12px;">
            Next →
          </button>
        </div>

      </div>
    `;

    document.getElementById("hadithSelect").addEventListener(
      "change",
      function () {
        current = Number(this.value);
        render();
      }
    );

    document.getElementById("hadithPrevious").addEventListener(
      "click",
      function () {
        if (current > 0) {
          current--;
          render();
        }
      }
    );

    document.getElementById("hadithNext").addEventListener(
      "click",
      function () {
        if (current < hadiths.length - 1) {
          current++;
          render();
        }
      }
    );

    document.getElementById("hadithSearch").addEventListener(
      "input",
      function () {
        const query = this.value.toLowerCase().trim();

        const results = hadiths.filter(function (item) {
          return (
            item.english.toLowerCase().includes(query) ||
            item.arabic.includes(query) ||
            String(item.number).includes(query)
          );
        });

        const select = document.getElementById("hadithSelect");

        if (query && results.length) {
          select.innerHTML = results.map(function (item) {
            return `
              <option value="${hadiths.indexOf(item)}">
                Hadith ${item.number}
              </option>
            `;
          }).join("");
        } else if (!query) {
          select.innerHTML = hadiths.map(function (item, index) {
            return `
              <option value="${index}" ${index === current ? "selected" : ""}>
                Hadith ${item.number}
              </option>
            `;
          }).join("");
        } else {
          select.innerHTML = `<option>No Hadith found</option>`;
        }
      }
    );
  }

  async function loadHadith() {
    panel.innerHTML = `
      <p style="text-align:center;padding:20px;">
        Loading Hadith... Please wait.
      </p>
    `;

    try {
      const responses = await Promise.all([
        fetch(ARABIC_URL),
        fetch(ENGLISH_URL)
      ]);

      if (!responses[0].ok || !responses[1].ok) {
        throw new Error("Could not load Hadith data.");
      }

      const arabicData = await responses[0].json();
      const englishData = await responses[1].json();

      if (
        !Array.isArray(arabicData.hadiths) ||
        !Array.isArray(englishData.hadiths)
      ) {
        throw new Error("Invalid Hadith data format.");
      }

      const englishMap = new Map();

      englishData.hadiths.forEach(function (item, index) {
        englishMap.set(getNumber(item, index), item);
      });

      hadiths = arabicData.hadiths.map(function (arabicItem, index) {
        const number = getNumber(arabicItem, index);
        const englishItem = englishMap.get(number);

        if (!englishItem) return null;

        return {
          number: number,
          arabic: getText(arabicItem),
          english: getText(englishItem)
        };
      }).filter(function (item) {
        return item && item.arabic && item.english;
      });

      if (hadiths.length !== 42) {
        throw new Error(
          "Expected 42 Hadith, but loaded " + hadiths.length
        );
      }

      render();

    } catch (error) {
      console.error("Hadith loading error:", error);

      panel.innerHTML = `
        <h3>Hadith Learning</h3>
        <p>Unable to load Hadith right now.</p>
        <p>Please check your internet connection and try again.</p>
        <button onclick="location.reload()">Try Again</button>
      `;
    }
  }

  loadHadith();
})();
               
