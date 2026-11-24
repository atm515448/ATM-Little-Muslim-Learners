
/* ATM Little Muslim Learners
   Hisnul Muslim — Complete Catalogue Integration
   Dataset: OpenDua v0.0.4
   Based on Hisn al-Muslim by Sa'id ibn Ali ibn Wahf al-Qahtani
   Audio reciter: Muhammad Jumah
*/

"use strict";

(function () {
  const PANEL_ID = "hisnulMuslim";
  const CATALOGUE_URL = "catalogue.json";

  let catalogue = null;
  let selectedChapter = null;
  let searchTerm = "";
  let loading = false;
  let loadError = "";

  const panel = document.getElementById(PANEL_ID);

  if (!panel) {
    console.error("Hisnul Muslim panel was not found.");
    return;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function getEntries(chapterId) {
    if (!catalogue) return [];

    return catalogue.entries.filter(function (entry) {
      return entry.chapterId === chapterId;
    });
  }

  function getEntrySearchText(entry) {
    const parts = [
      entry.title,
      entry.type,
      entry.slug
    ];

    (entry.variations || []).forEach(function (variation) {
      (variation.steps || []).forEach(function (step) {
        (step.items || []).forEach(function (item) {
          if (item.dua) {
            parts.push(
              item.dua.arabic,
              item.dua.transliteration,
              item.dua.translation
            );
          }

          if (item.text) parts.push(item.text);
          if (item.instruction) parts.push(item.instruction);
        });
      });
    });

    return parts.join(" ").toLowerCase();
  }

  function getReferences(references) {
    if (!Array.isArray(references) || !references.length) {
      return "";
    }

    const content = references.map(function (reference) {
      if (typeof reference === "string") {
        return reference;
      }

      if (reference && typeof reference === "object") {
        return [
          reference.book,
          reference.name,
          reference.title,
          reference.text,
          reference.reference,
          reference.number
        ].filter(Boolean).join(" — ");
      }

      return "";
    }).filter(Boolean);

    if (!content.length) return "";

    return `
      <div class="meaning">
        <strong>References:</strong>
        ${content.map(escapeHTML).join("; ")}
      </div>
    `;
  }

  function renderPlaceholders(dua) {
    if (!Array.isArray(dua.placeholders) ||
        !dua.placeholders.length) {
      return "";
    }

    return `
      <div class="card">
        <strong>Personalise this supplication:</strong>
        ${dua.placeholders.map(function (placeholder) {
          return `
            <p class="meaning">
              ${escapeHTML(placeholder.instruction || placeholder.key || "")}
            </p>
          `;
        }).join("")}
      </div>
    `;
  }

  function getHausaMeaning(dua) {
    const known = {
      "الْحَمْدُ للَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا، وَإِلَيْهِ النُّشُورُ":
        "Dukkan yabo ya tabbata ga Allah Wanda Ya rayar da mu bayan Ya sa mun mutu (ta barci), kuma gare Shi ne tashin kiyama.",
      "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لي بِذِكْرِهِ":
        "Dukkan yabo ya tabbata ga Allah Wanda Ya ba ni lafiya a jikina, Ya dawo mini da raina, kuma Ya ba ni izinin ambatonSa.",
      "بِسْمِ اللَّهِ": "Da sunan Allah.",
      "غُفْرَانَكَ": "Ina neman gafararka, Ya Allah.",
      "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَاَ حَوْلَ وَلَا قُوَّةَ إِلاَّ بِاللَّهِ":
        "Da sunan Allah. Na dogara ga Allah. Babu dabara ko ƙarfi sai da taimakon Allah.",
      "سُبْحانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَسْتَغْفِرُكَ وَأَتوبُ إِلَيْكَ":
        "Tsarki ya tabbata a gare Ka, Ya Allah, tare da gode maka. Ina shaida babu abin bautawa da gaskiya sai Kai. Ina neman gafararka kuma ina tuba zuwa gare Ka."
    };
    if (window.LML_HISNUL_HAUSA && window.LML_HISNUL_HAUSA[dua.id]) return window.LML_HISNUL_HAUSA[dua.id];
    return known[dua.arabic] || "";
  }

  function renderDua(dua, item) {
    if (!dua) return "";

    const times = item && item.times
      ? `<p class="meaning"><strong>Repeat:</strong> ${escapeHTML(item.times)} time(s)</p>`
      : "";

    return `
      <div class="card">
        <p class="arabic" dir="rtl" lang="ar"
           style="font-size:1.8em;line-height:2;text-align:right;">
          ${escapeHTML(dua.arabic || "")}
        </p>

        ${dua.transliteration ? `
          <p class="translit">
            ${escapeHTML(dua.transliteration)}
          </p>
        ` : ""}

        ${dua.translation ? `
          <p class="meaning">
            <strong>English meaning:</strong><br>
            ${escapeHTML(dua.translation)}
          </p>
        ` : ""}

        <p class="meaning">
          <strong>Ma'ana a Hausa:</strong><br>
          ${escapeHTML(getHausaMeaning(dua) || "Ba a saka fassarar Hausa da aka tantance ga wannan addu'ar ba tukuna.")}
        </p>

        ${times}
        ${getReferences(dua.references)}
        ${renderPlaceholders(dua)}
      </div>
    `;
  }

  function renderItem(item) {
    if (!item) return "";

    if (item.dua) {
      return renderDua(item.dua, item);
    }

    const text = item.text || item.instruction || "";

    if (text) {
      return `
        <div class="card">
          <p>${escapeHTML(text)}</p>
        </div>
      `;
    }

    return "";
  }

  function renderStep(step, index) {
    const stepType = step.type || "Content";

    const itemsHTML = (step.items || []).map(renderItem).join("");

    const recordingsHTML = (step.recordings || [])
      .filter(function (recording) {
        return recording.url;
      })
      .map(function (recording) {
        return `
          <div class="card">
            <p><strong>🎧 Audio recitation</strong></p>
            <audio
              controls
              preload="none"
              style="width:100%;"
              src="${escapeHTML(recording.url)}"
            >
              Your browser does not support audio playback.
            </audio>
            <p class="meaning">
              Reciter: Muhammad Jumah
            </p>
          </div>
        `;
      }).join("");

    return `
      <div>
        <h4>Part ${index + 1} — ${escapeHTML(stepType)}</h4>
        ${itemsHTML}
        ${recordingsHTML}
      </div>
    `;
  }

  function renderEntry(entry, index) {
    const variations = entry.variations || [];

    return `
      <article class="card">
        <h3>
          ${index + 1}. ${escapeHTML(entry.title || "Supplication")}
        </h3>

        <p class="meaning">
          ${escapeHTML(entry.type || "Entry")}
          ${entry.sourceReference
            ? " • Reference " + escapeHTML(entry.sourceReference)
            : ""}
        </p>

        ${variations.map(function (variation, variationIndex) {
          return `
            <div>
              ${variations.length > 1
                ? `<h4>Version ${variationIndex + 1}</h4>`
                : ""}
              ${(variation.steps || []).map(renderStep).join("")}
            </div>
          `;
        }).join("")}

        ${getReferences(entry.references)}
      </article>
    `;
  }

  function renderHeader() {
    return `
      <div class="card">
        <h2>📖 Hisnul Muslim</h2>
        <p><strong>حصن المسلم</strong></p>
        <p>
          Fortress of the Muslim — supplications and remembrance
          from the Qur'an and Sunnah.
        </p>
        <p>
          Explore the chapters, read the Arabic supplications,
          learn their transliteration and English meanings,
          and listen to available recitations.
        </p>
        <p class="meaning">
          ${catalogue.chapters.length} chapters •
          ${catalogue.entries.length} entries
        </p>
      </div>
    `;
  }

  function renderSearch() {
    return `
      <div class="card">
        <label for="hisnulSearch">
          <strong>🔎 Search Hisnul Muslim</strong>
        </label>

        <input
          id="hisnulSearch"
          type="search"
          value="${escapeHTML(searchTerm)}"
          placeholder="Search chapters, duas or meanings..."
          style="width:100%;padding:12px;margin-top:8px;"
        />

        <p class="meaning">
          Search using English words, Arabic text or transliteration.
        </p>
      </div>
    `;
  }

  function renderChapterList() {
    const query = searchTerm.trim().toLowerCase();

    const chapters = catalogue.chapters.filter(function (chapter) {
      if (!query) return true;

      const chapterEntries = getEntries(chapter.id);

      const chapterText = chapter.title.toLowerCase();

      const entryMatch = chapterEntries.some(function (entry) {
        return getEntrySearchText(entry).includes(query);
      });

      return chapterText.includes(query) || entryMatch;
    });

    if (!chapters.length) {
      return `
        <div class="card">
          <p>No matching chapter or supplication was found.</p>
          <p>Try another search word.</p>
        </div>
      `;
    }

    return `
      <div class="card">
        <h3>📚 All Chapters</h3>
        <p>Select a chapter to read its supplications.</p>

        <div class="lesson-grid">
          ${chapters.map(function (chapter) {
            return `
              <button
                class="lesson-card"
                type="button"
                data-hm-chapter="${escapeHTML(chapter.id)}"
              >
                <span>📖 ${escapeHTML(chapter.number)}</span>
                <strong>${escapeHTML(chapter.title)}</strong>
                <small>
                  ${escapeHTML(chapter.entryCount)} entries
                </small>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderChapterDetails(chapter) {
    const entries = getEntries(chapter.id);

    return `
      <div class="card">
        <button
          type="button"
          class="btn alt"
          id="hisnulBackButton"
        >
          ← Back to Chapters
        </button>

        <h2>
          📖 Chapter ${escapeHTML(chapter.number)}
        </h2>

        <h3>${escapeHTML(chapter.title)}</h3>

        <p class="meaning">
          ${entries.length} entries in this chapter
        </p>
      </div>

      ${entries.map(renderEntry).join("")}

      <div class="card">
        <button
          type="button"
          class="btn alt"
          id="hisnulBackButtonBottom"
        >
          ← Back to All Chapters
        </button>
      </div>
    `;
  }

  function renderLoading() {
    panel.innerHTML = `
      <div class="card">
        <h2>📖 Hisnul Muslim</h2>
        <p>Loading the complete supplication collection...</p>
        <p>Please wait.</p>
      </div>
    `;
  }

  function renderError() {
    panel.innerHTML = `
      <div class="card">
        <h2>Unable to Load Hisnul Muslim</h2>
        <p>${escapeHTML(loadError)}</p>
        <button
          type="button"
          class="btn"
          id="hisnulRetryButton"
        >
          Try Again
        </button>
      </div>
    `;
  }

  function renderApp() {
    if (!catalogue) return;

    if (selectedChapter) {
      const chapter = catalogue.chapters.find(function (item) {
        return item.id === selectedChapter;
      });

      if (chapter) {
        panel.innerHTML =
          renderHeader() + renderChapterDetails(chapter);
        return;
      }

      selectedChapter = null;
    }

    panel.innerHTML =
      renderHeader() +
      renderSearch() +
      renderChapterList();

    const searchInput = document.getElementById("hisnulSearch");

    if (searchInput) {
      searchInput.addEventListener("input", function (event) {
        searchTerm = event.target.value;
        const position = event.target.selectionStart;
        renderApp();

        const newInput = document.getElementById("hisnulSearch");

        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(position, position);
        }
      });
    }
  }

  async function loadCatalogue() {
    if (loading) return;

    loading = true;
    loadError = "";
    renderLoading();

    try {
      const response = await fetch(CATALOGUE_URL, {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(
          "Catalogue request failed: " + response.status
        );
      }

      const data = await response.json();

      if (!Array.isArray(data.chapters) ||
          !Array.isArray(data.entries)) {
        throw new Error("The catalogue format is not valid.");
      }

      catalogue = data;
      selectedChapter = null;
      loading = false;
      renderApp();

      console.log(
        "Hisnul Muslim loaded:",
        data.chapters.length,
        "chapters and",
        data.entries.length,
        "entries."
      );

    } catch (error) {
      loading = false;
      loadError =
        "Check that catalogue.json exists in the repository root " +
        "and that your internet connection is working.";

      console.error("Hisnul Muslim loading error:", error);
      renderError();
    }
  }

  panel.addEventListener("click", function (event) {
    const chapterButton = event.target.closest("[data-hm-chapter]");

    if (chapterButton) {
      selectedChapter = chapterButton.dataset.hmChapter;
      renderApp();
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (
      event.target.closest("#hisnulBackButton") ||
      event.target.closest("#hisnulBackButtonBottom")
    ) {
      selectedChapter = null;
      renderApp();
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (event.target.closest("#hisnulRetryButton")) {
      loadCatalogue();
    }
  });

  loadCatalogue();
})();
           
