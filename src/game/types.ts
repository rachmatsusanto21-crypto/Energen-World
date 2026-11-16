export type ScreenState =
  | 'MENU'
  | 'WORLD_MAP'
  | 'PLAYING'
  | 'FINAL_VICTORY';

export type LevelId = 1 | 2 | 3 | 4;

export interface LevelProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
  itemsCollected: number;
  quizCorrect: number;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  showTouchControls: 'auto' | 'always' | 'off';
}

export interface SaveData {
  unlockedLevel: LevelId;
  levels: Record<LevelId, LevelProgress>;
  settings: GameSettings;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanationCorrect: string;
  explanationWrong: string;
}

export interface LevelMeta {
  id: LevelId;
  name: string;
  subtitle: string;
  theme: string;
  description: string;
  collectibleLabel: string;
  collectibleTarget: number;
  symbolLabels: string[];
  introDialog: {
    speaker: 'Malki' | 'Bobo Balls';
    lines: string[];
  };
  outroDialog: string;
  accentColor: string;
  bgGradient: string;
}

export interface HudSnapshot {
  levelId: LevelId;
  lives: number;
  score: number;
  itemsCollected: number;
  itemsTarget: number;
  symbolsCollected: string[];
  symbolsRequired: string[];
  checkpointReached: boolean;
  miniGameDone: boolean;
  quizDone: boolean;
  gateOpen: boolean;
  nearbyPrompt: string | null;
  bossHp?: number;
  bossMaxHp?: number;
  bossPhase?: 1 | 2 | 3;
  bossPhaseName?: string;
}

export type ActiveModal =
  | { type: 'NONE' }
  | { type: 'PAUSE' }
  | { type: 'DIALOG'; speaker: 'Malki' | 'Bobo Balls'; title: string; lines: string[]; onDoneEvent?: string }
  | { type: 'QUIZ'; levelId: LevelId; mode: 'LEVEL_GATE' | 'BOSS_PHASE'; phase?: 1 | 2 | 3 }
  | { type: 'MINIGAME_L2' }
  | { type: 'MINIGAME_L3' }
  | { type: 'LEVEL_COMPLETE'; levelId: LevelId; score: number; stars: number; itemsCollected: number; quizCorrect: number }
  | { type: 'GAME_OVER'; levelId: LevelId; score: number };
