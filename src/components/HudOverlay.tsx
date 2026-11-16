import React from 'react';
import { CheckCircle2, Heart, Pause, Volume2, VolumeX } from 'lucide-react';
import { LEVELS_META } from '../game/content';
import { HudSnapshot } from '../game/types';

interface HudOverlayProps {
  hud: HudSnapshot;
  muted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onTriggerInteract: () => void;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  hud,
  muted,
  onToggleMute,
  onPause,
  onTriggerInteract,
}) => {
  const meta = LEVELS_META[hud.levelId];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-2 p-2.5 sm:p-3.5">
      <div className="flex items-start justify-between gap-2">
        {/* Top-left: Lives, Collectible Counter, Symbols */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-amber-950/75 border-2 border-amber-300/60 rounded-2xl px-3 py-1.5 shadow-md text-white">
          {/* Lives */}
          <div className="flex items-center gap-1" aria-label={`Nyawa ${hud.lives}`}>
            {[1, 2, 3].map((i) => (
              <Heart
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  i <= hud.lives ? 'fill-red-500 text-red-500' : 'fill-amber-900/50 text-amber-800'
                }`}
              />
            ))}
          </div>

          <span className="text-amber-300/50">|</span>

          {/* Collectibles */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tabular-nums">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-100 inline-block" />
            <span>
              {meta.collectibleLabel}: {hud.itemsCollected}/{hud.itemsTarget}
            </span>
          </div>

          {hud.symbolsRequired.length > 0 && (
            <>
              <span className="hidden sm:inline text-amber-300/50">|</span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                <span>
                  Simbol: {hud.symbolsCollected.length}/{hud.symbolsRequired.length}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Top-center: Level Title & Score */}
        <div className="hidden md:flex items-center gap-3 bg-amber-950/75 border-2 border-amber-300/60 rounded-2xl px-4 py-1.5 shadow-md text-white">
          <span className="font-display font-bold text-sm text-yellow-300">
            Level {hud.levelId}: {meta.name}
          </span>
          <span className="text-amber-300/50">·</span>
          <span className="text-sm font-extrabold tabular-nums">Skor: {hud.score}</span>
        </div>

        {/* Top-right: Mute & Pause */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="md:hidden bg-amber-950/75 border-2 border-amber-300/60 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-yellow-300 tabular-nums">
            {hud.score}
          </div>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-950/80 border-2 border-amber-200/70 text-white flex items-center justify-center hover:bg-amber-900 active:scale-95 transition-transform shadow-md"
          >
            {muted ? <VolumeX className="w-5 h-5 text-red-300" /> : <Volume2 className="w-5 h-5 text-yellow-300" />}
          </button>

          <button
            type="button"
            onClick={onPause}
            aria-label="Jeda Game"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-400 border-2 border-amber-900 text-amber-950 flex items-center justify-center hover:bg-amber-300 active:scale-95 transition-transform shadow-md"
          >
            <Pause className="w-5 h-5 fill-amber-950" />
          </button>
        </div>
      </div>

      {/* Boss Health Bar in Level 4 */}
      {hud.bossHp !== undefined && hud.bossMaxHp !== undefined && (
        <div className="mx-auto w-full max-w-md bg-purple-950/85 border-2 border-purple-300/70 rounded-2xl px-3.5 py-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-purple-100 mb-1">
            <span className="font-display text-red-300">BOSS: ENERGEN JAHAT</span>
            <span className="tabular-nums text-yellow-300">
              HP {hud.bossHp}/{hud.bossMaxHp}
            </span>
          </div>
          <div className="w-full h-3 bg-purple-900 rounded-full overflow-hidden border border-purple-400/40">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-300"
              style={{ width: `${(hud.bossHp / hud.bossMaxHp) * 100}%` }}
            />
          </div>
          {hud.bossPhaseName && (
            <div className="text-[11px] font-semibold text-purple-200 text-center mt-0.5">
              {hud.bossPhaseName}
            </div>
          )}
        </div>
      )}

      {/* Nearby interactive prompt (clickable on desktop or touch!) */}
      {hud.nearbyPrompt && (
        <div className="pointer-events-auto mx-auto">
          <button
            type="button"
            onClick={onTriggerInteract}
            className="bg-yellow-300 hover:bg-yellow-200 text-amber-950 border-2 border-amber-900 rounded-xl px-4 py-1.5 text-xs sm:text-sm font-extrabold shadow-lg animate-bounce-gentle"
          >
            {hud.nearbyPrompt} (Tekan E / Sentuh)
          </button>
        </div>
      )}
    </div>
  );
};
