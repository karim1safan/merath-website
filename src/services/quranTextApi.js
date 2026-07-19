const API_BASE = 'https://api.quran.gading.dev';

const REVELATION_SEQUENCE = [
  96, 74, 73, 111, 1, 114, 113, 112, 110, 109, 107, 106, 105, 104, 103,
  92, 91, 93, 94, 95, 100, 101, 102, 75, 85, 60, 56, 22, 55, 54, 38, 24,
  7, 4, 10, 51, 88, 18, 52, 69, 67, 64, 62, 48, 57, 13, 76, 44, 50, 43,
  63, 37, 34, 31, 40, 42, 30, 29, 25, 35, 19, 16, 21, 23, 17, 11, 14, 15,
  12, 28, 39, 26, 33, 8, 3, 2, 98, 66, 65, 59, 58, 49, 47, 36, 41, 45,
  53, 80, 81, 82, 83, 90, 89, 86, 87, 84, 68, 77, 79, 78, 71, 6, 5, 46,
  61, 32, 70, 97, 72, 20, 99, 27, 108, 9,
];

export const REVELATION_ORDER = {};
REVELATION_SEQUENCE.forEach((surahNum, index) => {
  REVELATION_ORDER[surahNum] = index + 1;
});

async function fetchFromQuranApi(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Quran API error: ${response.status}`);
  }
  const json = await response.json();
  if (json.code !== 200) {
    throw new Error('Quran API request failed');
  }
  return json.data;
}

function transformSurahData(data) {
  return {
    surah: {
      number: data.number,
      name_arabic: data.name.short,
      name_english: data.name.translation?.en || data.name.transliteration?.en || '',
      name_transliteration: data.name.transliteration?.en || '',
      revelation: data.revelation?.en || '',
      numberOfVerses: data.numberOfVerses,
    },
    verses: (data.verses || []).map((v) => ({
      ayah: v.number.inSurah,
      arabic: v.text.arab,
      translations: {
        sahih_international: v.translation?.en || '',
      },
      audio: {
        ayah_audio: v.audio?.primary || '',
      },
    })),
  };
}

export async function fetchQuranSurah(surahNumber) {
  const data = await fetchFromQuranApi(`/surah/${surahNumber}`);
  return transformSurahData(data);
}

export async function fetchRandomVerse() {
  const randomSurah = Math.floor(Math.random() * 114) + 1;
  const surahData = await fetchFromQuranApi(`/surah/${randomSurah}`);
  const verses = surahData.verses || [];
  const randomIndex = Math.floor(Math.random() * verses.length);
  const verse = verses[randomIndex];

  return {
    arabic: verse.text.arab,
    translations: {
      sahih_international: verse.translation?.en || '',
    },
    verse_key: `${randomSurah}:${verse.number.inSurah}`,
    audio: {
      ayah_audio: verse.audio?.primary || '',
    },
  };
}
