
/*
 * ATM Little Muslim Learners
 * Asma'ul Husna — The 99 Beautiful Names of Allah
 * ATM Digital Solutions & Services
 * Phone: 08133515448
 */

"use strict";

const asmaulHusnaNames = [
  ["الرَّحْمَٰنُ","Ar-Rahman","The Most Merciful","Mai yawan rahama"],
  ["الرَّحِيمُ","Ar-Raheem","The Especially Merciful","Mai jin ƙai"],
  ["الْمَلِكُ","Al-Malik","The King","Sarki, Mamallakin komai"],
  ["الْقُدُّوسُ","Al-Quddus","The Most Holy","Mai tsarki"],
  ["السَّلَامُ","As-Salam","The Source of Peace","Madogarar aminci"],
  ["الْمُؤْمِنُ","Al-Mu'min","The Giver of Security","Mai ba da aminci"],
  ["الْمُهَيْمِنُ","Al-Muhaymin","The Guardian","Mai kiyayewa"],
  ["الْعَزِيزُ","Al-Aziz","The Almighty","Mabuwayi"],
  ["الْجَبَّارُ","Al-Jabbar","The Compeller","Mai cikakken iko"],
  ["الْمُتَكَبِّرُ","Al-Mutakabbir","The Supreme","Mai girma"],
  ["الْخَالِقُ","Al-Khaliq","The Creator","Mahalicci"],
  ["الْبَارِئُ","Al-Bari","The Originator","Mai ƙirƙira"],
  ["الْمُصَوِّرُ","Al-Musawwir","The Fashioner","Mai tsara halitta"],
  ["الْغَفَّارُ","Al-Ghaffar","The Constant Forgiver","Mai yawan gafartawa"],
  ["الْقَهَّارُ","Al-Qahhar","The All-Prevailing","Mai rinjaye a kan komai"],
  ["الْوَهَّابُ","Al-Wahhab","The Supreme Bestower","Mai yawan bayarwa"],
  ["الرَّزَّاقُ","Ar-Razzaq","The Provider","Mai azurtawa"],
  ["الْفَتَّاحُ","Al-Fattah","The Opener","Mai buɗe al'amura"],
  ["الْعَلِيمُ","Al-Alim","The All-Knowing","Masani ga komai"],
  ["الْقَابِضُ","Al-Qabid","The Withholder","Mai riƙewa"],
  ["الْبَاسِطُ","Al-Basit","The Extender","Mai yalwatawa"],
  ["الْخَافِضُ","Al-Khafid","The Abaser","Mai ƙasƙantarwa"],
  ["الرَّافِعُ","Ar-Rafi","The Exalter","Mai ɗaukakawa"],
  ["الْمُعِزُّ","Al-Mu'izz","The Honourer","Mai ɗaukaka"],
  ["الْمُذِلُّ","Al-Mudhill","The One Who Humbles","Mai ƙasƙantar da wanda Ya so"],
  ["السَّمِيعُ","As-Sami","The All-Hearing","Mai jin komai"],
  ["الْبَصِيرُ","Al-Basir","The All-Seeing","Mai ganin komai"],
  ["الْحَكَمُ","Al-Hakam","The Judge","Mai yin hukunci"],
  ["الْعَدْلُ","Al-Adl","The Utterly Just","Mai cikakken adalci"],
  ["اللَّطِيفُ","Al-Latif","The Most Gentle","Mai tausasawa"],
  ["الْخَبِيرُ","Al-Khabir","The All-Aware","Masani ga dukkan al'amura"],
  ["الْحَلِيمُ","Al-Halim","The Most Forbearing","Mai haƙuri"],
  ["الْعَظِيمُ","Al-Azim","The Magnificent","Mai girman ɗaukaka"],
  ["الْغَفُورُ","Al-Ghafur","The Great Forgiver","Mai gafara mai yawa"],
  ["الشَّكُورُ","Ash-Shakur","The Most Appreciative","Mai sakayya ga godiya"],
  ["الْعَلِيُّ","Al-Aliyy","The Most High","Maɗaukaki"],
  ["الْكَبِيرُ","Al-Kabir","The Most Great","Mai girma ƙwarai"],
  ["الْحَفِيظُ","Al-Hafiz","The Preserver","Mai kiyayewa"],
  ["الْمُقِيتُ","Al-Muqit","The Sustainer","Mai ciyarwa da azurtawa"],
  ["الْحَسِيبُ","Al-Hasib","The Reckoner","Mai hisabi"],
  ["الْجَلِيلُ","Al-Jalil","The Majestic","Mai girman daraja"],
  ["الْكَرِيمُ","Al-Karim","The Most Generous","Mai karamci"],
  ["الرَّقِيبُ","Ar-Raqib","The Watchful","Mai lura da komai"],
  ["الْمُجِيبُ","Al-Mujib","The Responsive One","Mai amsa addu'a"],
  ["الْوَاسِعُ","Al-Wasi","The All-Encompassing","Mai yalwar rahama da ilimi"],
  ["الْحَكِيمُ","Al-Hakim","The All-Wise","Mai hikima"],
  ["الْوَدُودُ","Al-Wadud","The Most Loving","Mai ƙauna"],
  ["الْمَجِيدُ","Al-Majid","The Glorious","Mai ɗaukaka da girma"],
  ["الْبَاعِثُ","Al-Ba'ith","The Resurrector","Mai tayar da matattu"],
  ["الشَّهِيدُ","Ash-Shahid","The Witness","Shaida a kan komai"],
  ["الْحَقُّ","Al-Haqq","The Absolute Truth","Gaskiya ta haƙiƙa"],
  ["الْوَكِيلُ","Al-Wakil","The Trustee","Wakili kuma abin dogaro"],
  ["الْقَوِيُّ","Al-Qawiyy","The All-Strong","Mai cikakken ƙarfi"],
  ["الْمَتِينُ","Al-Matin","The Firm","Mai cikakken ƙarfi da tabbaci"],
  ["الْوَلِيُّ","Al-Waliyy","The Protecting Friend","Majiɓinci"],
  ["الْحَمِيدُ","Al-Hamid","The Praiseworthy","Abin yabo"],
  ["الْمُحْصِي","Al-Muhsi","The All-Enumerator","Mai ƙididdige komai"],
  ["الْمُبْدِئُ","Al-Mubdi","The Originator","Mai fara halitta"],
  ["الْمُعِيدُ","Al-Muid","The Restorer","Mai mayarwa"],
  ["الْمُحْيِي","Al-Muhyi","The Giver of Life","Mai ba da rai"],
  ["الْمُمِيتُ","Al-Mumit","The Creator of Death","Mai kawo mutuwa"],
  ["الْحَيُّ","Al-Hayy","The Ever-Living","Rayayye wanda ba ya mutuwa"],
  ["الْقَيُّومُ","Al-Qayyum","The Self-Subsisting Sustainer","Mai tsayuwa da komai"],
  ["الْوَاجِدُ","Al-Wajid","The Finder","Mai wadatar komai"],
  ["الْمَاجِدُ","Al-Majid","The Noble","Mai ɗaukaka da karamci"],
  ["الْوَاحِدُ","Al-Wahid","The One","Makaɗaici"],
  ["الْأَحَدُ","Al-Ahad","The Unique One","Guda ɗaya tilo"],
  ["الصَّمَدُ","As-Samad","The Eternal Refuge","Mabuƙata suna komawa gare Shi"],
  ["الْقَادِرُ","Al-Qadir","The All-Powerful","Mai iko a kan komai"],
  ["الْمُقْتَدِرُ","Al-Muqtadir","The Omnipotent","Mai cikakken iko"],
  ["الْمُقَدِّمُ","Al-Muqaddim","The Expediter","Mai gabatar da abin da Ya so"],
  ["الْمُؤَخِّرُ","Al-Mu'akhkhir","The Delayer","Mai jinkirta abin da Ya so"],
  ["الْأَوَّلُ","Al-Awwal","The First","Na farko"],
  ["الْآخِرُ","Al-Akhir","The Last","Na ƙarshe"],
  ["الظَّاهِرُ","Az-Zahir","The Manifest","Bayyananne"],
  ["الْبَاطِنُ","Al-Batin","The Hidden","Boyayye ga idanu"],
  ["الْوَالِي","Al-Wali","The Sole Governor","Mai gudanar da al'amura"],
  ["الْمُتَعَالِي","Al-Muta'ali","The Most Exalted","Maɗaukaki fiye da komai"],
  ["الْبَرُّ","Al-Barr","The Source of All Goodness","Mai yawan alheri"],
  ["التَّوَّابُ","At-Tawwab","The Ever-Pardoning","Mai karɓar tuba"],
  ["الْمُنْتَقِمُ","Al-Muntaqim","The Avenger","Mai yin sakayya da adalci"],
  ["الْعَفُوُّ","Al-Afuww","The Pardoner","Mai yawan yafiya"],
  ["الرَّؤُوفُ","Ar-Ra'uf","The Most Kind","Mai tausayi ƙwarai"],
  ["مَالِكُ الْمُلْكِ","Malik-ul-Mulk","Owner of All Sovereignty","Mamallakin dukkan mulki"],
  ["ذُو الْجَلَالِ وَالْإِكْرَامِ","Dhul-Jalali wal-Ikram","Lord of Majesty and Honour","Ma'abocin girma da karamci"],
  ["الْمُقْسِطُ","Al-Muqsit","The Just One","Mai yin adalci"],
  ["الْجَامِعُ","Al-Jami","The Gatherer","Mai tattarawa"],
  ["الْغَنِيُّ","Al-Ghaniyy","The Self-Sufficient","Ma wadaci wanda ba ya buƙatar kowa"],
  ["الْمُغْنِي","Al-Mughni","The Enricher","Mai wadatarwa"],
  ["الْمَانِعُ","Al-Mani","The Preventer","Mai hanawa"],
  ["الضَّارُّ","Ad-Darr","The One Who Allows Harm","Mai ƙaddara abin da zai faru"],
  ["النَّافِعُ","An-Nafi","The Benefactor","Mai amfanarwa"],
  ["النُّورُ","An-Nur","The Light","Haske"],
  ["الْهَادِي","Al-Hadi","The Guide","Mai shiryarwa"],
  ["الْبَدِيعُ","Al-Badi","The Incomparable Originator","Mai ƙirƙirar halitta babu misali"],
  ["الْبَاقِي","Al-Baqi","The Everlasting","Madawwami"],
  ["الْوَارِثُ","Al-Warith","The Inheritor","Magaji kuma Mamallakin komai"],
  ["الرَّشِيدُ","Ar-Rashid","The Guide to the Right Path","Mai shiryarwa zuwa hanya madaidaiciya"],
  ["الصَّبُورُ","As-Sabur","The Most Patient","Mai cikakken haƙuri"]
];

/* ---------- STYLES ---------- */

(function addAsmaStyles() {
  if (document.getElementById("asmaul-husna-styles")) return;

  const style = document.createElement("style");
  style.id = "asmaul-husna-styles";

  style.textContent = `
    #asmaulHusna .asma-heading {
      text-align: center;
      padding: 15px 8px;
    }

    #asmaulHusna .asma-heading .asma-arabic-title {
      font-size: 2rem;
      direction: rtl;
      line-height: 1.9;
      color: var(--navy, #263b91);
    }

    #asmaulHusna .asma-search {
      width: 100%;
      padding: 13px;
      border: 2px solid var(--navy, #263b91);
      border-radius: 12px;
      font-size: 16px;
      margin: 10px 0;
    }

    #asmaHusnaGrid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 15px;
    }

    #asmaulHusna .asma-card {
      background: var(--card, #fff);
      color: var(--text, #1d2140);
      border: 1px solid rgba(100, 100, 150, .2);
      border-radius: 15px;
      padding: 15px;
      text-align: center;
      box-shadow: 0 3px 10px rgba(0,0,0,.06);
    }

    #asmaulHusna .asma-number {
      display: inline-block;
      background: var(--navy, #263b91);
      color: white;
      border-radius: 50%;
      min-width: 30px;
      padding: 6px;
      font-size: 13px;
      margin-bottom: 8px;
    }

    #asmaulHusna .asma-arabic {
      font-size: 2rem;
      direction: rtl;
      line-height: 2;
      margin: 8px 0;
      color: var(--navy, #263b91);
    }

    #asmaulHusna .asma-translit {
      font-weight: bold;
      font-size: 1rem;
      margin: 6px 0;
    }

    #asmaulHusna .asma-meaning {
      font-size: .95rem;
      margin: 5px 0;
    }

    #asmaulHusna .asma-hausa {
      font-size: .9rem;
      opacity: .85;
      margin: 5px 0 12px;
    }

    #asmaulHusna .asma-speak {
      border: 0;
      border-radius: 20px;
      padding: 9px 15px;
      background: var(--navy, #263b91);
      color: white;
      cursor: pointer;
      font-size: .9rem;
    }

    #asmaulHusna .asma-count {
      text-align: center;
      font-weight: bold;
      margin: 12px 0;
    }

    #asmaulHusna .asma-empty {
      text-align: center;
      padding: 20px;
    }

    /* Keep the 99 Names in exactly two columns on phones and larger screens. */
    @media (max-width: 480px) {
      #asmaHusnaGrid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      #asmaulHusna .asma-card {
        min-width: 0;
        padding: 9px 6px;
        overflow-wrap: anywhere;
      }
      #asmaulHusna .asma-arabic {
        font-size: clamp(1.35rem, 6vw, 1.8rem);
      }
      #asmaulHusna .asma-translit {
        font-size: .88rem;
      }
      #asmaulHusna .asma-meaning,
      #asmaulHusna .asma-hausa {
        font-size: .78rem;
        line-height: 1.5;
      }
      #asmaulHusna .asma-speak {
        padding: 7px 9px;
        font-size: .78rem;
      }
    }
  `;

  document.head.appendChild(style);
})();

/* ---------- RENDER NAMES ---------- */

function renderAsmaulHusna(searchTerm = "") {
  const panel = document.getElementById("asmaulHusna");
  if (!panel) return;

  const query = searchTerm.trim().toLowerCase();

  const filtered = asmaulHusnaNames
    .map((name, index) => ({ name, index }))
    .filter(({ name }) => {
      return name.join(" ").toLowerCase().includes(query);
    });

  panel.innerHTML = `
    <div class="card asma-heading">
      <div class="asma-arabic-title" dir="rtl">
        أَسْمَاءُ اللَّهِ الْحُسْنَى
      </div>
      <h2>🌟 Asma'ul Husna</h2>
      <p>The 99 Beautiful Names of Allah</p>
      <p>Sunayen Allah Masu Kyau 99</p>
      <p dir="rtl">وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ</p>
      <p><small>Surah Al-A'raf 7:180</small></p>
    </div>

    <div class="card">
      <h3>🔎 Find a Name / Nemi Suna</h3>
      <input
        id="asmaSearch"
        class="asma-search"
        type="search"
        placeholder="Search Arabic, English or Hausa..."
        aria-label="Search the Names of Allah"
      />

      <p class="asma-count" id="asmaCount">
        Showing ${filtered.length} of 99 names
      </p>

      <div id="asmaHusnaGrid"></div>
    </div>

    <div class="card">
      <p><strong>Learning note:</strong></p>
      <p>Learn the names, understand their meanings and call upon Allah by His beautiful names.</p>
      <p>Ka koyi sunayen, ka fahimci ma'anarsu, kuma ka roƙi Allah da su.</p>
      <p><small>Pronunciation uses your device's speech service. It is not a recording of Sheikh Mishary Alafasy.</small></p>
    </div>
  `;

  const grid = document.getElementById("asmaHusnaGrid");

  if (filtered.length === 0) {
    grid.innerHTML = `
      <p class="asma-empty">
        No names found. Try another search.
        <br />
        Ba a sami wannan suna ba. Gwada wani bincike.
      </p>
    `;
  } else {
    filtered.forEach(({ name, index }) => {
      const [arabic, transliteration, english, hausa] = name;

      const card = document.createElement("article");
      card.className = "asma-card";

      const number = document.createElement("div");
      number.className = "asma-number";
      number.textContent = index + 1;

      const arabicText = document.createElement("div");
      arabicText.className = "asma-arabic";
      arabicText.dir = "rtl";
      arabicText.textContent = arabic;

      const translit = document.createElement("div");
      translit.className = "asma-translit";
      translit.textContent = transliteration;

      const meaning = document.createElement("p");
      meaning.className = "asma-meaning";
      meaning.textContent = english;

      const hausaMeaning = document.createElement("p");
      hausaMeaning.className = "asma-hausa";
      hausaMeaning.textContent = hausa;

      const speakButton = document.createElement("button");
      speakButton.type = "button";
      speakButton.className = "asma-speak";
      speakButton.textContent = "🔊 Listen";
      speakButton.setAttribute(
        "aria-label",
        "Listen to " + transliteration
      );

      speakButton.addEventListener("click", () => {
        speakAsmaName(arabic, transliteration);
      });

      card.append(
        number,
        arabicText,
        translit,
        meaning,
        hausaMeaning,
        speakButton
      );

      grid.appendChild(card);
    });
  }

  const searchInput = document.getElementById("asmaSearch");

  searchInput.addEventListener("input", function () {
    const currentValue = this.value;
    renderAsmaulHusna(currentValue);

    const newInput = document.getElementById("asmaSearch");
    newInput.focus();
    newInput.setSelectionRange(
      currentValue.length,
      currentValue.length
    );
  });
}

/* ---------- PRONUNCIATION ---------- */

function speakAsmaName(arabic, transliteration) {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, speech is not supported by this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(arabic);
  speech.lang = "ar-SA";
  speech.rate = 0.75;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

/* ---------- INITIALIZE ---------- */

function initializeAsmaulHusna() {
  if (!document.getElementById("asmaulHusna")) return;

  if (asmaulHusnaNames.length !== 99) {
    console.error(
      "Asma'ul Husna data error: expected 99 names."
    );
    return;
  }

  renderAsmaulHusna();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeAsmaulHusna
  );
} else {
  initializeAsmaulHusna();
   }
    

/* =====================================
   DAILY ASMA'UL HUSNA CHALLENGE
===================================== */

(function setupDailyAsmaChallenge() {
  const originalRender = renderAsmaulHusna;

  const dateKey = () => {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  };

  function getDailyNames() {
    const start = Math.floor(
      (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) -
      new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );

    const first = ((start - 1) * 3) % 99;

    return [0, 1, 2].map(i => (first + i) % 99);
  }

  function getProgress() {
    const key = "lml_asma_daily_" + dateKey();

    try {
      return JSON.parse(localStorage.getItem(key)) || {
        completed: [],
        rewarded: false
      };
    } catch {
      return { completed: [], rewarded: false };
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(
      "lml_asma_daily_" + dateKey(),
      JSON.stringify(progress)
    );
  }

  function addDailyChallenge() {
    const panel = document.getElementById("asmaulHusna");
    if (!panel) return;

    const names = getDailyNames();
    const progress = getProgress();

    const card = document.createElement("div");
    card.className = "card";
    card.id = "dailyAsmaChallenge";

    const heading = document.createElement("h2");
    heading.textContent = "🎯 Daily Challenge";

    const instruction = document.createElement("p");
    instruction.textContent =
      "Learn these 3 Names of Allah today. Tick each one when you have learned it.";

    const hausa = document.createElement("p");
    hausa.textContent =
      "Ka koyi wadannan sunayen Allah guda 3 yau. Yi alama idan ka koyi kowanne.";

    const list = document.createElement("div");
    list.style.marginTop = "12px";

    names.forEach(index => {
      const name = asmaulHusnaNames[index];
      const item = document.createElement("label");

      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "10px";
      item.style.padding = "12px";
      item.style.margin = "8px 0";
      item.style.borderRadius = "10px";
      item.style.background = "var(--bg, #f3f5ff)";
      item.style.cursor = "pointer";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = progress.completed.includes(index);
      checkbox.disabled = progress.rewarded;

      const details = document.createElement("span");
      details.innerHTML = "";

      const arabic = document.createElement("strong");
      arabic.textContent = name[0] + " ";

      const transliteration = document.createElement("span");
      transliteration.textContent = name[1];

      const meaning = document.createElement("small");
      meaning.textContent = name[2] + " / " + name[3];
      meaning.style.display = "block";
      meaning.style.opacity = ".8";

      details.append(arabic, transliteration, meaning);
      item.append(checkbox, details);
      list.appendChild(item);

      checkbox.addEventListener("change", () => {
        const current = getProgress();

        if (checkbox.checked) {
          if (!current.completed.includes(index)) {
            current.completed.push(index);
          }
        } else {
          current.completed = current.completed.filter(
            n => n !== index
          );
        }

        if (
          current.completed.length === 3 &&
          !current.rewarded
        ) {
          current.rewarded = true;
          saveProgress(current);

          if (typeof addStars === "function") {
            addStars(1);
          }

          alert("Masha Allah! You completed today's challenge and earned 1 star!");
        } else {
          saveProgress(current);
        }

        addDailyChallenge();
      });
    });

    const status = document.createElement("p");
    status.id = "dailyAsmaStatus";
    status.style.fontWeight = "bold";
    status.style.textAlign = "center";

    if (progress.rewarded) {
      status.textContent = "🏆 Completed! You earned 1 star today. Masha Allah!";
    } else {
      status.textContent =
        "Progress: " + progress.completed.length + " / 3 completed";
    }

    card.append(heading, instruction, hausa, list, status);

    const existing = document.getElementById("dailyAsmaChallenge");
    if (existing) existing.remove();

    const searchCard = panel.querySelector("#asmaSearch")?.closest(".card");

    if (searchCard) {
      panel.insertBefore(card, searchCard);
    } else {
      panel.appendChild(card);
    }
  }

  renderAsmaulHusna = function(searchTerm = "") {
    originalRender(searchTerm);
    addDailyChallenge();
  };

  renderAsmaulHusna();
})();
      
