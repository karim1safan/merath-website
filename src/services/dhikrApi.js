import hisnAlMuslim from '../data/hisn_almuslim.json';

const categoryNames = Object.keys(hisnAlMuslim);

export function getCategories() {
  return categoryNames.map((name) => ({
    name,
    count: hisnAlMuslim[name].text.length,
  }));
}

export function getDhikrByCategory(categoryName) {
  const category = hisnAlMuslim[categoryName];
  if (!category) return [];

  return category.text.map((text, index) => ({
    id: `${categoryName}-${index}`,
    arabic: text,
    footnote: category.footnote?.[index] || null,
  }));
}
