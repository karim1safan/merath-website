const API_BASE = 'https://api.quran.gading.dev';

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
