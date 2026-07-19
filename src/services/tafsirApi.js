const BASE = 'https://api.alquran.cloud/v1/ayah';

export const TAFSIR_EDITIONS = {
  muyassar: 'ar.muyassar',
  kathir:   'ar.kathir',
  saadi:    'ar.saddi',
};

export const TAFSIR_LABELS = {
  muyassar: 'التفسير الميسر',
  kathir:   'ابن كثير',
  saadi:    'السعدي',
};

export async function fetchTafsirAyah(surah, ayah, edition) {
  const res = await fetch(`${BASE}/${surah}:${ayah}/${edition}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error('API error');
  return json.data.text;
}
