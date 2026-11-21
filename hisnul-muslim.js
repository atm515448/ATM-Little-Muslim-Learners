
/* ATM Little Muslim Learners
   Hisnul Muslim — Fortress of the Muslim
   Compiler: Sa'id ibn Ali ibn Wahf al-Qahtani

   Master reference: deen2u English edition
   132 chapters | 267 readings
*/

"use strict";

const HISNUL_MUSLIM_INFO = {
  title: "Hisnul Muslim",
  arabicTitle: "حِصْنُ الْمُسْلِمِ",
  compiler: "Sa'id ibn Ali ibn Wahf al-Qahtani",
  totalChapters: 132,
  totalReadings: 267,
  sourceEdition: "deen2u English edition",
  sourceUrl: "https://deen2u.com/hisn-al-muslim/",
  currentChapter: 1
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

    readings: [
      {
        id: 1,

        title: {
          en: "Praise Allah after waking up",
          ha: "Godiya ga Allah bayan farkawa",
          ar: "حمد الله عند الاستيقاظ"
        },

        arabic:
          "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",

        transliteration:
          "Al-hamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",

        meaning: {
          en: "All praise is for Allah, who gave us life after He had caused us to die, and to Him is the resurrection.",

          ha: "Dukkan godiya ta tabbata ga Allah, Wanda Ya raya mu bayan Ya sa mun mutu (ta barci), kuma zuwa gare Shi ne tashin kiyama.",

          ar: "الثناء الكامل لله الذي أحيانا بعد النوم، وإليه البعث يوم القيامة."
        },

        count: 1,

        reference: [
          "Sahih al-Bukhari 6312",
          "Sahih al-Bukhari 6324",
          "Sahih Muslim"
        ],

        grading: "Sahih",

        notes: {
          en: "A supplication said when waking from sleep.",
          ha: "Ana karanta wannan addu'a lokacin farkawa daga barci.",
          ar: "يقال هذا الذكر عند الاستيقاظ من النوم."
        }
      },

      {
        id: 2,

        title: {
          en: "Remembrance when waking during the night",
          ha: "Zikiri idan mutum ya farka da dare",
          ar: "ذكر من تعار من الليل"
        },

        arabic:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ، رَبِّ اغْفِرْ لِي",

        transliteration:
          "La ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamdu, wahuwa 'ala kulli shay'in qadir. Subhanallah, wal-hamdu lillah, wala ilaha illallah, wallahu akbar, wala hawla wala quwwata illa billahil-'aliyyil-'azim. Rabbighfir li.",

        meaning: {
          en: "There is no deity worthy of worship except Allah alone, without partner. His is the dominion and His is all praise, and He has power over all things. Glory be to Allah; all praise is for Allah; there is no deity worthy of worship except Allah; Allah is the Greatest. There is no might nor power except through Allah, the Most High, the Magnificent. My Lord, forgive me.",

          ha: "Babu abin bautawa da gaskiya sai Allah Shi kadai, ba Shi da abokin tarayya. Mulki nasa ne, kuma godiya tasa ce, kuma Shi Mai iko ne a kan komai. Tsarki ya tabbata ga Allah; godiya ta tabbata ga Allah; babu abin bautawa da gaskiya sai Allah; Allah ne Mafi Girma. Babu dabara ko karfi sai da Allah, Maɗaukaki, Mai girma. Ya Ubangijina, Ka gafarta mini.",

          ar: "لا معبود بحق إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، تنزيه لله وحمد له وتكبير واستغفار."
        },

        count: 1,

        reference: [
          "Sunan Ibn Majah 3878",
          "Sahih al-Bukhari 1154 (similar wording)"
        ],

        grading: "Sahih",

        notes: {
          en: "For someone who wakes during the night.",
          ha: "Ga wanda ya farka daga barci a cikin dare.",
          ar: "يقال عند الاستيقاظ في الليل."
        }
      },

      {
        id: 3,

        title: {
          en: "Praise Allah for restoring health",
          ha: "Godiya ga Allah saboda dawo da lafiya",
          ar: "الحمد لله الذي عافاني في جسدي"
        },

        arabic:
          "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ",

        transliteration:
          "Al-hamdu lillahil-ladhi 'afani fi jasadi, waradda 'alayya ruhi, wa adhina li bidhikrih.",

        meaning: {
          en: "All praise is for Allah, who restored my body to health, returned my soul to me, and permitted me to remember Him.",

          ha: "Dukkan godiya ta tabbata ga Allah, Wanda Ya ba jikina lafiya, Ya dawo mini da raina, kuma Ya ba ni damar ambatonSa.",

          ar: "الحمد لله الذي أعاد إليّ عافيتي وروحي وأذن لي بذكره."
        },

        count: 1,

        reference: [
          "Jami' at-Tirmidhi 3401"
        ],

        grading: "Hasan",

        notes: {
          en: "A remembrance said after waking up.",
          ha: "Zikiri ne da ake yi bayan farkawa daga barci.",
          ar: "من أذكار الاستيقاظ."
        }
      },

      {
        id: 4,

        title: {
          en: "The closing verses of Surah Aal-Imran",
          ha: "Ayoyin karshen Suratul Ali-Imran",
          ar: "خواتيم سورة آل عمران"
        },

        arabic:
          "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ ۝١٩٠ الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ ۝١٩١ رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ وَمَا لِلظَّالِمِينَ مِنْ أَنْصَارٍ ۝١٩٢ رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ ۝١٩٣ رَبَّنَا وَآتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ ۝١٩٤ فَاسْتَجَابَ لَهُمْ رَبُّهُمْ أَنِّي لَا أُضِيعُ عَمَلَ عَامِلٍ مِنكُم مِّن ذَكَرٍ أَوْ أُنثَىٰ بَعْضُكُم مِّن بَعْضٍ فَالَّذِينَ هَاجَرُوا وَأُخْرِجُوا مِن دِيَارِهِمْ وَأُوذُوا فِي سَبِيلِي وَقَاتَلُوا وَقُتِلُوا لَأُكَفِّرَنَّ عَنْهُمْ سَيِّئَاتِهِمْ وَلَأُدْخِلَنَّهُمْ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ ثَوَابًا مِّنْ عِندِ اللَّهِ وَاللَّهُ عِندَهُ حُسْنُ الثَّوَابِ ۝١٩٥ لَا يَغُرَّنَّكَ تَقَلُّبُ الَّذِينَ كَفَرُوا فِي الْبِلَادِ ۝١٩٦ مَتَاعٌ قَلِيلٌ ثُمَّ مَأْوَاهُمْ جَهَنَّمُ وَبِئْسَ الْمِهَادُ ۝١٩٧ لَٰكِنِ الَّذِينَ اتَّقَوْا رَبَّهُمْ لَهُمْ جَنَّاتٌ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا نُزُلًا مِّنْ عِندِ اللَّهِ وَمَا عِندَ اللَّهِ خَيْرٌ لِّلْأَبْرَارِ ۝١٩٨ وَإِنَّ مِنْ أَهْلِ الْكِتَابِ لَمَن يُؤْمِنُ بِاللَّهِ وَمَا أُنزِلَ إِلَيْكُمْ وَمَا أُنزِلَ إِلَيْهِمْ خَاشِعِينَ لِلَّهِ لَا يَشْتَرُونَ بِآيَاتِ اللَّهِ ثَمَنًا قَلِيلًا أُولَٰئِكَ لَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ إِنَّ اللَّهَ سَرِيعُ الْحِسَابِ ۝١٩٩ يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ ۝٢٠٠",

        transliteration: null,

        meaning: {
          en: "Qur'an 3:190–200. These verses describe the signs of Allah in the creation of the heavens and earth, the remembrance of Allah, supplications for forgiveness and protection from the Fire, Allah's promise to reward the righteous, and the command to remain patient, steadfast and mindful of Him.",

          ha: "Al-Qur'ani 3:190–200. Ayoyin suna bayyana alamomin ikon Allah a cikin halittar sammai da kasa, ambaton Allah, addu'ar neman gafara da kariya daga azabar wuta, alkawarin Allah ga salihai, da umarnin yin hakuri, dauriya da tsoron Allah.",

          ar: "آيات من سورة آل عمران تتحدث عن التفكر في خلق الله، وذكره، والدعاء بالمغفرة والنجاة من النار، ووعد الله للمؤمنين، والأمر بالصبر والتقوى."
        },

        count: null,

        reference: [
          "Qur'an 3:190–200",
          "Sahih al-Bukhari 4571",
          "Sahih al-Bukhari 4569",
          "Sahih Muslim"
        ],

        grading: "Qur'an",

        notes: {
          en: "This is a complete Qur'anic passage. Read all eleven verses. A transliteration has not been added here because it should be checked against a reliable Qur'an recitation and text before publication.",

          ha: "Wannan cikakken sashe ne na Al-Qur'ani. A karanta ayoyi goma sha daya gaba daya. Ba a saka rubutun lafazi da haruffan Turanci ba tukuna, domin sai an tabbatar da shi daga ingantaccen rubutun Al-Qur'ani da karatun malami.",

          ar: "هذا مقطع كامل من القرآن الكريم، من الآية ١٩٠ إلى الآية ٢٠٠ من سورة آل عمران."
        }
      }
    ]
  }
];

// Progress information
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
         
