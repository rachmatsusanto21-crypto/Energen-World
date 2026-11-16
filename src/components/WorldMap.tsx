import React from 'react';
import { ArrowLeft, Lock, Play, Settings, Star, Trophy } from 'lucide-react';
import { LEVELS_META } from '../game/content';
import { LevelId, SaveData } from '../game/types';

interface WorldMapProps {
  save: SaveData;
  onSelectLevel: (id: LevelId) => void;
  onBackMenu: () => void;
  onOpenSettings: () => void;
  onOpenFinalVictory: () => void;
}

const REGION_STYLES: Record<LevelId, { badge: string; cardBg: string; icon: string }> = {
  1: {
    badge: 'bg-emerald-600 text-white',
    cardBg: 'from-emerald-50 to-green-100 border-emerald-700',
    icon: '🌳',
  },
  2: {
    badge: 'bg-amber-500 text-amber-950',
    cardBg: 'from-lime-50 to-amber-100 border-amber-700',
    icon: '🍎',
  },
  3: {
    badge: 'bg-orange-600 text-white',
    cardBg: 'from-orange-50 to-amber-100 border-orange-700',
    icon: '🏭',
  },
  4: {
    badge: 'bg-purple-700 text-white',
    cardBg: 'from-purple-100 to-indigo-200 border-purple-900',
    icon: '🏰',
  },
};

export const WorldMap: React.FC<WorldMapProps> = ({
  save,
  onSelectLevel,
  onBackMenu,
  onOpenSettings,
  onOpenFinalVictory,
}) => {
  const totalStars = ([1, 2, 3, 4] as LevelId[]).reduce(
    (sum, id) => sum + save.levels[id].stars,
    0
  );
  const totalScore = ([1, 2, 3, 4] as LevelId[]).reduce(
    (sum, id) => sum + save.levels[id].bestScore,
    0
  );
  const allCompleted = ([1, 2, 3, 4] as LevelId[]).every((id) => save.levels[id].completed);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-300 via-emerald-200 to-lime-300 flex flex-col p-3 sm:p-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={onBackMenu}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border-2 border-amber-950 text-amber-950 font-display font-bold text-sm shadow-[0_3px_0_#451A03] active:translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Menu
        </button>

        <h1 className="font-display font-bold text-xl sm:text-2xl text-amber-950 bg-yellow-300 border-2 border-amber-950 rounded-2xl px-5 py-1 shadow-[0_3px_0_#451A03]">
          PETA DUNIA ENERGEN
        </h1>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-3 bg-amber-950/85 text-white rounded-xl px-3.5 py-1.5 text-xs font-bold tabular-nums">
            <span className="flex items-center gap-1 text-yellow-300">
              <Star className="w-4 h-4 fill-yellow-300" /> {totalStars}/12
            </span>
            <span>Skor: {totalScore}</span>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Pengaturan"
            className="w-10 h-10 rounded-xl bg-white border-2 border-amber-950 text-amber-950 flex items-center justify-center shadow-[0_3px_0_#451A03] active:translate-y-0.5 transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4 Regions Grid connected visually */}
      <div className="relative flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch min-h-0">
        {([1, 2, 3, 4] as LevelId[]).map((id) => {
          const meta = LEVELS_META[id];
          const progress = save.levels[id];
          const unlocked = id <= save.unlockedLevel;
          const style = REGION_STYLES[id];

          return (
            <div
              key={id}
              className={`relative flex flex-col justify-between rounded-2xl border-[3px] p-3 sm:p-4 shadow-[0_5px_0_rgba(69,26,3,0.45)] transition-transform ${
                unlocked
                  ? `bg-gradient-to-b ${style.cardBg} hover:-translate-y-0.5`
                  : 'bg-slate-200/90 border-slate-500 opacity-85'
              }`}
            >
              {/* Region Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg ${style.badge}`}>
                    LEVEL {id}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= progress.stars
                            ? 'fill-yellow-400 text-amber-700'
                            : 'fill-slate-300 text-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl" aria-hidden="true">
                    {style.icon}
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-amber-950 leading-tight">
                      {meta.name}
                    </h2>
                    <p className="text-xs font-bold text-amber-800">{meta.subtitle}</p>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-700 leading-snug line-clamp-3 mt-1.5">
                  {meta.description}
                </p>
              </div>

              {/* Action Footer */}
              <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between gap-2">
                {unlocked ? (
                  <>
                    <span className="text-[11px] font-bold text-amber-900 tabular-nums">
                      {progress.completed ? `Skor: ${progress.bestScore}` : 'Siap Dimainkan'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectLevel(id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-amber-950 text-amber-950 font-display font-bold text-xs sm:text-sm shadow-[0_3px_0_#451A03] active:translate-y-0.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-950" />
                      {progress.completed ? 'Main Lagi' : 'Mainkan'}
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-slate-600">
                    <Lock className="w-4 h-4" />
                    Selesaikan Level {id - 1}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Trophy Button if all 4 levels completed */}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-amber-950/90">
          Selesaikan setiap wilayah secara berurutan untuk membuka Kastil Rasa Lapar!
        </div>
        {allCompleted && (
          <button
            type="button"
            onClick={onOpenFinalVictory}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-yellow-300 border-2 border-amber-950 text-amber-950 font-display font-bold text-xs sm:text-sm shadow-md hover:bg-yellow-200"
          >
            <Trophy className="w-4 h-4 text-amber-800" />
            Lihat Layar Kemenangan
          </button>
        )}
      </div>
    </div>
  );
};
