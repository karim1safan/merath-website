const API_BASE = 'https://islamicquiz.i8x.net/api';

async function fetchFromApi(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchRandomQuestions(count = 20) {
  const data = await fetchFromApi(`/questions/random?count=${count}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchQuestionsByCategory(categoryId, page = 1, limit = 50) {
  const data = await fetchFromApi(`/categories/${categoryId}/questions?page=${page}&limit=${limit}`);
  return data;
}

export async function fetchCategories() {
  const data = await fetchFromApi('/categories');
  return data;
}

export async function fetchCategoryTopics(categoryId) {
  const data = await fetchFromApi(`/categories/${categoryId}/topics`);
  return data;
}

export async function searchQuestions(query) {
  const data = await fetchFromApi(`/search?q=${encodeURIComponent(query)}`);
  return Array.isArray(data) ? data : [];
}
