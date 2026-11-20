
"use strict";

(() => {
  const panel = document.getElementById("harakatPractice");
  if (!panel) return;

  const questions = [
    {
      sound: "Fatha",
      letter: "بَ",
      answer: "بَ",
      options: ["بِ", "بَ", "بُ"],
      example: "بَابٌ",
      reading: "Baabun"
    },
    {
      sound: "Kasra",
      letter: "بِ",
      answer: "بِ",
      options: ["بُ", "بْ", "بِ"],
      example: "بِسْمِ",
      reading: "Bismi"
    },
    {
      sound: "Damma",
      letter: "بُ",
      answer: "بُ",
      options: ["بَ", "بُ", "بِ"],
      example: "بُرْجٌ",
      reading: "Burjun"
    },
    {
      sound: "Sukun",
      letter: "بْ",
      answer: "بْ",
      options: ["بْ", "بَ", "بُ"],
      example: "بَحْرٌ",
      reading: "Baḥrun"
    }
  ];

  let current = 0;
  let practiceStars = 0;
  let answered = false;

  function getTotalStars() {
    try {
      return Number(localStorage.getItem("lml_stars") || 0);
    } catch (e) {
      return 0;
    }
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      alert("Audio is not supported by this browser.");
      return;
    }

    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = "ar-SA";
    voice.rate = 0.75;
    speechSynthesis.speak(voice);
  }

  function render() {
    const q = questions[current];

    panel.innerHTML = `
      <div class="card">
        <h2>🎯 Harakat Practice</h2>
        <p>Listen, learn and practise Arabic sounds.</p>

        <div class="practice-progress-card">
          <h3>⭐ Your Total Stars: <span id="practiceTotalStars">${getTotalStars()}</span></h3>
          <p>Question ${current + 1} of ${questions.length}</p>
          <div class="progress">
            <div style="width:${((current + 1) / questions.length) * 100}%"></div>
          </div>
        </div>

        <div class="card practice-section">
          <h3>🔊 Listen and Repeat</h3>
          <div class="practice-arabic">${q.letter}</div>
          <p class="practice-label">${q.sound}</p>
          <button class="btn" id="listenSound">🔊 Listen to Sound</button>
          <p>Listen carefully and repeat aloud.</p>
        </div>

        <div class="card practice-section">
          <h3>📖 Example Word</h3>
          <div class="practice-arabic">${q.example}</div>
          <p>Reading: ${q.reading}</p>
          <button class="btn alt" id="listenExample">🔊 Listen to Example</button>
        </div>

        <div class="card practice-section">
          <h3>🎯 Choose the Correct Sound</h3>
          <p>Which symbol is ${q.sound}?</p>

          <div class="practice-options">
            ${q.options.map(option => `
              <button class="btn alt practice-option"
                data-answer="${option}">
                ${option}
              </button>
            `).join("")}
          </div>

          <p id="feedback" aria-live="polite"></p>

          <button class="btn" id="nextQuestion" disabled>
            Next Question
          </button>
        </div>
      </div>
    `;

    document.getElementById("listenSound").onclick = () => speak(q.letter);
    document.getElementById("listenExample").onclick = () => speak(q.example);

    document.querySelectorAll(".practice-option").forEach(button => {
      button.onclick = () => checkAnswer(button.dataset.answer);
    });

    document.getElementById("nextQuestion").onclick = next;
  }

  function checkAnswer(answer) {
    if (answered) return;

    answered = true;

    const q = questions[current];
    const feedback = document.getElementById("feedback");
    const nextButton = document.getElementById("nextQuestion");

    if (answer === q.answer) {
      practiceStars++;

      // Add the earned star to the main app's shared total.
      if (typeof window.addStars === "function") {
        window.addStars(1);
      }

      document.getElementById("practiceTotalStars").textContent = getTotalStars();
      feedback.textContent = "⭐ Correct! Well done!";
    } else {
      feedback.textContent = "Try again next time! Keep practising.";
    }

    document.querySelectorAll(".practice-option").forEach(button => {
      button.disabled = true;

      if (button.dataset.answer === q.answer) {
        button.classList.add("correct");
      }
    });

    nextButton.disabled = false;
    nextButton.textContent =
      current === questions.length - 1
        ? "Finish Practice"
        : "Next Question";
  }

  function next() {
    if (!answered) return;

    if (current < questions.length - 1) {
      current++;
      answered = false;
      render();
    } else {
      showResult();
    }
  }

  function showResult() {
    panel.innerHTML = `
      <div class="card practice-result">
        <div class="emoji">🎉</div>
        <h2>Practice Completed!</h2>
        <h3>⭐ You earned ${practiceStars} out of ${questions.length} stars.</h3>
        <p>Your total stars: <strong>${getTotalStars()}</strong></p>
        <p>Keep practising your Arabic Harakat. Well done!</p>
        <button class="btn" id="restartPractice">
          🔄 Practise Again
        </button>
      </div>
    `;

    document.getElementById("restartPractice").onclick = () => {
      current = 0;
      practiceStars = 0;
      answered = false;
      render();
    };
  }

  render();
})();
    
