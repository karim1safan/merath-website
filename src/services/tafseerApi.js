const TAFSEER_BASE = 'https://alfurqan.online/api/v1/tafseer';

export const TAFSEER_OPTIONS = [
  { id: 'ibn-kathir', nameAr: 'ابن كثير', nameEn: 'Ibn Kathir' },
  { id: 'al-tabari', nameAr: 'الطبري', nameEn: 'Al-Tabari' },
];

export async function fetchTafseer(surahNumber, ayahNumber, tafseerId = 'ibn-kathir') {
  const response = await fetch(
    `${TAFSEER_BASE}/${tafseerId}/surah/${surahNumber}/ayah/${ayahNumber}`
  );

  if (!response.ok) {
    throw new Error(`Tafseer API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    tafseerId: data.tafseer?.id || tafseerId,
    tafseerName: data.tafseer?.name_en || '',
    surah: data.surah?.number || surahNumber,
    ayah: data.ayah?.ayah || ayahNumber,
    text: data.ayah?.text || '',
  };
}
