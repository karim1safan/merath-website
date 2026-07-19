const API_BASE = 'https://api.islamic.app/v1';

async function fetchFromDhikrApi(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Dhikr API error: ${response.status}`);
  }
  const json = await response.json();
  if (json.code !== 200) {
    throw new Error('Dhikr API request failed');
  }
  return json.data;
}

function transformDhikrItem(item) {
  return {
    id: item.number,
    arabic: item.ar?.text || '',
    arabicHtml: item.ar?.body || '',
    translation: item.en?.text || '',
    translationHtml: item.en?.body || '',
    transliteration: item.transliteration?.en || '',
    repeatCount: item.repeatCount || 1,
    source: item.source?.en || '',
    virtue: item.virtue?.en || '',
    slug: item.slug || null,
    categoryNumber: item.category?.number || '',
    categoryNameAr: item.category?.ar || '',
    categoryNameEn: item.category?.en || '',
  };
}

export async function fetchDhikrCategories() {
  const data = await fetchFromDhikrApi('/dhikr');
  return {
    totalCategories: data.total_categories,
    shortcuts: data.shortcuts || [],
    categories: (data.categories || []).map((cat) => ({
      number: cat.number,
      nameEn: cat.en,
      nameAr: cat.ar,
      count: cat.count,
    })),
  };
}

export async function fetchDhikrByCategory(categoryNumber) {
  const data = await fetchFromDhikrApi(`/dhikr/${categoryNumber}`);
  return {
    category: data.category || null,
    shortcut: data.shortcut || null,
    label: data.label || null,
    count: data.count || 0,
    items: (data.duas || []).map(transformDhikrItem),
  };
}

export async function fetchDhikrByShortcut(shortcut) {
  const data = await fetchFromDhikrApi(`/dhikr/${shortcut}`);
  return {
    category: data.category || null,
    shortcut: data.shortcut || shortcut,
    label: data.label || '',
    count: data.count || 0,
    items: (data.duas || []).map(transformDhikrItem),
  };
}
