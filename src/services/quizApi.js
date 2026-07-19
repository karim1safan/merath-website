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

export async function fetchMultiplePages(categoryId, pagesToFetch = 5, limit = 50) {
  const firstPage = await fetchQuestionsByCategory(categoryId, 1, limit);
  const totalPages = firstPage.totalPages || 1;

  if (totalPages <= 1) {
    return firstPage.questions || [];
  }

  const pageNumbers = new Set([1]);
  while (pageNumbers.size < Math.min(pagesToFetch, totalPages)) {
    pageNumbers.add(Math.floor(Math.random() * totalPages) + 1);
  }

  const results = await Promise.all(
    Array.from(pageNumbers).map((page) => fetchQuestionsByCategory(categoryId, page, limit))
  );

  return results.flatMap((r) => r.questions || []);
}

export async function fetchCategories() {
  const data = await fetchFromApi('/categories');
  return data;
}

export async function fetchCategoryTopics(categoryId) {
  const data = await fetchFromApi(`/categories/${categoryId}/topics`);
  return data;
}

export async function fetchQuestionsByTopic(categoryId, topicSlug, limit = 50) {
  const data = await fetchFromApi(`/categories/${categoryId}/topics/${topicSlug}/questions`);
  return Array.isArray(data) ? data.slice(0, limit) : [];
}

export async function searchQuestions(query) {
  const data = await fetchFromApi(`/search?q=${encodeURIComponent(query)}`);
  return Array.isArray(data) ? data : [];
}
