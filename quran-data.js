/* ============================================================
   quran-data.js
   Small reference lists used by the app. No Quran text here --
   the Quran itself is the PDF / page images in the Quran section.

   SURAHS: [number, name, number of ayahs]
   JUZ_STARTS: for each of the 30 juz, the surah and ayah it starts at.
   ============================================================ */

var SURAHS = [
  { n: 1,   name: "Al-Fatihah",     ayahs: 7   },
  { n: 2,   name: "Al-Baqarah",     ayahs: 286 },
  { n: 3,   name: "Aal-e-Imran",    ayahs: 200 },
  { n: 4,   name: "An-Nisa",        ayahs: 176 },
  { n: 5,   name: "Al-Ma'idah",     ayahs: 120 },
  { n: 6,   name: "Al-An'am",       ayahs: 165 },
  { n: 7,   name: "Al-A'raf",       ayahs: 206 },
  { n: 8,   name: "Al-Anfal",       ayahs: 75  },
  { n: 9,   name: "At-Tawbah",      ayahs: 129 },
  { n: 10,  name: "Yunus",          ayahs: 109 },
  { n: 11,  name: "Hud",            ayahs: 123 },
  { n: 12,  name: "Yusuf",          ayahs: 111 },
  { n: 13,  name: "Ar-Ra'd",        ayahs: 43  },
  { n: 14,  name: "Ibrahim",        ayahs: 52  },
  { n: 15,  name: "Al-Hijr",        ayahs: 99  },
  { n: 16,  name: "An-Nahl",        ayahs: 128 },
  { n: 17,  name: "Al-Isra",        ayahs: 111 },
  { n: 18,  name: "Al-Kahf",        ayahs: 110 },
  { n: 19,  name: "Maryam",         ayahs: 98  },
  { n: 20,  name: "Ta-Ha",          ayahs: 135 },
  { n: 21,  name: "Al-Anbiya",      ayahs: 112 },
  { n: 22,  name: "Al-Hajj",        ayahs: 78  },
  { n: 23,  name: "Al-Mu'minun",    ayahs: 118 },
  { n: 24,  name: "An-Nur",         ayahs: 64  },
  { n: 25,  name: "Al-Furqan",      ayahs: 77  },
  { n: 26,  name: "Ash-Shu'ara",    ayahs: 227 },
  { n: 27,  name: "An-Naml",        ayahs: 93  },
  { n: 28,  name: "Al-Qasas",       ayahs: 88  },
  { n: 29,  name: "Al-Ankabut",     ayahs: 69  },
  { n: 30,  name: "Ar-Rum",         ayahs: 60  },
  { n: 31,  name: "Luqman",         ayahs: 34  },
  { n: 32,  name: "As-Sajdah",      ayahs: 30  },
  { n: 33,  name: "Al-Ahzab",       ayahs: 73  },
  { n: 34,  name: "Saba",           ayahs: 54  },
  { n: 35,  name: "Fatir",          ayahs: 45  },
  { n: 36,  name: "Ya-Sin",         ayahs: 83  },
  { n: 37,  name: "As-Saffat",      ayahs: 182 },
  { n: 38,  name: "Sad",            ayahs: 88  },
  { n: 39,  name: "Az-Zumar",       ayahs: 75  },
  { n: 40,  name: "Ghafir",         ayahs: 85  },
  { n: 41,  name: "Fussilat",       ayahs: 54  },
  { n: 42,  name: "Ash-Shura",      ayahs: 53  },
  { n: 43,  name: "Az-Zukhruf",     ayahs: 89  },
  { n: 44,  name: "Ad-Dukhan",      ayahs: 59  },
  { n: 45,  name: "Al-Jathiyah",    ayahs: 37  },
  { n: 46,  name: "Al-Ahqaf",       ayahs: 35  },
  { n: 47,  name: "Muhammad",       ayahs: 38  },
  { n: 48,  name: "Al-Fath",        ayahs: 29  },
  { n: 49,  name: "Al-Hujurat",     ayahs: 18  },
  { n: 50,  name: "Qaf",            ayahs: 45  },
  { n: 51,  name: "Adh-Dhariyat",   ayahs: 60  },
  { n: 52,  name: "At-Tur",         ayahs: 49  },
  { n: 53,  name: "An-Najm",        ayahs: 62  },
  { n: 54,  name: "Al-Qamar",       ayahs: 55  },
  { n: 55,  name: "Ar-Rahman",      ayahs: 78  },
  { n: 56,  name: "Al-Waqi'ah",     ayahs: 96  },
  { n: 57,  name: "Al-Hadid",       ayahs: 29  },
  { n: 58,  name: "Al-Mujadila",    ayahs: 22  },
  { n: 59,  name: "Al-Hashr",       ayahs: 24  },
  { n: 60,  name: "Al-Mumtahanah",  ayahs: 13  },
  { n: 61,  name: "As-Saff",        ayahs: 14  },
  { n: 62,  name: "Al-Jumu'ah",     ayahs: 11  },
  { n: 63,  name: "Al-Munafiqun",   ayahs: 11  },
  { n: 64,  name: "At-Taghabun",    ayahs: 18  },
  { n: 65,  name: "At-Talaq",       ayahs: 12  },
  { n: 66,  name: "At-Tahrim",      ayahs: 12  },
  { n: 67,  name: "Al-Mulk",        ayahs: 30  },
  { n: 68,  name: "Al-Qalam",       ayahs: 52  },
  { n: 69,  name: "Al-Haqqah",      ayahs: 52  },
  { n: 70,  name: "Al-Ma'arij",     ayahs: 44  },
  { n: 71,  name: "Nuh",            ayahs: 28  },
  { n: 72,  name: "Al-Jinn",        ayahs: 28  },
  { n: 73,  name: "Al-Muzzammil",   ayahs: 20  },
  { n: 74,  name: "Al-Muddaththir", ayahs: 56  },
  { n: 75,  name: "Al-Qiyamah",     ayahs: 40  },
  { n: 76,  name: "Al-Insan",       ayahs: 31  },
  { n: 77,  name: "Al-Mursalat",    ayahs: 50  },
  { n: 78,  name: "An-Naba",        ayahs: 40  },
  { n: 79,  name: "An-Nazi'at",     ayahs: 46  },
  { n: 80,  name: "Abasa",          ayahs: 42  },
  { n: 81,  name: "At-Takwir",      ayahs: 29  },
  { n: 82,  name: "Al-Infitar",     ayahs: 19  },
  { n: 83,  name: "Al-Mutaffifin",  ayahs: 36  },
  { n: 84,  name: "Al-Inshiqaq",    ayahs: 25  },
  { n: 85,  name: "Al-Buruj",       ayahs: 22  },
  { n: 86,  name: "At-Tariq",       ayahs: 17  },
  { n: 87,  name: "Al-A'la",        ayahs: 19  },
  { n: 88,  name: "Al-Ghashiyah",   ayahs: 26  },
  { n: 89,  name: "Al-Fajr",        ayahs: 30  },
  { n: 90,  name: "Al-Balad",       ayahs: 20  },
  { n: 91,  name: "Ash-Shams",      ayahs: 15  },
  { n: 92,  name: "Al-Layl",        ayahs: 21  },
  { n: 93,  name: "Ad-Duha",        ayahs: 11  },
  { n: 94,  name: "Ash-Sharh",      ayahs: 8   },
  { n: 95,  name: "At-Tin",         ayahs: 8   },
  { n: 96,  name: "Al-Alaq",        ayahs: 19  },
  { n: 97,  name: "Al-Qadr",        ayahs: 5   },
  { n: 98,  name: "Al-Bayyinah",    ayahs: 8   },
  { n: 99,  name: "Az-Zalzalah",    ayahs: 8   },
  { n: 100, name: "Al-Adiyat",      ayahs: 11  },
  { n: 101, name: "Al-Qari'ah",     ayahs: 11  },
  { n: 102, name: "At-Takathur",    ayahs: 8   },
  { n: 103, name: "Al-Asr",         ayahs: 3   },
  { n: 104, name: "Al-Humazah",     ayahs: 9   },
  { n: 105, name: "Al-Fil",         ayahs: 5   },
  { n: 106, name: "Quraysh",        ayahs: 4   },
  { n: 107, name: "Al-Ma'un",       ayahs: 7   },
  { n: 108, name: "Al-Kawthar",     ayahs: 3   },
  { n: 109, name: "Al-Kafirun",     ayahs: 6   },
  { n: 110, name: "An-Nasr",        ayahs: 3   },
  { n: 111, name: "Al-Masad",       ayahs: 5   },
  { n: 112, name: "Al-Ikhlas",      ayahs: 4   },
  { n: 113, name: "Al-Falaq",       ayahs: 5   },
  { n: 114, name: "An-Nas",         ayahs: 6   }
];

/* The Quran PDF used by this app. Page 1 is the cover, pages 2 and 3
   are the tajweed colour key, Surah Al-Fatihah starts on page 4 and
   Surah An-Nas is on page 850. The page numbers printed on the pages
   match the file numbers exactly, so no offset is needed. */
var QURAN_FIRST_PAGE = 4;
var QURAN_LAST_PAGE = 851;

/* ------------------------------------------------------------
   Page tables for THIS mushaf (13 line, 851 pages).

   SURAH_START_PAGE[n - 1] is the first page whose printed header
   names surah n. JUZ_START_PAGE[j - 1] is the same for juz j.

   These were read off the header line printed at the top of every
   page. Several short surahs share a page near the end, which is
   why some numbers repeat.

   They were checked against the standard juz boundaries: for all
   30 juz, the surah these tables give at the juz start page is the
   surah the juz is known to begin in.
   ------------------------------------------------------------ */

var SURAH_START_PAGE = [
    4,   5,  70, 108, 149, 179, 211, 248, 262, 290,
  310, 330, 348, 357, 366, 374, 395, 410, 427, 437,
  451, 464, 479, 489, 503, 513, 527, 539, 554, 564,
  573, 579, 583, 597, 605, 613, 620, 630, 637, 649,
  661, 670, 679, 688, 693, 699, 706, 712, 718, 723,
  727, 731, 734, 738, 742, 747, 752, 759, 763, 768,
  772, 775, 777, 779, 782, 785, 789, 792, 796, 799,
  802, 805, 808, 810, 813, 815, 818, 821, 822, 824,
  826, 827, 828, 830, 831, 832, 833, 834, 835, 837,
  838, 839, 840, 840, 841, 841, 842, 842, 843, 844,
  845, 845, 846, 846, 846, 847, 847, 848, 848, 848,
  849, 849, 849, 850
];

var JUZ_START_PAGE = [
    4,  31,  59,  87, 115, 143, 171, 199, 227, 255,
  283, 311, 339, 367, 395, 423, 451, 479, 507, 535,
  561, 589, 615, 643, 669, 699, 729, 759, 789, 821
];

/* Every surah printed on a page, as a list of surah numbers.

   Near the end of the Quran the surahs are short and two or three
   of them share a page, so this can return more than one. The rule
   matches what is printed in the page header: if any surah begins
   on this page, the header names those; otherwise the page is a
   continuation and the header names the one surah running through it. */
function surahsForPage(page) {
  var starting = [];
  for (var i = 0; i < SURAH_START_PAGE.length; i++) {
    if (SURAH_START_PAGE[i] === page) starting.push(i + 1);
  }
  if (starting.length) return starting;

  var running = 1;
  for (var j = 0; j < SURAH_START_PAGE.length; j++) {
    if (SURAH_START_PAGE[j] < page) running = j + 1;
  }
  return [running];
}

/* The surah at the top of a page. */
function surahForPage(page) {
  return surahsForPage(page)[0];
}

/* "103. Al-Asr" or, for a shared page, "Al-Asr, Al-Humazah, Al-Fil". */
function surahLabelForPage(page) {
  var list = surahsForPage(page);
  if (list.length === 1) {
    return list[0] + ". " + getSurah(list[0]).name;
  }
  return list.map(function (n) { return getSurah(n).name; }).join(", ");
}

/* Which juz a page belongs to. */
function juzForPage(page) {
  var found = 1;
  for (var j = 0; j < JUZ_START_PAGE.length; j++) {
    if (JUZ_START_PAGE[j] <= page) found = j + 1;
  }
  return found;
}

/* The page a surah starts on. */
function pageForSurah(number) {
  return SURAH_START_PAGE[number - 1] || QURAN_FIRST_PAGE;
}

/* Look up a surah by its number. */
function getSurah(number) {
  return SURAHS[number - 1] || SURAHS[0];
}

