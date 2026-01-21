import { SavedReading } from '../types';

const STORAGE_KEY = 'celestial_arc_hist_v5';
const MAX_HISTORY = 50;
const API_KEY_STORAGE = 'celestial_arc_api_key';

export const loadHistory = (): SavedReading[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const saveToHistory = (newReading: SavedReading, currentHistory: SavedReading[]): SavedReading[] => {
  const updated = [newReading, ...currentHistory].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
  return updated;
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const removeFromHistory = (readingId: string): SavedReading[] => {
  try {
    const current = loadHistory();
    const updated = current.filter(item => item.id !== readingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to remove from history:', error);
    return loadHistory();
  }
};

export const loadApiKey = (): string | null => {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch (error) {
    console.error('Failed to load API key:', error);
    return null;
  }
};

export const saveApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
  } catch (error) {
    console.error('Failed to save API key:', error);
  }
};

export const clearApiKey = (): void => {
  try {
    localStorage.removeItem(API_KEY_STORAGE);
  } catch (error) {
    console.error('Failed to clear API key:', error);
  }
};
