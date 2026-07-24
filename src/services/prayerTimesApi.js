const API_BASE = 'https://api.aladhan.com/v1';

const EGYPT_METHOD = 5;

async function fetchFromApi(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function fetchPrayerTimes(latitude, longitude, method = EGYPT_METHOD) {
  const date = formatDate(new Date());
  const data = await fetchFromApi(
    `/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}`
  );

  if (data.code !== 200 || !data.data) {
    throw new Error('Invalid response from AlAdhan API');
  }

  return {
    timings: data.data.timings,
    date: data.data.date,
    meta: data.data.meta,
  };
}
