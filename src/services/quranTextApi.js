const API_BASE = 'https://api.alquran.cloud/v1';

async function fetchFromApi(endpoint) {
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

function normalizeRevelation(type) {
  return type === 'Meccan' ? 'makkah' : 'medinan';
}

export async function fetchQuranSurah(surahNumber) {
  const [arabicData, translationData] = await Promise.all([
    fetchFromApi(`/surah/${surahNumber}`),
    fetchFromApi(`/surah/${surahNumber}/en.sahih`),
  ]);

  return {
    surah: {
      number: arabicData.number,
      name_arabic: arabicData.name,
      name_english: arabicData.englishNameTranslation || arabicData.englishName,
      numberOfVerses: arabicData.numberOfAyahs,
      revelation: normalizeRevelation(arabicData.revelationType),
    },
    verses: arabicData.ayahs.map((ayah, index) => ({
      ayah: ayah.numberInSurah,
      arabic: ayah.text,
      translations: {
        sahih_international: translationData.ayahs[index]?.text || '',
      },
    })),
  };
}

export async function fetchRandomVerse() {
  const randomSurah = Math.floor(Math.random() * 114) + 1;
  const [arabicData, translationData] = await Promise.all([
    fetchFromApi(`/surah/${randomSurah}`),
    fetchFromApi(`/surah/${randomSurah}/en.sahih`),
  ]);

  const randomIndex = Math.floor(Math.random() * arabicData.ayahs.length);
  const arabicAyah = arabicData.ayahs[randomIndex];
  const translationAyah = translationData.ayahs[randomIndex];

  return {
    arabic: arabicAyah.text,
    translations: {
      sahih_international: translationAyah?.text || '',
    },
    verse_key: `${randomSurah}:${arabicAyah.numberInSurah}`,
  };
}
