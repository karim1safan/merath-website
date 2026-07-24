import morningEveningAdhkar from '../data/morning_and_evining_adkhar.json';

export function getMorningAdhkar() {
  return morningEveningAdhkar.filter((item) => item.type === 0 || item.type === 1);
}

export function getEveningAdhkar() {
  return morningEveningAdhkar.filter((item) => item.type === 0 || item.type === 2);
}
