import en from './en.json';
import hi from './hi.json';

const translations = { en, hi };

let currentLang = 'en';

export function setLanguage(lang) {
  currentLang = lang;
}

export function t(key) {
  const keys = key.split('.');
  let val = translations[currentLang];
  for (const k of keys) {
    val = val?.[k];
  }
  return val || key;
}

export function getLanguage() {
  return currentLang;
}
