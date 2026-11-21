
/* ATM Little Muslim Learners
   Hisnul Muslim — Fortress of the Muslim
   Compiler: Sa'id ibn Ali ibn Wahf al-Qahtani

   Master edition: deen2u
   Contents: 132 chapters, 267 readings

   This file is separate from data.js.
   Add verified chapters in their original book order.
*/

"use strict";

const HISNUL_MUSLIM_INFO = {
  title: "Hisnul Muslim",
  arabicTitle: "حِصْنُ الْمُسْلِمِ",
  compiler: "Sa'id ibn Ali ibn Wahf al-Qahtani",
  totalChapters: 132,
  totalReadings: 267,
  sourceEdition: "deen2u English edition",
  sourceUrl: "https://deen2u.com/hisn-al-muslim/"
};

const HISNUL_MUSLIM_CHAPTERS = [
  {
    number: 1,
    title: {
      en: "When waking up",
      ha: "Addu'o'in lokacin farkawa daga barci",
      ar: "أذكار الاستيقاظ من النوم"
    },
    readingCount: 4,
    readings: []
  }
];

// Keep track of how many readings have been added.
function getHisnulMuslimProgress() {
  return {
    totalChapters: HISNUL_MUSLIM_INFO.totalChapters,
    totalReadings: HISNUL_MUSLIM_INFO.totalReadings,
    chaptersAdded: HISNUL_MUSLIM_CHAPTERS.length,
    readingsAdded: HISNUL_MUSLIM_CHAPTERS.reduce(
      (total, chapter) => total + chapter.readings.length,
      0
    )
  };
}
