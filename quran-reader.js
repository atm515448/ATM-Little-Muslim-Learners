/* ATM Little Muslim Learners — Complete Qur’an reader
   Translations are fetched from QuranEnc and cached on this device.
   Audio catalogue and hosted audio are provided by MP3Quran.net.
*/
(function () {
  "use strict";
  const API = "https://quranenc.com/api/v1/translation/sura/";
  const HAUSA_KEY = "hausa_gummi";
  const ENGLISH_KEY = "english_saheeh";
  const AUDIO_API = "https://mp3quran.net/api/v3/reciters?language=eng";
  const DB_NAME = "atm-lml-quran-v1";
  const STORE = "surahs";
  const names = [
    ["Al-Fatihah","الفاتحة"],["Al-Baqarah","البقرة"],["Aal-Imran","آل عمران"],["An-Nisa","النساء"],["Al-Maidah","المائدة"],["Al-Anam","الأنعام"],["Al-Araf","الأعراف"],["Al-Anfal","الأنفال"],["At-Tawbah","التوبة"],["Yunus","يونس"],["Hud","هود"],["Yusuf","يوسف"],["Ar-Rad","الرعد"],["Ibrahim","إبراهيم"],["Al-Hijr","الحجر"],["An-Nahl","النحل"],["Al-Isra","الإسراء"],["Al-Kahf","الكهف"],["Maryam","مريم"],["Ta-Ha","طه"],["Al-Anbiya","الأنبياء"],["Al-Hajj","الحج"],["Al-Muminun","المؤمنون"],["An-Nur","النور"],["Al-Furqan","الفرقان"],["Ash-Shuara","الشعراء"],["An-Naml","النمل"],["Al-Qasas","القصص"],["Al-Ankabut","العنكبوت"],["Ar-Rum","الروم"],["Luqman","لقمان"],["As-Sajdah","السجدة"],["Al-Ahzab","الأحزاب"],["Saba","سبأ"],["Fatir","فاطر"],["Ya-Sin","يس"],["As-Saffat","الصافات"],["Sad","ص"],["Az-Zumar","الزمر"],["Ghafir","غافر"],["Fussilat","فصلت"],["Ash-Shura","الشورى"],["Az-Zukhruf","الزخرف"],["Ad-Dukhan","الدخان"],["Al-Jathiyah","الجاثية"],["Al-Ahqaf","الأحقاف"],["Muhammad","محمد"],["Al-Fath","الفتح"],["Al-Hujurat","الحجرات"],["Qaf","ق"],["Adh-Dhariyat","الذاريات"],["At-Tur","الطور"],["An-Najm","النجم"],["Al-Qamar","القمر"],["Ar-Rahman","الرحمن"],["Al-Waqiah","الواقعة"],["Al-Hadid","الحديد"],["Al-Mujadilah","المجادلة"],["Al-Hashr","الحشر"],["Al-Mumtahanah","الممتحنة"],["As-Saff","الصف"],["Al-Jumuah","الجمعة"],["Al-Munafiqun","المنافقون"],["At-Taghabun","التغابن"],["At-Talaq","الطلاق"],["At-Tahrim","التحريم"],["Al-Mulk","الملك"],["Al-Qalam","القلم"],["Al-Haqqah","الحاقة"],["Al-Maarij","المعارج"],["Nuh","نوح"],["Al-Jinn","الجن"],["Al-Muzzammil","المزمل"],["Al-Muddaththir","المدثر"],["Al-Qiyamah","القيامة"],["Al-Insan","الإنسان"],["Al-Mursalat","المرسلات"],["An-Naba","النبأ"],["An-Naziat","النازعات"],["Abasa","عبس"],["At-Takwir","التكوير"],["Al-Infitar","الإنفطار"],["Al-Mutaffifin","المطففين"],["Al-Inshiqaq","الإنشقاق"],["Al-Buruj","البروج"],["At-Tariq","الطارق"],["Al-Ala","الأعلى"],["Al-Ghashiyah","الغاشية"],["Al-Fajr","الفجر"],["Al-Balad","البلد"],["Ash-Shams","الشمس"],["Al-Layl","الليل"],["Ad-Duha","الضحى"],["Ash-Sharh","الشرح"],["At-Tin","التين"],["Al-Alaq","العلق"],["Al-Qadr","القدر"],["Al-Bayyinah","البينة"],["Az-Zalzalah","الزلزلة"],["Al-Adiyat","العاديات"],["Al-Qariah","القارعة"],["At-Takathur","التكاثر"],["Al-Asr","العصر"],["Al-Humazah","الهمزة"],["Al-Fil","الفيل"],["Quraysh","قريش"],["Al-Maun","الماعون"],["Al-Kawthar","الكوثر"],["Al-Kafirun","الكافرون"],["An-Nasr","النصر"],["Al-Masad","المسد"],["Al-Ikhlas","الإخلاص"],["Al-Falaq","الفلق"],["An-Nas","الناس"]
  ];
  const $ = id => document.getElementById(id);
  let currentSurah = 1, audioFolder = "", dbPromise;

  function dbOpen() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("Offline storage is unavailable in this browser."));
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "surah" }); };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }
  async function storedGet(id) {
    const db = await dbOpen();
    return new Promise((resolve, reject) => { const r = db.transaction(STORE).objectStore(STORE).get(id); r.onsuccess = () => resolve(r.result || null); r.onerror = () => reject(r.error); });
  }
  async function storedPut(record) {
    const db = await dbOpen();
    return new Promise((resolve, reject) => { const r = db.transaction(STORE, "readwrite").objectStore(STORE).put(record); r.onsuccess = () => resolve(); r.onerror = () => reject(r.error); });
  }
  async function fetchTranslation(key, id) {
    const response = await fetch(API + key + "/" + id, { mode: "cors" });
    if (!response.ok) throw new Error("QuranEnc returned HTTP " + response.status + " for surah " + id);
    const data = await response.json();
    const rows = data.result || data;
    if (!Array.isArray(rows) || !rows.length) throw new Error("No verse data returned for surah " + id);
    return rows;
  }
  async function loadSurah(id, forceOnline) {
    if (!forceOnline) {
      try { const saved = await storedGet(id); if (saved && Array.isArray(saved.verses) && saved.verses.length) return saved; } catch (_) {}
    }
    const [ha, en] = await Promise.all([fetchTranslation(HAUSA_KEY, id), fetchTranslation(ENGLISH_KEY, id)]);
    if (ha.length !== en.length) throw new Error("Verse count mismatch in surah " + id + ". Data was not saved.");
    const verses = ha.map((h, i) => {
      const e = en[i];
      if (String(h.aya) !== String(e.aya)) throw new Error("Verse numbering mismatch in surah " + id + ".");
      return { aya: Number(h.aya), arabic: h.arabic_text || e.arabic_text || "", hausa: h.translation || "", english: e.translation || "", hausaFootnotes: h.footnotes || "", englishFootnotes: e.footnotes || "" };
    });
    if (verses.some(v => !v.arabic || !v.hausa || !v.english)) throw new Error("Some verse fields are missing in surah " + id + ". Please retry.");
    const record = { surah: id, verses, savedAt: Date.now(), source: "QuranEnc", hausaVersion: "1.2.2", englishVersion: "1.1.2" };
    await storedPut(record);
    return record;
  }
  function render(record) {
    const box = $("quranVerses"); box.replaceChildren();
    const title = document.createElement("h3"); title.textContent = record.surah + ". " + names[record.surah - 1][0] + " — " + names[record.surah - 1][1]; box.appendChild(title);
    record.verses.forEach(v => {
      const article = document.createElement("article"); article.className = "quran-verse";
      const number = document.createElement("div"); number.className = "quran-verse-number"; number.textContent = "Ayah " + v.aya; article.appendChild(number);
      const ar = document.createElement("div"); ar.className = "quran-arabic"; ar.dir = "rtl"; ar.lang = "ar"; ar.textContent = v.arabic; article.appendChild(ar);
      const ha = document.createElement("p"); ha.className = "quran-meaning"; const hs = document.createElement("strong"); hs.textContent = "Hausa — Ma’ana"; ha.append(hs, document.createTextNode(v.hausa)); article.appendChild(ha);
      const en = document.createElement("p"); en.className = "quran-meaning"; const es = document.createElement("strong"); es.textContent = "English — Meaning"; en.append(es, document.createTextNode(v.english)); article.appendChild(en);
      box.appendChild(article);
    });
    localStorage.setItem("lml_quran_last", String(record.surah));
    $("quranStatus").textContent = "Loaded " + record.verses.length + " verses. This surah is saved for offline reading on this device.";
    $("quranBookmark").textContent = localStorage.getItem("lml_quran_bookmark") === String(record.surah) ? "★ Bookmarked" : "☆ Bookmark";
    setupAudio(record.surah);
  }
  async function setupAudio(id) {
    try {
      if (!audioFolder) {
        const r = await fetch(AUDIO_API); if (!r.ok) throw new Error("Audio catalogue unavailable");
        const data = await r.json();
        const reciters = data.reciters || [];
        const reciter = reciters.find(x => /saad\s*al[- ]?ghamdi|saad al ghamdi/i.test(x.name || ""));
        if (!reciter) throw new Error("Saad Al-Ghamdi was not found in the MP3Quran catalogue.");
        const read = (reciter.moshaf || []).find(x => String(x.surah_list || "").split(",").length >= 114 && String(x.surah_list || "").split(",").includes("114")) || (reciter.moshaf || []).find(x => Number(x.surah_total) === 114);
        if (!read || !read.server) throw new Error("A complete 114-surah recording was not found for this reciter.");
        audioFolder = read.server.endsWith("/") ? read.server : read.server + "/";
      }
      $("quranAudio").src = audioFolder + String(id).padStart(3, "0") + ".mp3";
      $("quranAudioBox").hidden = false;
    } catch (e) {
      $("quranAudioBox").hidden = false;
      $("quranAudioBox").querySelector("small").textContent = "Audio catalogue could not be loaded: " + e.message;
    }
  }
  async function openSelected() {
    const id = Number($("quranSurah").value); currentSurah = id;
    $("quranStatus").textContent = "Loading surah " + id + "…";
    try { render(await loadSurah(id, false)); }
    catch (e) { $("quranStatus").textContent = "Could not load this surah: " + e.message + " Check your internet connection and try again."; }
  }
  async function downloadAll() {
    const button = $("quranDownloadAll"); button.disabled = true;
    for (let id = 1; id <= 114; id++) {
      $("quranStatus").textContent = "Saving Qur’an text offline: surah " + id + " of 114… Please keep this page open and connected to the internet.";
      try { await loadSurah(id, true); }
      catch (e) { $("quranStatus").textContent = "Stopped at surah " + id + ": " + e.message + " You can retry later."; button.disabled = false; return; }
    }
    $("quranStatus").textContent = "All 114 surahs have been saved for offline reading on this device.";
    button.disabled = false;
  }
  function init() {
    const select = $("quranSurah"); if (!select) return;
    names.forEach((n, i) => { const o = document.createElement("option"); o.value = String(i + 1); o.textContent = (i + 1) + ". " + n[0] + " — " + n[1]; select.appendChild(o); });
    $("quranLoad").addEventListener("click", openSelected);
    $("quranSearch").addEventListener("input", e => {
      const q = e.target.value.toLowerCase().trim();
      Array.from(select.options).forEach((o, i) => { o.hidden = !!q && !((i + 1) + " " + names[i][0] + " " + names[i][1]).toLowerCase().includes(q); });
      const first = Array.from(select.options).find(o => !o.hidden); if (first) select.value = first.value;
    });
    $("quranBookmark").addEventListener("click", () => { localStorage.setItem("lml_quran_bookmark", String(currentSurah)); $("quranBookmark").textContent = "★ Bookmarked"; $("quranStatus").textContent = "Bookmark saved on this device."; });
    $("quranResume").addEventListener("click", () => { const id = Number(localStorage.getItem("lml_quran_last") || localStorage.getItem("lml_quran_bookmark") || 1); select.value = String(id); openSelected(); });
    $("quranDownloadCurrent").addEventListener("click", async () => { $("quranStatus").textContent = "Saving this surah…"; try { render(await loadSurah(currentSurah, true)); } catch (e) { $("quranStatus").textContent = "Download failed: " + e.message; } });
    $("quranDownloadAll").addEventListener("click", downloadAll);
    const last = Number(localStorage.getItem("lml_quran_last") || 1); select.value = String(last);
    openSelected();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
