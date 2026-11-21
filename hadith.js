
"use strict";

/* ATM Little Muslim Learners
   Complete 42 Hadith of Imam An-Nawawi
   Arabic and English source: fawazahmed0/hadith-api
*/

(function () {
  const panel = document.getElementById("hadith");
  if (!panel) return;

  const BASE =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/";

  const SOURCES = {
    arabic: BASE + "ara-nawawi",
    english: BASE + "eng-nawawi"
  };

  let hadiths = [];
  let current = 0;

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  async function loadEdition(url) {
    for (const extension of [".min.json", ".json"]) {
      try {
        const response = await fetch(url + extension, {
          cache: "no-cache"
        });

        if (!response.ok) continue;

        const data = await response.json();

        if (Array.isArray(data.hadiths)) {
          return data.hadiths;
        }
      } catch (error) {
        // Try the alternative format.
      }
    }

    throw new Error("Unable to load Hadith edition.");
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
    if (typeof item.text === "string") return item.text;
    if (typeof item.hadith === "string") return item.hadith;
    return "";
  }

  function getNarrator(text) {
    const clean = text.trim();

    const patterns = [
      /^On the authority of ([^,]+(?:,\s*[^,]+)?)/i,
      /^It is narrated on the authority of ([^,]+(?:,\s*[^,]+)?)/i,
      /^Narrated by ([^:]+):/i,
      /^Narrated ([^:]+):/i
    ];

    for (const pattern of patterns) {
      const match = clean.match(pattern);
      if (match) return match[1].trim();
    }

    return "See the original narration";
  }

  function showMessage(message) {
    panel.innerHTML = `
      <div class="card">
        <h2>📜 Hadith Learning</h2>
        <p>${escapeHTML(message)}</p>
        <button class="btn" id="retryHadith">Try Again</button>
      </div>
    `;

    const retry = document.getElementById("retryHadith");
    if (retry) retry.addEventListener("click", loadAll);
  }

  function render() {
    if (!hadiths.length) return;

    const item = hadiths[current];

    panel.innerHTML = `
      <div class="card">
        <h2>📜 Hadith Learning</h2>
        <p>Imam An-Nawawi's Forty Hadith</p>
        <p>Hadith ${current + 1} of ${hadiths.length}</p>

        <input
          id="hadithSearch"
          type="search"
          placeholder="Search Hadith..."
          style="width:100%;padding:12px;margin:8px 0;"
        >

        <select id="hadithSelect" style="width:100%;padding:12px;">
          ${hadiths.map((h, i) => `
            <option value="${i}" ${i === current ? "selected" : ""}>
              Hadith ${i + 1}
            </option>
          `).join("")}
        </select>
      </div>

      <div class="card">
        <h3>Arabic / Larabci</h3>
        <p class="arabic" dir="rtl"
           style="font-size:27px;line-height:2.2;text-align:right;">
          ${escapeHTML(item.arabic)}
        </p>

        <hr>

        <h3>English Translation</h3>
        <p class="meaning">${escapeHTML(item.english)}</p>

        <hr>

        <h3>Hausa</h3>
        <p class="meaning">
          Ana gabatar da fassarar Hausa bayan an tantance ta.
          Ba a ƙirƙirar fassara a madadin ingantaccen rubutun Hadisi ba.
        </p>

        <hr>

        <p><strong>Narrator:</strong>
          ${escapeHTML(item.narrator)}
        </p>

        <p><strong>Collection:</strong>
          Forty Hadith of Imam An-Nawawi
        </p>

        <p><strong>Collection number:</strong>
          ${current + 1}
        </p>

        <p><strong>Original source references:</strong>
          Consult the source references for this narration before quoting
          a separate Bukhari or Muslim number.
        </p>
      </div>

      <div class="card">
        <div style="display:flex;gap:10px;justify-content:space-between;">
          <button class="btn" id="previousHadith"
            ${current === 0 ? "disabled" : ""}>
            ← Previous
          </button>

          <button class="btn" id="nextHadith"
            ${current === hadiths.length - 1 ? "disabled" : ""}>
            Next →
          </button>
        </div>
      </div>

      <div class="card">
        <p>
          Source: fawazahmed0/hadith-api,
          Forty Hadith of An-Nawawi.
        </p>
        <p>
          Arabic and English texts are loaded from the source editions.
        </p>
      </div>
    `;

    document.getElementById("previousHadith")
      .addEventListener("click", function () {
        if (current > 0) {
          current--;
          render();
        }
      });

    document.getElementById("nextHadith")
      .addEventListener("click", function () {
        if (current < hadiths.length - 1) {
          current++;
          render();
        }
      });

    document.getElementById("hadithSelect")
      .addEventListener("change", function () {
        current = Number(this.value);
        render();
      });

    document.getElementById("hadithSearch")
      .addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        const select = document.getElementById("hadithSelect");

        select.innerHTML = "";

        hadiths.forEach(function (h, i) {
          const searchable = (
            h.arabic + " " + h.english + " " + h.narrator
          ).toLowerCase();

          if (!query || searchable.includes(query)) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = "Hadith " + (i + 1);
            select.appendChild(option);
          }
        });

        if (select.options.length) {
          select.value = String(current);
        }
      });
  }

  async function loadAll() {
    showMessage("Loading all 42 Hadith. Please wait...");

    try {
      const results = await Promise.all([
        loadEdition(SOURCES.arabic),
        loadEdition(SOURCES.english)
      ]);

      const arabicRecords = results[0];
      const englishRecords = results[1];

      const englishMap = new Map();

      englishRecords.forEach(function (item, index) {
        englishMap.set(getNumber(item, index), item);
      });

      hadiths = arabicRecords
        .map(function (arabicItem, index) {
          const number = getNumber(arabicItem, index);
          const englishItem = englishMap.get(number);

          if (!englishItem) return null;

          const english = getText(englishItem);
          const arabic = getText(arabicItem);

          if (!arabic || !english) return null;

          return {
            number: number,
            arabic: arabic,
            english: english,
            narrator: getNarrator(english)
          };
        })
        .filter(Boolean)
        .sort(function (a, b) {
          return a.number - b.number;
        });

      if (hadiths.length !== 42) {
        throw new Error(
          "The source returned " + hadiths.length +
          " matching Hadith instead of 42."
        );
      }

      current = 0;
      render();

    } catch (error) {
      console.error("Hadith loading error:", error);

      showMessage(
        "Could not load all 42 Hadith. Check your internet connection " +
        "and try again."
      );
    }
  }

  loadAll();
})();
