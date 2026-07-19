const API_BASE = 'https://mp3quran.net/api/v3';

async function fetchFromMp3Quran(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`mp3quran.net error: ${response.status}`);
  }
  return response.json();
}

export async function fetchSuwar(language = 'ar') {
  const data = await fetchFromMp3Quran(`/suwar?language=${language}`);
  return data.suwar || [];
}

export async function fetchReciters(language = 'ar') {
  const data = await fetchFromMp3Quran(`/reciters?language=${language}`);
  return data.reciters || [];
}

export async function fetchTafasir(language = 'ar') {
  const data = await fetchFromMp3Quran(`/tafasir?language=${language}`);
  return data.tafasir || [];
}
