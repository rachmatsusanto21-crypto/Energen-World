import { HudSnapshot, LevelId } from './types';

type Listener<T = unknown> = (payload: T) => void;

export interface EventMap {
  'hud-update': HudSnapshot;
  'open-dialog': {
    speaker: 'Malki' | 'Bobo Balls';
    title: string;
    lines: string[];
    onDoneEvent?: string;
  };
  'open-quiz': {
    levelId: LevelId;
    mode: 'LEVEL_GATE' | 'BOSS_PHASE';
    phase?: 1 | 2 | 3;
  };
  'open-minigame': {
    levelId: 2 | 3;
  };
  'level-complete': {
    levelId: LevelId;
    score: number;
    stars: number;
    itemsCollected: number;
    quizCorrect: number;
  };
  'game-over': {
    levelId: LevelId;
    score: number;
  };
  'touch-input': {
    action: 'left' | 'right' | 'jump' | 'interact';
    pressed: boolean;
  };
  'pause-game': undefined;
  'resume-game': undefined;
  'restart-level': undefined;
  'dialog-closed': { onDoneEvent?: string };
  'quiz-completed': {
    levelId: LevelId;
    mode: 'LEVEL_GATE' | 'BOSS_PHASE';
    phase?: 1 | 2 | 3;
    correctCount: number;
  };
  'minigame-completed': {
    levelId: 2 | 3;
    bonusScore: number;
  };
}

class TypedEventBus {
  private listeners: Map<keyof EventMap, Set<Listener<never>>> = new Map();

  public on<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(fn as Listener<never>);
    return () => {
      set.delete(fn as Listener<never>);
    };
  }

  public emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.forEach((fn) => {
      (fn as Listener<EventMap[K]>)(payload);
    });
  }
}

export const gameBus = new TypedEventBus();
