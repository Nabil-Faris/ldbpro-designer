import type { PageDataModel } from './types';

const STORAGE_KEY = 'ldbproPageData';

export function savePageData(pageData: PageDataModel): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));
  } catch (error) {
    // Intentionally ignore storage errors for now
    console.error('Failed to save to localStorage', error);
  }
}

export function loadPageData(): PageDataModel | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PageDataModel;
  } catch (error) {
    console.error('Failed to load from localStorage', error);
    return null;
  }
}

