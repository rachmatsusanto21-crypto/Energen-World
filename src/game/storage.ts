import { LevelId, LevelProgress, SaveData } from './types';

const STORAGE_KEY = 'energen_world_save_v1';

const defaultLevelProgress = (): LevelProgress => ({
  completed: false,
  stars: 0,
  bestScore: 0,
  itemsCollected: 0,
  quizCorrect: 0,
});

export function createDefaultSave(): SaveData {
  return {
    unlockedLevel: 1,
    levels: {
      1: defaultLevelProgress(),
      2: defaultLevelProgress(),
      3: defaultLevelProgress(),
      4: defaultLevelProgress(),
    },
    settings: {
      musicEnabled: true,
      sfxEnabled: true,
      showTouchControls: 'auto',
    },
  };
}

export function loadSave(): SaveData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultSave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const base = createDefaultSave();
    return {
      unlockedLevel:
        parsed.unlockedLevel && parsed.unlockedLevel >= 1 && parsed.unlockedLevel <= 4
          ? parsed.unlockedLevel
          : 1,
      levels: {
        1: { ...base.levels[1], ...(parsed.levels?.[1] ?? {}) },
        2: { ...base.levels[2], ...(parsed.levels?.[2] ?? {}) },
        3: { ...base.levels[3], ...(parsed.levels?.[3] ?? {}) },
        4: { ...base.levels[4], ...(parsed.levels?.[4] ?? {}) },
      },
      settings: {
        ...base.settings,
        ...(parsed.settings ?? {}),
      },
    };
  } catch {
    return createDefaultSave();
  }
}

export function persistSave(data: SaveData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function recordLevelVictory(
  current: SaveData,
  levelId: LevelId,
  stars: number,
  score: number,
  itemsCollected: number,
  quizCorrect: number
): SaveData {
  const prev = current.levels[levelId];
  const nextUnlocked =
    levelId < 4 ? (Math.max(current.unlockedLevel, levelId + 1) as LevelId) : 4;

  const updated: SaveData = {
    ...current,
    unlockedLevel: nextUnlocked,
    levels: {
      ...current.levels,
      [levelId]: {
        completed: true,
        stars: Math.max(prev.stars, stars),
        bestScore: Math.max(prev.bestScore, score),
        itemsCollected: Math.max(prev.itemsCollected, itemsCollected),
        quizCorrect: Math.max(prev.quizCorrect, quizCorrect),
      },
    },
  };
  persistSave(updated);
  return updated;
}

export function resetAllProgress(current: SaveData): SaveData {
  const fresh: SaveData = {
    ...createDefaultSave(),
    settings: current.settings,
  };
  persistSave(fresh);
  return fresh;
}
