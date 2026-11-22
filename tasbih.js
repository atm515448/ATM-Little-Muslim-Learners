/* ATM Little Muslim Learners — Daily Tasbih & Dhikr
   Counts are stored locally on the learner's device.
   Established counts are distinguished from optional personal tracking. */
"use strict";

(function () {
  const list = [
    {id:"subhan", category:"After Salah", ar:"سُبْحَانَ اللَّهِ", tr:"SubhanAllah", en:"Glory be to Allah.", ha:"Tsarki ya tabbata ga Allah.", target:33, countNote:"33 after Salah"},
    {id:"alham", category:"After Salah", ar:"الْحَمْدُ لِلَّهِ", tr:"Alhamdulillah", en:"All praise belongs to Allah.", ha:"Dukkan yabo ya tabbata ga Allah.", target:33, countNote:"33 after Salah"},
    {id:"akbar", category:"After Salah", ar:"اللَّهُ أَكْبَرُ", tr:"Allahu Akbar", en:"Allah is the Greatest.", ha:"Allah ne Mafi girma.", target:34, countNote:"34 after Salah"},
    {id:"tahlil", category:"Tahleel", ar:"لَا إِلَٰهَ إِلَّا اللَّهُ", tr:"La ilaha illallah", en:"There is no deity worthy of worship except Allah.", ha:"Babu abin bautawa da gaskiya sai Allah.", target:null, countNote:"No fixed count shown"},
    {id:"istighfar", category:"Istighfar", ar:"أَسْتَغْفِرُ اللَّهَ", tr:"Astaghfirullah", en:"I seek Allah's forgiveness.", ha:"Ina neman gafarar Allah.", target:null, countNote:"Count freely"},
    {id:"subhan100", category:"Daily Dhikr", ar:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", tr:"SubhanAllahi wa bihamdihi", en:"Glory and praise be to Allah.", ha:"Tsarki da yabo sun tabbata ga Allah.", target:100, countNote:"100 daily"},
    {id:"hawqala", category:"Daily Dhikr", ar:"لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", tr:"La hawla wa la quwwata illa billah", en:"There is no power nor strength except through Allah.", ha:"Babu dabara ko ƙarfi sai da taimakon Allah.", target:null, countNote:"Count freely"},
    {id:"salawat", category:"Salawat", ar:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", tr:"Allahumma salli ala Muhammad", en:"O Allah, send blessings upon Muhammad.", ha:"Ya Allah, Ka yi salati ga Annabi Muhammad.", target:null, countNote:"Count freely"},
    {id:"tahlilfull", category:"Tahleel", ar:"لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", tr:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay'in qadir", en:"None has the right to be worshipped except Allah alone, without partner. His is the dominion and praise, and He has power over all things.", ha:"Babu abin bautawa da gaskiya sai Allah Shi kaɗai, ba Shi da abokin tarayya. Mulki da yabo nasa ne, kuma Shi Mai iko ne a kan kome.", target:100, countNote:"100 times in a day"},
    {id:"tasbihgreat", category:"Daily Dhikr", ar:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ", tr:"SubhanAllahi wa bihamdihi, SubhanAllahil-Adheem", en:"Glory and praise be to Allah; glory be to Allah, the Magnificent.", ha:"Tsarki da yabo sun tabbata ga Allah; tsarki ya tabbata ga Allah Mai girma.", target:null, countNote:"Count freely"},
    {id:"rabbighfir", category:"Istighfar", ar:"رَبِّ اغْفِرْ لِي", tr:"Rabbighfir li", en:"My Lord, forgive me.", ha:"Ya Ubangijina, Ka gafarta mini.", target:null, countNote:"Count freely"},
    {id:"bismillahmorning", category:"Morning & Evening", ar:"بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", tr:"Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-Alim", en:"In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.", ha:"Da sunan Allah, wanda babu abin da zai cutar tare da sunansa a doron ƙasa ko a sama. Shi ne Mai ji, Masani.", target:3, countNote:"3 times in the morning and evening"},
    {id:"raditu", category:"Morning & Evening", ar:"رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا", tr:"Raditu billahi Rabban, wa bil-Islami dinan, wa bi-Muhammadin nabiyya", en:"I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet.", ha:"Na yarda da Allah a matsayin Ubangijina, Musulunci a matsayin addinina, da Muhammad a matsayin Annabina.", target:3, countNote:"3 times in the morning and evening"},
    {id:"aoodhu", category:"Morning & Evening", ar:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", tr:"A'udhu bi kalimatillahit-tammati min sharri ma khalaq", en:"I seek refuge in the perfect words of Allah from the evil of what He has created.", ha:"Ina neman tsari da kalmomin Allah cikakku daga sharrin abin da Ya halitta.", target:3, countNote:"3 times in the evening"},
    {id:"hasbi", category:"Trust in Allah", ar:"حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", tr:"Hasbunallahu wa ni'mal-wakeel", en:"Allah is sufficient for us, and He is the best disposer of affairs.", ha:"Allah Ya ishe mu, kuma Shi ne Mafi kyawun wakili.", target:null, countNote:"Count freely"}
  ];

  const countsKey = "lml_tasbih_counts";
  const dailyKey = "lml_tasbih_daily";
  const customKey = "lml_tasbih_custom";
  const $ = id => document.getElementById(id);
  const today = new Date().toLocaleDateString("en-CA");
  let counts = {};
  let daily = {};
  let custom = [];

  try { counts = JSON.parse(localStorage.getItem(countsKey) || "{}"); } catch(e) {}
  try { daily = JSON.parse(localStorage.getItem(dailyKey) || "{}"); } catch(e) {}
  try { custom = JSON.parse(localStorage.getItem(customKey) || "[]"); } catch(e) {}
  if (!daily || daily.date !== today) daily = {date:today, counts:{}};
  if (!daily.counts) daily.counts = {};

  function save() {
    try {
      localStorage.setItem(countsKey, JSON.stringify(counts));
      localStorage.setItem(dailyKey, JSON.stringify(daily));
      localStorage.setItem(customKey, JSON.stringify(custom));
    } catch(e) {}
  }

  function totalToday() {
    const total = Object.values(daily.counts || {}).reduce((sum,n)=>sum+(Number(n)||0),0);
    const el=$("dailyTasbihTotal"); if(el) el.textContent=total;
  }

  function card(item, isCustom) {
    const count=Number(counts[item.id])||0;
    const target=item.target;
    const progress=target ? `<progress class="tasbih-progress" value="${Math.min(count,target)}" max="${target}"></progress>` : "";
    const note=item.countNote || "Personal counter";
    return `<article class="card tasbih-card">
      <p class="tasbih-category">${item.category || "Custom Dhikr"}</p>
      <h3 class="arabic" lang="ar" dir="rtl">${item.ar || ""}</h3>
      <p class="translit">${escapeHTML(item.tr || item.name || "")}</p>
      ${item.en ? `<p class="meaning">${escapeHTML(item.en)}</p>` : ""}
      ${item.ha ? `<p class="meaning">${escapeHTML(item.ha)}</p>` : ""}
      <p class="counter" id="count-${item.id}" aria-live="polite">${count}${target ? " / "+target : ""}</p>
      ${progress}
      <p class="meaning tasbih-note">${escapeHTML(note)}</p>
      <button class="tasbih-circle" type="button" data-count="${item.id}" aria-label="Count ${escapeHTML(item.tr || item.name || "dhikr")}">
        <span>＋</span><strong>TAP</strong><small>COUNT</small>
      </button>
      <div class="btn-row"><button class="btn alt" type="button" data-reset="${item.id}">Reset</button>${isCustom ? `<button class="btn alt" type="button" data-delete="${item.id}">Remove</button>` : ""}</div>
    </article>`;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  function render() {
    const box=$("tasbihCollection"); if(!box) return;
    const groups = [...new Set(list.map(x=>x.category))];
    box.innerHTML = groups.map(group => `<div class="tasbih-group"><h3>${escapeHTML(group)}</h3><div class="tasbih-grid">${list.filter(x=>x.category===group).map(x=>card(x,false)).join("")}</div></div>`).join("");
    if(custom.length) box.innerHTML += `<div class="tasbih-group"><h3>Your Custom Dhikr</h3><div class="tasbih-grid">${custom.map(x=>card(x,true)).join("")}</div></div>`;
    box.querySelectorAll("[data-count]").forEach(btn=>btn.addEventListener("click",()=>increment(btn.dataset.count)));
    box.querySelectorAll("[data-reset]").forEach(btn=>btn.addEventListener("click",()=>reset(btn.dataset.reset)));
    box.querySelectorAll("[data-delete]").forEach(btn=>btn.addEventListener("click",()=>{custom=custom.filter(x=>x.id!==btn.dataset.delete); delete counts[btn.dataset.delete]; delete daily.counts[btn.dataset.delete]; save(); render();}));
    totalToday();
  }

  function increment(id) {
    counts[id]=(Number(counts[id])||0)+1;
    daily.counts[id]=(Number(daily.counts[id])||0)+1;
    save();
    const el=$("count-"+id);
    if(el) {
      const item=list.find(x=>x.id===id)||custom.find(x=>x.id===id);
      el.textContent=counts[id]+(item && item.target ? " / "+item.target : "");
    }
    const cardEl=el && el.closest(".tasbih-card");
    const progress=cardEl && cardEl.querySelector("progress");
    const item=list.find(x=>x.id===id)||custom.find(x=>x.id===id);
    if(progress && item && item.target) progress.value=Math.min(counts[id],item.target);
    totalToday();
    if(navigator.vibrate) navigator.vibrate(25);
  }

  function reset(id) {
    counts[id]=0;
    daily.counts[id]=0;
    save();
    render();
  }

  $("addCustomDhikr")?.addEventListener("click",()=>{
    const input=$("customDhikrText");
    const name=(input && input.value || "").trim();
    if(!name) { alert("Please enter a dhikr name."); return; }
    custom.push({id:"custom-"+Date.now(),name:name,tr:name,category:"Custom Dhikr",countNote:"Personal counter"});
    if(input) input.value="";
    save(); render();
  });

  render();
  totalToday();
})();
