/* ATM Little Muslim Learners
   Trilingual Dictionary
   English - Hausa - Arabic
   ATM Digital Solutions & Services
*/

"use strict";

const DICTIONARY_DATA = [

  // =====================================
  // CATEGORY 1: ISLAMIC TERMS
  // =====================================

  { en: "Allah", ha: "Allah", ar: "اللّٰه", category: "Islamic Terms" },
  { en: "Islam", ha: "Musulunci", ar: "الإسلام", category: "Islamic Terms" },
  { en: "Muslim", ha: "Musulmi", ar: "مُسْلِم", category: "Islamic Terms" },
  { en: "Faith", ha: "Imani", ar: "إيمان", category: "Islamic Terms" },
  { en: "Prayer", ha: "Sallah", ar: "صلاة", category: "Islamic Terms" },
  { en: "Mosque", ha: "Masallaci", ar: "مسجد", category: "Islamic Terms" },
  { en: "Qur'an", ha: "Al-Qur'ani", ar: "القرآن", category: "Islamic Terms" },
  { en: "Prophet", ha: "Annabi", ar: "نبي", category: "Islamic Terms" },
  { en: "Messenger", ha: "Manzo", ar: "رسول", category: "Islamic Terms" },
  { en: "Angel", ha: "Mala'ika", ar: "مَلَك", category: "Islamic Terms" },
  { en: "Paradise", ha: "Aljanna", ar: "الجنة", category: "Islamic Terms" },
  { en: "Hellfire", ha: "Wuta", ar: "النار", category: "Islamic Terms" },
  { en: "Reward", ha: "Lada", ar: "ثواب", category: "Islamic Terms" },
  { en: "Sin", ha: "Zunubi", ar: "ذنب", category: "Islamic Terms" },
  { en: "Forgiveness", ha: "Gafara", ar: "مغفرة", category: "Islamic Terms" },
  { en: "Mercy", ha: "Rahama", ar: "رحمة", category: "Islamic Terms" },
  { en: "Blessing", ha: "Albarka", ar: "بركة", category: "Islamic Terms" },
  { en: "Supplication", ha: "Addu'a", ar: "دعاء", category: "Islamic Terms" },
  { en: "Charity", ha: "Sadaka", ar: "صدقة", category: "Islamic Terms" },
  { en: "Fasting", ha: "Azumi", ar: "صيام", category: "Islamic Terms" },
  { en: "Pilgrimage", ha: "Hajji", ar: "حج", category: "Islamic Terms" },
  { en: "Knowledge", ha: "Ilimi", ar: "علم", category: "Islamic Terms" },
  { en: "Patience", ha: "Hakuri", ar: "صبر", category: "Islamic Terms" },
  { en: "Gratitude", ha: "Godiya", ar: "شكر", category: "Islamic Terms" },
  { en: "Sincerity", ha: "Ikhlasi", ar: "إخلاص", category: "Islamic Terms" },

  // =====================================
  // CATEGORY 2: GREETINGS AND EXPRESSIONS
  // =====================================

  { en: "Peace be upon you", ha: "Assalamu alaikum", ar: "السلام عليكم", category: "Greetings" },
  { en: "And peace be upon you", ha: "Wa alaikumus salam", ar: "وعليكم السلام", category: "Greetings" },
  { en: "Good morning", ha: "Ina kwana", ar: "صباح الخير", category: "Greetings" },
  { en: "Good evening", ha: "Barka da yamma", ar: "مساء الخير", category: "Greetings" },
  { en: "Thank you", ha: "Na gode", ar: "شكراً", category: "Greetings" },
  { en: "Please", ha: "Don Allah", ar: "من فضلك", category: "Greetings" },
  { en: "Sorry", ha: "Yi hakuri", ar: "آسف", category: "Greetings" },
  { en: "Yes", ha: "Eh", ar: "نعم", category: "Greetings" },
  { en: "No", ha: "A'a", ar: "لا", category: "Greetings" },
  { en: "Welcome", ha: "Barka da zuwa", ar: "أهلاً وسهلاً", category: "Greetings" },
  { en: "Goodbye", ha: "Sai anjima", ar: "مع السلامة", category: "Greetings" },
  { en: "How are you?", ha: "Yaya kake?", ar: "كيف حالك؟", category: "Greetings" },
  { en: "I am fine", ha: "Lafiya lau", ar: "أنا بخير", category: "Greetings" },
  { en: "What is your name?", ha: "Menene sunanka?", ar: "ما اسمك؟", category: "Greetings" },
  { en: "My name is...", ha: "Sunana...", ar: "اسمي...", category: "Greetings" },

  // =====================================
  // CATEGORY 3: QUR'AN VOCABULARY
  // =====================================

  { en: "Book", ha: "Littafi", ar: "كتاب", category: "Qur'an Vocabulary" },
  { en: "Verse", ha: "Aya", ar: "آية", category: "Qur'an Vocabulary" },
  { en: "Chapter", ha: "Sura", ar: "سورة", category: "Qur'an Vocabulary" },
  { en: "Light", ha: "Haske", ar: "نور", category: "Qur'an Vocabulary" },
  { en: "Darkness", ha: "Duhu", ar: "ظلمات", category: "Qur'an Vocabulary" },
  { en: "Heaven", ha: "Sama", ar: "سماء", category: "Qur'an Vocabulary" },
  { en: "Earth", ha: "Kasa", ar: "أرض", category: "Qur'an Vocabulary" },
  { en: "Day", ha: "Rana", ar: "يوم", category: "Qur'an Vocabulary" },
  { en: "Night", ha: "Dare", ar: "ليل", category: "Qur'an Vocabulary" },
  { en: "Water", ha: "Ruwa", ar: "ماء", category: "Qur'an Vocabulary" },
  { en: "Fire", ha: "Wuta", ar: "نار", category: "Qur'an Vocabulary" },
  { en: "Heart", ha: "Zuciya", ar: "قلب", category: "Qur'an Vocabulary" },
  { en: "People", ha: "Mutane", ar: "ناس", category: "Qur'an Vocabulary" },
  { en: "Truth", ha: "Gaskiya", ar: "حق", category: "Qur'an Vocabulary" },
  { en: "Knowledge", ha: "Ilimi", ar: "علم", category: "Qur'an Vocabulary" }

  // =====================================
  // CATEGORY 4: HADITH VOCABULARY
  // =====================================

  { en: "Hadith", ha: "Hadisi", ar: "حديث", category: "Hadith Vocabulary" },
  { en: "Narration", ha: "Riwaya", ar: "رواية", category: "Hadith Vocabulary" },
  { en: "Companion", ha: "Sahabi", ar: "صحابي", category: "Hadith Vocabulary" },
  { en: "Character", ha: "Hali", ar: "خلق", category: "Hadith Vocabulary" },
  { en: "Honesty", ha: "Gaskiya", ar: "صدق", category: "Hadith Vocabulary" },
  { en: "Trust", ha: "Aminci", ar: "أمانة", category: "Hadith Vocabulary" },
  { en: "Kindness", ha: "Kyautatawa", ar: "إحسان", category: "Hadith Vocabulary" },
  { en: "Neighbour", ha: "Makwabci", ar: "جار", category: "Hadith Vocabulary" },
  { en: "Brother", ha: "Dan'uwa", ar: "أخ", category: "Hadith Vocabulary" },
  { en: "Sister", ha: "Yar'uwa", ar: "أخت", category: "Hadith Vocabulary" },
  { en: "Love", ha: "Soyayya", ar: "محبة", category: "Hadith Vocabulary" },
  { en: "Anger", ha: "Fushi", ar: "غضب", category: "Hadith Vocabulary" },
  { en: "Pride", ha: "Girman kai", ar: "كبر", category: "Hadith Vocabulary" },
  { en: "Humility", ha: "Tawali'u", ar: "تواضع", category: "Hadith Vocabulary" },
  { en: "Smile", ha: "Murmushi", ar: "ابتسامة", category: "Hadith Vocabulary" },

  // =====================================
  // CATEGORY 5: SALAH AND WUDU
  // =====================================

  { en: "Ablution", ha: "Alwala", ar: "وضوء", category: "Salah and Wudu" },
  { en: "Cleanliness", ha: "Tsafta", ar: "نظافة", category: "Salah and Wudu" },
  { en: "Water", ha: "Ruwa", ar: "ماء", category: "Salah and Wudu" },
  { en: "Face", ha: "Fuska", ar: "وجه", category: "Salah and Wudu" },
  { en: "Hand", ha: "Hannu", ar: "يد", category: "Salah and Wudu" },
  { en: "Head", ha: "Kai", ar: "رأس", category: "Salah and Wudu" },
  { en: "Foot", ha: "Kafa", ar: "قدم", category: "Salah and Wudu" },
  { en: "Prayer mat", ha: "Tabarma", ar: "سجادة الصلاة", category: "Salah and Wudu" },
  { en: "Prostration", ha: "Sujada", ar: "سجود", category: "Salah and Wudu" },
  { en: "Bowing", ha: "Ruku'u", ar: "ركوع", category: "Salah and Wudu" },
  { en: "Standing", ha: "Tsayuwa", ar: "قيام", category: "Salah and Wudu" },
  { en: "Direction of prayer", ha: "Alƙibla", ar: "قبلة", category: "Salah and Wudu" },
  { en: "Call to prayer", ha: "Kiran sallah", ar: "أذان", category: "Salah and Wudu" },
  { en: "Prayer leader", ha: "Limamin sallah", ar: "إمام", category: "Salah and Wudu" },
  { en: "Congregation", ha: "Jama'a", ar: "جماعة", category: "Salah and Wudu" },

  // =====================================
  // CATEGORY 6: FAMILY AND RELATIONSHIPS
  // =====================================

  { en: "Family", ha: "Iyali", ar: "عائلة", category: "Family" },
  { en: "Father", ha: "Uba", ar: "أب", category: "Family" },
  { en: "Mother", ha: "Uwa", ar: "أم", category: "Family" },
  { en: "Parent", ha: "Mahaifi", ar: "والد", category: "Family" },
  { en: "Son", ha: "Da", ar: "ابن", category: "Family" },
  { en: "Daughter", ha: "Yar", ar: "ابنة", category: "Family" },
  { en: "Child", ha: "Yaro", ar: "طفل", category: "Family" },
  { en: "Children", ha: "Yara", ar: "أطفال", category: "Family" },
  { en: "Husband", ha: "Miji", ar: "زوج", category: "Family" },
  { en: "Wife", ha: "Mata", ar: "زوجة", category: "Family" },
  { en: "Grandfather", ha: "Kaka", ar: "جد", category: "Family" },
  { en: "Grandmother", ha: "Kaka", ar: "جدة", category: "Family" },
  { en: "Uncle", ha: "Kawu", ar: "عم", category: "Family" },
  { en: "Aunt", ha: "Goggon uwa", ar: "عمة", category: "Family" },
  { en: "Friend", ha: "Aboki", ar: "صديق", category: "Family" },
  { en: "Teacher", ha: "Malami", ar: "معلم", category: "Family" },
  { en: "Student", ha: "Dalibi", ar: "طالب", category: "Family" },

  // =====================================
  // CATEGORY 7: HUMAN BODY
  // =====================================

  { en: "Body", ha: "Jiki", ar: "جسم", category: "Human Body" },
  { en: "Head", ha: "Kai", ar: "رأس", category: "Human Body" },
  { en: "Hair", ha: "Gashi", ar: "شعر", category: "Human Body" },
  { en: "Eye", ha: "Ido", ar: "عين", category: "Human Body" },
  { en: "Ear", ha: "Kunne", ar: "أذن", category: "Human Body" },
  { en: "Nose", ha: "Hanci", ar: "أنف", category: "Human Body" },
  { en: "Mouth", ha: "Baki", ar: "فم", category: "Human Body" },
  { en: "Tooth", ha: "Haƙori", ar: "سن", category: "Human Body" },
  { en: "Tongue", ha: "Harshe", ar: "لسان", category: "Human Body" },
  { en: "Neck", ha: "Wuya", ar: "رقبة", category: "Human Body" },
  { en: "Shoulder", ha: "Kafaɗa", ar: "كتف", category: "Human Body" },
  { en: "Arm", ha: "Hannu", ar: "ذراع", category: "Human Body" },
  { en: "Finger", ha: "Yatsa", ar: "إصبع", category: "Human Body" },
  { en: "Leg", ha: "Ƙafa", ar: "ساق", category: "Human Body" },
  { en: "Knee", ha: "Gwiwa", ar: "ركبة", category: "Human Body" },
  { en: "Heart", ha: "Zuciya", ar: "قلب", category: "Human Body" },
  { en: "Blood", ha: "Jini", ar: "دم", category: "Human Body" },
  { en: "Skin", ha: "Fata", ar: "جلد", category: "Human Body" },
  { en: "Back", ha: "Baya", ar: "ظهر", category: "Human Body" },
  { en: "Stomach", ha: "Ciki", ar: "بطن", category: "Human Body" },  

  // =====================================
  // CATEGORY 8: ANIMALS AND BIRDS
  // =====================================

  { en: "Animal", ha: "Dabba", ar: "حيوان", category: "Animals" },
  { en: "Cat", ha: "Mage", ar: "قط", category: "Animals" },
  { en: "Dog", ha: "Kare", ar: "كلب", category: "Animals" },
  { en: "Cow", ha: "Saniya", ar: "بقرة", category: "Animals" },
  { en: "Goat", ha: "Akuya", ar: "ماعز", category: "Animals" },
  { en: "Sheep", ha: "Tunkiya", ar: "خروف", category: "Animals" },
  { en: "Camel", ha: "Raƙumi", ar: "جمل", category: "Animals" },
  { en: "Horse", ha: "Doki", ar: "حصان", category: "Animals" },
  { en: "Lion", ha: "Zaki", ar: "أسد", category: "Animals" },
  { en: "Elephant", ha: "Giwa", ar: "فيل", category: "Animals" },
  { en: "Monkey", ha: "Biri", ar: "قرد", category: "Animals" },
  { en: "Rabbit", ha: "Zomo", ar: "أرنب", category: "Animals" },
  { en: "Bird", ha: "Tsuntsu", ar: "طائر", category: "Animals" },
  { en: "Chicken", ha: "Kaza", ar: "دجاجة", category: "Animals" },
  { en: "Duck", ha: "Agwagwa", ar: "بطة", category: "Animals" },
  { en: "Fish", ha: "Kifi", ar: "سمكة", category: "Animals" },
  { en: "Snake", ha: "Maciji", ar: "ثعبان", category: "Animals" },

  // =====================================
  // CATEGORY 9: FOOD AND DRINKS
  // =====================================

  { en: "Food", ha: "Abinci", ar: "طعام", category: "Food and Drinks" },
  { en: "Water", ha: "Ruwa", ar: "ماء", category: "Food and Drinks" },
  { en: "Milk", ha: "Madara", ar: "حليب", category: "Food and Drinks" },
  { en: "Bread", ha: "Gurasa", ar: "خبز", category: "Food and Drinks" },
  { en: "Rice", ha: "Shinkafa", ar: "أرز", category: "Food and Drinks" },
  { en: "Meat", ha: "Nama", ar: "لحم", category: "Food and Drinks" },
  { en: "Fish", ha: "Kifi", ar: "سمك", category: "Food and Drinks" },
  { en: "Egg", ha: "Kwai", ar: "بيضة", category: "Food and Drinks" },
  { en: "Salt", ha: "Gishiri", ar: "ملح", category: "Food and Drinks" },
  { en: "Sugar", ha: "Sukari", ar: "سكر", category: "Food and Drinks" },
  { en: "Oil", ha: "Mai", ar: "زيت", category: "Food and Drinks" },
  { en: "Honey", ha: "Zuma", ar: "عسل", category: "Food and Drinks" },
  { en: "Fruit", ha: "'Ya'yan itace", ar: "فاكهة", category: "Food and Drinks" },
  { en: "Apple", ha: "Tuffa", ar: "تفاح", category: "Food and Drinks" },
  { en: "Banana", ha: "Ayaba", ar: "موز", category: "Food and Drinks" },
  { en: "Orange", ha: "Lemu", ar: "برتقال", category: "Food and Drinks" },
  { en: "Date fruit", ha: "Dabino", ar: "تمر", category: "Food and Drinks" },

  // =====================================
  // CATEGORY 10: SCHOOL AND EDUCATION
  // =====================================

  { en: "School", ha: "Makaranta", ar: "مدرسة", category: "Education" },
  { en: "Classroom", ha: "Aji", ar: "فصل", category: "Education" },
  { en: "Book", ha: "Littafi", ar: "كتاب", category: "Education" },
  { en: "Pen", ha: "Alƙalami", ar: "قلم", category: "Education" },
  { en: "Pencil", ha: "Fensir", ar: "قلم رصاص", category: "Education" },
  { en: "Paper", ha: "Takarda", ar: "ورقة", category: "Education" },
  { en: "Desk", ha: "Teburi", ar: "مكتب", category: "Education" },
  { en: "Chair", ha: "Kujera", ar: "كرسي", category: "Education" },
  { en: "Lesson", ha: "Darasi", ar: "درس", category: "Education" },
  { en: "Question", ha: "Tambaya", ar: "سؤال", category: "Education" },
  { en: "Answer", ha: "Amsa", ar: "جواب", category: "Education" },
  { en: "Examination", ha: "Jarabawa", ar: "امتحان", category: "Education" },
  { en: "Computer", ha: "Kwamfuta", ar: "حاسوب", category: "Education" },
  { en: "Read", ha: "Karanta", ar: "اقرأ", category: "Education" },
  { en: "Write", ha: "Rubuta", ar: "اكتب", category: "Education" },
  { en: "Learn", ha: "Koyi", ar: "تعلّم", category: "Education" },

  // =====================================
  // CATEGORY 11: COLOURS AND SHAPES
  // =====================================

  { en: "Colour", ha: "Launi", ar: "لون", category: "Colours and Shapes" },
  { en: "White", ha: "Fari", ar: "أبيض", category: "Colours and Shapes" },
  { en: "Black", ha: "Baƙi", ar: "أسود", category: "Colours and Shapes" },
  { en: "Red", ha: "Ja", ar: "أحمر", category: "Colours and Shapes" },
  { en: "Green", ha: "Kore", ar: "أخضر", category: "Colours and Shapes" },
  { en: "Blue", ha: "Shuɗi", ar: "أزرق", category: "Colours and Shapes" },
  { en: "Yellow", ha: "Rawaya", ar: "أصفر", category: "Colours and Shapes" },
  { en: "Circle", ha: "Da'ira", ar: "دائرة", category: "Colours and Shapes" },
  { en: "Square", ha: "Murabba'i", ar: "مربع", category: "Colours and Shapes" },
  { en: "Triangle", ha: "Alwatika", ar: "مثلث", category: "Colours and Shapes" },
  { en: "Rectangle", ha: "Murabba'i mai tsawo", ar: "مستطيل", category: "Colours and Shapes" },

  // =====================================
  // CATEGORY 12: NATURE AND ENVIRONMENT
  // =====================================

  { en: "Sun", ha: "Rana", ar: "شمس", category: "Nature" },
  { en: "Moon", ha: "Wata", ar: "قمر", category: "Nature" },
  { en: "Star", ha: "Tauraro", ar: "نجم", category: "Nature" },
  { en: "Sky", ha: "Sama", ar: "سماء", category: "Nature" },
  { en: "Cloud", ha: "Girgije", ar: "سحابة", category: "Nature" },
  { en: "Rain", ha: "Ruwa sama", ar: "مطر", category: "Nature" },
  { en: "Wind", ha: "Iska", ar: "ريح", category: "Nature" },
  { en: "Tree", ha: "Itace", ar: "شجرة", category: "Nature" },
  { en: "Flower", ha: "Fure", ar: "زهرة", category: "Nature" },
  { en: "Mountain", ha: "Dutse", ar: "جبل", category: "Nature" },
  { en: "River", ha: "Kogi", ar: "نهر", category: "Nature" },
  { en: "Sea", ha: "Teku", ar: "بحر", category: "Nature" },
  { en: "Garden", ha: "Lambu", ar: "حديقة", category: "Nature" },

  // =====================================
  // CATEGORY 13: TIME AND NUMBERS
  // =====================================

  { en: "Time", ha: "Lokaci", ar: "وقت", category: "Time and Numbers" },
  { en: "Today", ha: "Yau", ar: "اليوم", category: "Time and Numbers" },
  { en: "Tomorrow", ha: "Gobe", ar: "غداً", category: "Time and Numbers" },
  { en: "Yesterday", ha: "Jiya", ar: "أمس", category: "Time and Numbers" },
  { en: "Morning", ha: "Safiya", ar: "صباح", category: "Time and Numbers" },
  { en: "Evening", ha: "Yamma", ar: "مساء", category: "Time and Numbers" },
  { en: "One", ha: "Daya", ar: "واحد", category: "Time and Numbers" },
  { en: "Two", ha: "Biyu", ar: "اثنان", category: "Time and Numbers" },
  { en: "Three", ha: "Uku", ar: "ثلاثة", category: "Time and Numbers" },
  { en: "Four", ha: "Huɗu", ar: "أربعة", category: "Time and Numbers" },
  { en: "Five", ha: "Biyar", ar: "خمسة", category: "Time and Numbers" },
  { en: "Six", ha: "Shida", ar: "ستة", category: "Time and Numbers" },
  { en: "Seven", ha: "Bakwai", ar: "سبعة", category: "Time and Numbers" },
  { en: "Eight", ha: "Takwas", ar: "ثمانية", category: "Time and Numbers" },
  { en: "Nine", ha: "Tara", ar: "تسعة", category: "Time and Numbers" },
  { en: "Ten", ha: "Goma", ar: "عشرة", category: "Time and Numbers" },

];
