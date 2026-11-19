
"use strict";

(() => {
  const panel = document.getElementById("harakatPractice");

  if (!panel) return;

  const questions = [
    { sound: "Fatha", letter: "بَ", answer: "بَ", options: ["بِ", "بَ", "بُ"] },
    { sound: "Kasra", letter: "بِ", answer: "بِ", options: ["بُ", "بْ", "بِ"] },
    { sound: "Damma", letter: "بُ", answer: "بُ", options: ["بَ", "بُ", "بِ"] },
    { sound: "Sukun", letter: "بْ", answer: "بْ", options: ["بْ", "بَ", "بُ"] }
  ];

  let current = 0;
  let stars = 0;
  let answered = false;

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
        <p>Listen, learn and choose the correct Arabic sound.</p>

        <div class="card">
          <h3>⭐ Your Stars: ${stars}</h3>
          <p>Question ${current + 1} of ${questions.length}</p>
        </div>

        <div class="card">
          <h3>Listen and Repeat</h3>
          <div style="font-size:70px;text-align:center;margin:20px">
            ${q.letter}
          </div>
          <p style="text-align:center">${q.sound}</p>
          <button class="btn" id="listenSound">🔊 Listen</button>
          <p>Listen carefully and repeat the sound aloud.</p>
        </div>

        <div class="card">
          <h3>Choose the correct sound</h3>
          <p>Which symbol is ${q.sound}?</p>

          <div id="answerOptions">
            ${q.options.map(option => `
              <button class="btn alt practice-option"
                data-answer="${option}"
                style="font-size:30px;margin:5px">
                ${option}
              </button>
            `).join("")}
          </div>

          <p id="feedback" aria-live="polite"></p>
          <button class="btn" id="nextQuestion" disabled>
            ${current === questions.length - 1 ? "Finish Practice" : "Next Question"}
          </button>
        </div>
      </div>
    `;

    document.getElementById("listenSound").onclick = () => {
      speak(q.letter);
    };

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
      stars++;
      feedback.textContent = "⭐ Correct! Well done!";
    } else {
      feedback.textContent = "Try again next time! Listen carefully.";
    }

    document.querySelectorAll(".practice-option").forEach(button => {
      button.disabled = true;

      if (button.dataset.answer === q.answer) {
        button.style.border = "3px solid green";
      }
    });

    nextButton.disabled = false;
    nextButton.textContent =
      current === questions.length - 1 ? "Finish Practice" : "Next Question";
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
      <div class="card">
        <h2>🎉 Practice Completed!</h2>
        <h3>⭐ You earned ${stars} out of ${questions.length} stars.</h3>
        <p>Keep practising your Arabic Harakat. Well done!</p>
        <button class="btn" id="restartPractice">🔄 Practise Again</button>
      </div>
    `;

    document.getElementById("restartPractice").onclick = () => {
      current = 0;
      stars = 0;
      answered = false;
      render();
    };
  }

  render();
})();
  
