/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Smartphone } from 'lucide-react';
import { GameCanvas } from './components/GameCanvas';
import { HudOverlay } from './components/HudOverlay';
import { MainMenu } from './components/MainMenu';
import {
  DialogModal,
  FinalVictoryScreen,
  GameOverModal,
  GuideModal,
  LevelCompleteModal,
  MiniGameL2Modal,
  MiniGameL3Modal,
  PauseModal,
  QuizModal,
  SettingsModal,
} from './components/Modals';
import { TouchControls } from './components/TouchControls';
import { WorldMap } from './components/WorldMap';
import { soundEngine } from './game/audio';
import { LEVELS_META } from './game/content';
import { gameBus } from './game/eventBus';
import { loadSave, persistSave, recordLevelVictory, resetAllProgress } from './game/storage';
import { ActiveModal, GameSettings, HudSnapshot, LevelId, SaveData, ScreenState } from './game/types';

function createInitialHud(levelId: LevelId): HudSnapshot {
  const meta = LEVELS_META[levelId];
  return {
    levelId,
    lives: 3,
    score: 0,
    itemsCollected: 0,
    itemsTarget: meta.collectibleTarget,
    symbolsCollected: [],
    symbolsRequired: meta.symbolLabels,
    checkpointReached: false,
    miniGameDone: levelId !== 2 && levelId !== 3,
    quizDone: false,
    gateOpen: false,
    nearbyPrompt: null,
  };
}

export default function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [activeLevel, setActiveLevel] = useState<LevelId>(1);
  const [hud, setHud] = useState<HudSnapshot>(() => createInitialHud(1));
  const [modal, setModal] = useState<ActiveModal>({ type: 'NONE' });
  const [showGuide, setShowGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissPortraitHint, setDismissPortraitHint] = useState(false);
  const [hasTouchDevice, setHasTouchDevice] = useState(false);

  // Sync audio settings
  useEffect(() => {
    soundEngine.configure(save.settings.musicEnabled, save.settings.sfxEnabled);
  }, [save.settings.musicEnabled, save.settings.sfxEnabled]);

  // Set menu/map music when not in active PlayScene
  useEffect(() => {
    if (screen === 'MENU' || screen === 'WORLD_MAP') {
      soundEngine.setMusicMode('menu');
    } else if (screen === 'FINAL_VICTORY') {
      soundEngine.setMusicMode('menu');
    }
  }, [screen]);

  // Detect touch device & portrait orientation
  useEffect(() => {
    const detect = () => {
      const touch =
        'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0 || window.innerWidth < 900;
      setHasTouchDevice(touch);
      setIsPortraitMobile(window.innerWidth < 768 && window.innerHeight > window.innerWidth);
    };
    detect();
    window.addEventListener('resize', detect);
    window.addEventListener('orientationchange', detect);
    return () => {
      window.removeEventListener('resize', detect);
      window.removeEventListener('orientationchange', detect);
    };
  }, []);

  // Unlock Web Audio on first tap/keypress
  useEffect(() => {
    const unlock = () => soundEngine.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Subscribe to Phaser PlayScene events
  useEffect(() => {
    const unsubs = [
      gameBus.on('hud-update', (snapshot) => {
        setHud(snapshot);
      }),
      gameBus.on('open-dialog', (payload) => {
        setModal({
          type: 'DIALOG',
          speaker: payload.speaker,
          title: payload.title,
          lines: payload.lines,
          onDoneEvent: payload.onDoneEvent,
        });
      }),
      gameBus.on('open-quiz', (payload) => {
        setModal({
          type: 'QUIZ',
          levelId: payload.levelId,
          mode: payload.mode,
          phase: payload.phase,
        });
      }),
      gameBus.on('open-minigame', ({ levelId }) => {
        setModal({ type: levelId === 2 ? 'MINIGAME_L2' : 'MINIGAME_L3' });
      }),
      gameBus.on('pause-game', () => {
        setModal({ type: 'PAUSE' });
      }),
      gameBus.on('level-complete', (payload) => {
        setSave((prev) =>
          recordLevelVictory(
            prev,
            payload.levelId,
            payload.stars,
            payload.score,
            payload.itemsCollected,
            payload.quizCorrect
          )
        );
        setModal({
          type: 'LEVEL_COMPLETE',
          levelId: payload.levelId,
          score: payload.score,
          stars: payload.stars,
          itemsCollected: payload.itemsCollected,
          quizCorrect: payload.quizCorrect,
        });
      }),
      gameBus.on('game-over', ({ levelId, score }) => {
        setModal({ type: 'GAME_OVER', levelId, score });
      }),
    ];
    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  const updateSettings = useCallback((next: GameSettings) => {
    soundEngine.click();
    setSave((prev) => {
      const updated: SaveData = { ...prev, settings: next };
      persistSave(updated);
      return updated;
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    soundEngine.unlock();
    setSave((prev) => {
      const bothMuted = !prev.settings.musicEnabled && !prev.settings.sfxEnabled;
      const nextEnabled = bothMuted;
      const updated: SaveData = {
        ...prev,
        settings: {
          ...prev.settings,
          musicEnabled: nextEnabled,
          sfxEnabled: nextEnabled,
        },
      };
      persistSave(updated);
      return updated;
    });
  }, []);

  const isMuted = !save.settings.musicEnabled && !save.settings.sfxEnabled;

  const showTouchControls = useMemo(() => {
    if (save.settings.showTouchControls === 'always') return true;
    if (save.settings.showTouchControls === 'off') return false;
    return hasTouchDevice;
  }, [save.settings.showTouchControls, hasTouchDevice]);

  const startLevel = (id: LevelId) => {
    soundEngine.click();
    setActiveLevel(id);
    setHud(createInitialHud(id));
    setModal({ type: 'NONE' });
    setScreen('PLAYING');
  };

  return (
    <div className="w-screen h-screen bg-[#160D08] flex items-center justify-center p-0 sm:p-2 overflow-hidden">
      {/* 16:9 Responsive Landscape Game Shell */}
      <div className="relative w-full h-full max-w-[1280px] max-h-[720px] aspect-video sm:rounded-3xl overflow-hidden sm:border-4 sm:border-amber-900/80 shadow-2xl bg-[#1E110A]">
        {screen === 'MENU' && (
          <MainMenu
            muted={isMuted}
            onStartGame={() => {
              soundEngine.click();
              setScreen('WORLD_MAP');
            }}
            onOpenGuide={() => {
              soundEngine.click();
              setShowGuide(true);
            }}
            onOpenSettings={() => {
              soundEngine.click();
              setShowSettings(true);
            }}
            onToggleMute={handleToggleMute}
          />
        )}

        {screen === 'WORLD_MAP' && (
          <WorldMap
            save={save}
            onSelectLevel={startLevel}
            onBackMenu={() => {
              soundEngine.click();
              setScreen('MENU');
            }}
            onOpenSettings={() => {
              soundEngine.click();
              setShowSettings(true);
            }}
            onOpenFinalVictory={() => {
              soundEngine.victory();
              setScreen('FINAL_VICTORY');
            }}
          />
        )}

        {screen === 'PLAYING' && (
          <div className="relative w-full h-full">
            <GameCanvas key={activeLevel} levelId={activeLevel} />

            <HudOverlay
              hud={hud}
              muted={isMuted}
              onToggleMute={handleToggleMute}
              onPause={() => {
                soundEngine.click();
                gameBus.emit('pause-game', undefined);
                setModal({ type: 'PAUSE' });
              }}
              onTriggerInteract={() => {
                gameBus.emit('touch-input', { action: 'interact', pressed: true });
                window.setTimeout(() => {
                  gameBus.emit('touch-input', { action: 'interact', pressed: false });
                }, 80);
              }}
            />

            <TouchControls
              visible={showTouchControls && modal.type === 'NONE'}
              nearbyPrompt={hud.nearbyPrompt}
            />
          </div>
        )}

        {screen === 'FINAL_VICTORY' && (
          <FinalVictoryScreen
            save={save}
            onWorldMap={() => {
              soundEngine.click();
              setScreen('WORLD_MAP');
            }}
            onMainMenu={() => {
              soundEngine.click();
              setScreen('MENU');
            }}
          />
        )}

        {/* Active Gameplay Modals */}
        {modal.type === 'PAUSE' && (
          <PauseModal
            muted={isMuted}
            onToggleMute={handleToggleMute}
            onResume={() => {
              soundEngine.click();
              setModal({ type: 'NONE' });
              gameBus.emit('resume-game', undefined);
            }}
            onRestart={() => {
              soundEngine.click();
              setHud(createInitialHud(activeLevel));
              setModal({ type: 'NONE' });
              gameBus.emit('restart-level', undefined);
            }}
            onWorldMap={() => {
              soundEngine.click();
              setModal({ type: 'NONE' });
              setScreen('WORLD_MAP');
            }}
          />
        )}

        {modal.type === 'DIALOG' && (
          <DialogModal
            speaker={modal.speaker}
            title={modal.title}
            lines={modal.lines}
            onClose={() => {
              const doneEvent = modal.onDoneEvent;
              setModal({ type: 'NONE' });
              gameBus.emit('dialog-closed', { onDoneEvent: doneEvent });
            }}
          />
        )}

        {modal.type === 'QUIZ' && (
          <QuizModal
            levelId={modal.levelId}
            mode={modal.mode}
            phase={modal.phase}
            onComplete={(correctCount) => {
              const { levelId, mode, phase } = modal;
              setModal({ type: 'NONE' });
              gameBus.emit('quiz-completed', {
                levelId,
                mode,
                phase,
                correctCount,
              });
            }}
          />
        )}

        {modal.type === 'MINIGAME_L2' && (
          <MiniGameL2Modal
            onComplete={(bonusScore) => {
              setModal({ type: 'NONE' });
              gameBus.emit('minigame-completed', { levelId: 2, bonusScore });
            }}
          />
        )}

        {modal.type === 'MINIGAME_L3' && (
          <MiniGameL3Modal
            onComplete={(bonusScore) => {
              setModal({ type: 'NONE' });
              gameBus.emit('minigame-completed', { levelId: 3, bonusScore });
            }}
          />
        )}

        {modal.type === 'LEVEL_COMPLETE' && (
          <LevelCompleteModal
            levelId={modal.levelId}
            score={modal.score}
            stars={modal.stars}
            itemsCollected={modal.itemsCollected}
            quizCorrect={modal.quizCorrect}
            onNextLevel={() => {
              soundEngine.click();
              setModal({ type: 'NONE' });
              if (modal.levelId < 4) {
                startLevel((modal.levelId + 1) as LevelId);
              } else {
                soundEngine.victory();
                setScreen('FINAL_VICTORY');
              }
            }}
            onWorldMap={() => {
              soundEngine.click();
              setModal({ type: 'NONE' });
              setScreen('WORLD_MAP');
            }}
          />
        )}

        {modal.type === 'GAME_OVER' && (
          <GameOverModal
            score={modal.score}
            onRetry={() => {
              soundEngine.click();
              setHud(createInitialHud(activeLevel));
              setModal({ type: 'NONE' });
              gameBus.emit('restart-level', undefined);
            }}
            onWorldMap={() => {
              soundEngine.click();
              setModal({ type: 'NONE' });
              setScreen('WORLD_MAP');
            }}
          />
        )}

        {/* Global Guide & Settings Modals */}
        {showGuide && (
          <GuideModal
            onClose={() => {
              soundEngine.click();
              setShowGuide(false);
            }}
          />
        )}

        {showSettings && (
          <SettingsModal
            settings={save.settings}
            onUpdate={updateSettings}
            onResetProgress={() => {
              soundEngine.click();
              setSave((prev) => resetAllProgress(prev));
            }}
            onClose={() => {
              soundEngine.click();
              setShowSettings(false);
            }}
          />
        )}

        {/* Friendly Portrait Orientation Hint for Android Phones */}
        {isPortraitMobile && !dismissPortraitHint && (
          <div className="fixed inset-0 z-50 bg-amber-950/90 flex items-center justify-center p-6 text-center">
            <div className="max-w-xs bg-amber-50 text-amber-950 border-4 border-amber-400 rounded-3xl p-5 shadow-2xl">
              <Smartphone className="w-12 h-12 mx-auto text-amber-700 rotate-90 mb-3" />
              <h2 className="font-display font-bold text-xl mb-1">Putar Layar ke Landscape</h2>
              <p className="text-xs font-semibold text-slate-700 mb-4">
                Energen World paling seru dimainkan dalam posisi layar mendatar (landscape) di HP Android!
              </p>
              <button
                type="button"
                onClick={() => setDismissPortraitHint(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 border-2 border-amber-950 font-display font-bold text-sm"
              >
                Lanjutkan Tetap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
