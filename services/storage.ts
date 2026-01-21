import { get, set } from 'idb-keyval';
import { BoardGame } from '../types';

const STORAGE_KEY = 'boardgame-vault-data';

export const loadGames = async (): Promise<BoardGame[]> => {
  try {
    // 1. Try to get data from IndexedDB
    const games = await get<BoardGame[]>(STORAGE_KEY);
    if (games) {
      return games;
    }

    // 2. Migration: If no data in DB, check LocalStorage (legacy support)
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        // Save to IndexedDB
        await set(STORAGE_KEY, parsed);
        // Clear LocalStorage to free up space and prevent confusion,
        // as we now rely on IndexedDB.
        localStorage.removeItem(STORAGE_KEY);
        return parsed;
      } catch (e) {
        console.error('Migration failed', e);
      }
    }

    // 3. Load initial data from JSON file if no data exists
    try {
      const response = await fetch('/boardgames_backup_2026-01-20.json');
      if (response.ok) {
        const initialData = await response.json();
        // Save to IndexedDB for future use
        await set(STORAGE_KEY, initialData);
        return initialData;
      }
    } catch (e) {
      console.error('Error loading initial data:', e);
    }

    return [];
  } catch (error) {
    console.error('Error loading games:', error);
    return [];
  }
};

export const saveGames = async (games: BoardGame[]): Promise<void> => {
  try {
    await set(STORAGE_KEY, games);
  } catch (error) {
    console.error('Error saving games to IndexedDB:', error);
    throw error;
  }
};
