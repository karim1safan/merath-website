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
