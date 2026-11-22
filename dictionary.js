/* ATM Little Muslim Learners — trilingual dictionary */
"use strict";
(function () {
  const $ = id => document.getElementById(id);
  const voiceChoices = { en: ["en", "en-US", "en-GB"], ha: ["ha", "ha-NG", "en-NG"], ar: ["ar", "ar-SA", "ar-EG"] };
  const dictionaryItems = typeof DICTIONARY_DATA !== "undefined" ? DICTIONARY_DATA : [];

  function availableVoices() {
    return ("speechSynthesis" in window) ? speechSynthesis.getVoices() : [];
  }
  function setupVoicePicker() {
    const picker = $("dictionaryVoice");
    if (!picker || !("speechSynthesis" in window)) return;
    const selected = picker.value || "auto";
    picker.innerHTML = '<option value="auto">Automatic voice</option>';
    availableVoices().forEach((voice, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = voice.name + " (" + voice.lang + ")";
      picker.appendChild(option);
    });
    picker.value = selected;
    if (!picker.value) picker.value = "auto";
  }
  function speakWord(text, lang) {
    if (!("speechSynthesis" in window)) {
      alert("Audio is not supported by this browser.");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = availableVoices();
    const picker = $("dictionaryVoice");
    const chosen = picker && picker.value !== "auto" ? voices[Number(picker.value)] : null;
    const prefs = voiceChoices[lang] || [lang];
    const voice = chosen || voices.find(v => prefs.some(p => v.lang.toLowerCase() === p.toLowerCase())) ||
      voices.find(v => v.lang.toLowerCase().startsWith(lang));
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang === "ha" ? "ha-NG" : lang === "ar" ? "ar-SA" : "en-US";
    }
    utterance.rate = lang === "ar" ? 0.72 : 0.86;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
  function makeWordCard(item) {
    const card = document.createElement("article");
    card.className = "dictionary-word card";
    const heading = document.createElement("div");
    heading.className = "dictionary-word-heading";
    const category = document.createElement("span");
    category.className = "dictionary-category";
    category.textContent = item.category || "General";
    heading.appendChild(category);
    card.appendChild(heading);
    [["English", item.en, "en"], ["Hausa", item.ha, "ha"], ["العربية", item.ar, "ar"]].forEach(row => {
      const line = document.createElement("div");
      line.className = "dictionary-language";
      const label = document.createElement("span");
      label.className = "dictionary-language-label";
      label.textContent = row[0];
      const value = document.createElement("strong");
      value.textContent = row[1] || "—";
      if (row[2] === "ar") {
        value.dir = "rtl";
        value.classList.add("dictionary-arabic");
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dictionary-speak";
      button.textContent = "🔊";
      button.setAttribute("aria-label", "Listen to " + row[0] + " pronunciation");
      button.addEventListener("click", () => speakWord(row[1] || "", row[2]));
      line.append(label, value, button);
      card.appendChild(line);
    });
    return card;
  }
  function render() {
    const search = ($("dictionarySearch").value || "").trim().toLocaleLowerCase();
    const category = $("dictionaryCategory").value;
    const matches = (Array.isArray(dictionaryItems) ? dictionaryItems : []).filter(item => {
      const text = [item.en, item.ha, item.ar, item.category].join(" ").toLocaleLowerCase();
      return (!search || text.includes(search)) && (!category || item.category === category);
    });
    const results = $("dictionaryResults");
    results.replaceChildren();
    $("dictionaryCount").textContent = matches.length + " words";
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "dictionary-empty";
      empty.textContent = "No matching words found. Try another search.";
      results.appendChild(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    matches.forEach(item => fragment.appendChild(makeWordCard(item)));
    results.appendChild(fragment);
  }
  function init() {
    if (!$("dictionaryResults") || !Array.isArray(dictionaryItems)) return;
    const categories = [...new Set(dictionaryItems.map(item => item.category).filter(Boolean))].sort();
    categories.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      $("dictionaryCategory").appendChild(option);
    });
    $("dictionarySearch").addEventListener("input", render);
    $("dictionaryCategory").addEventListener("change", render);
    setupVoicePicker();
    if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = setupVoicePicker;
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
