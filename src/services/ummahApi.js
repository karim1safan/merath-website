const API_BASE = 'https://ummahapi.com/api';

async function fetchFromUmmahApi(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`UmmahAPI error: ${response.status}`);
  }
  const json = await response.json();
  if (!json.success) {
    throw new Error('UmmahAPI request failed');
  }
  return json.data;
}

export async function fetchQuranSurah(surahNumber) {
  return fetchFromUmmahApi(`/quran/surah/${surahNumber}`);
}

export async function fetchRandomVerse() {
  return fetchFromUmmahApi('/quran/random');
}

export async function searchQuran(query) {
  return fetchFromUmmahApi(`/quran/search?q=${encodeURIComponent(query)}`);
}

export async function fetchQuranWords(surahNumber, ayahNumber) {
  return fetchFromUmmahApi(`/quran/words/${surahNumber}/${ayahNumber}`);
}

export async function fetchHadith(collection, number) {
  return fetchFromUmmahApi(`/hadith/${collection}/${number}`);
}

export async function fetchHadithCollections() {
  return fetchFromUmmahApi('/hadith/collections');
}

export async function fetchRandomHadith() {
  return fetchFromUmmahApi('/hadith/random');
}

export async function fetchAsmaUlHusna() {
  return fetchFromUmmahApi('/asma-ul-husna');
}

export async function fetchDuaCategories() {
  return fetchFromUmmahApi('/duas/categories');
}

export async function fetchDuaByCategory(categoryId) {
  return fetchFromUmmahApi(`/duas/category/${categoryId}`);
}

export async function fetchRandomDua() {
  return fetchFromUmmahApi('/duas/random');
}

export async function fetchTafsir(surahNumber, ayahNumber) {
  return fetchFromUmmahApi(`/tafsir/ibn_kathir/surah/${surahNumber}/ayah/${ayahNumber}`);
}

const HADITH_CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

export async function fetchHadithFromCDN(edition, hadithNumber) {
  const url = `${HADITH_CDN_BASE}/${edition}/${hadithNumber}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Hadith CDN error: ${response.status}`);
  }
  const data = await response.json();
  return data.hadiths?.[0] || null;
}
