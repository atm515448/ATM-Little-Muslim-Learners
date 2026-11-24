/* Plays one recording at a time. Starting a recording (Quran, Hadith, Azkar, reminders, Adhan) stops the one that is playing. */
"use strict";
(function () {
  const playing = new Set();
  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    playing.forEach(other => {
      if (other !== this) {
        try { other.pause(); } catch (_) {}
      }
    });
    playing.add(this);
    if (!this._lmlOneAudio) {
      this._lmlOneAudio = true;
      const done = () => playing.delete(this);
      this.addEventListener("pause", done);
      this.addEventListener("ended", done);
    }
    return originalPlay.apply(this, arguments);
  };
})();
