import React from 'react';
import { BookOpen, Play, Settings, Volume2, VolumeX } from 'lucide-react';
import { BoboBallsSvg, EnergenWorldLogo, MalkiSvg } from './CharacterArt';

interface MainMenuProps {
  muted: boolean;
  onStartGame: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  muted,
  onStartGame,
  onOpenGuide,
  onOpenSettings,
  onToggleMute,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-300 flex flex-col justify-between p-4 sm:p-6">
      {/* Decorative cartoon clouds */}
      <div className="pointer-events-none absolute top-6 left-10 w-28 h-10 bg-white/85 rounded-full blur-[0.5px]" />
      <div className="pointer-events-none absolute top-12 right-16 w-36 h-12 bg-white/80 rounded-full blur-[0.5px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 w-[62%] h-44 bg-emerald-500 rounded-[100%] border-t-8 border-lime-400" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 w-[58%] h-48 bg-green-600 rounded-[100%] border-t-8 border-emerald-400" />

      {/* Top corner sound button */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="text-xs sm:text-sm font-bold text-amber-950/85 bg-amber-100/80 border-2 border-amber-800/30 rounded-xl px-3 py-1">
          Edukasi Gizi Kelas 5 SD
        </div>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Aktifkan Suara' : 'Matikan Suara'}
          className="w-11 h-11 rounded-xl bg-amber-50 border-2 border-amber-900 text-amber-950 flex items-center justify-center shadow-md hover:bg-amber-100 active:scale-95 transition-transform"
        >
          {muted ? <VolumeX className="w-5 h-5 text-red-600" /> : <Volume2 className="w-5 h-5 text-emerald-700" />}
        </button>
      </div>

      {/* Center Stage: Logo + Characters + Actions */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2 sm:gap-3">
        <EnergenWorldLogo className="w-56 sm:w-72 md:w-80 drop-shadow-xl" />

        <div className="flex items-end justify-center gap-4 sm:gap-10 -my-1">
          <div className="animate-float-slow">
            <BoboBallsSvg className="w-24 h-24 sm:w-32 sm:h-32" mood="happy" />
          </div>
          <div className="animate-bounce-gentle">
            <MalkiSvg className="w-24 h-24 sm:w-32 sm:h-32" mood="happy" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-1">
          <button
            type="button"
            onClick={onStartGame}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-b from-yellow-300 to-amber-500 border-[3px] border-amber-950 text-amber-950 font-display font-bold text-lg sm:text-xl shadow-[0_5px_0_#451A03] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#451A03] transition-all whitespace-nowrap"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-950" />
            MULAI GAME
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-white border-[3px] border-amber-950 text-amber-950 font-display font-bold text-base sm:text-lg shadow-[0_4px_0_#451A03] hover:bg-amber-50 active:translate-y-1 active:shadow-[0_1px_0_#451A03] transition-all whitespace-nowrap"
          >
            <BookOpen className="w-5 h-5 text-emerald-700" />
            PETUNJUK
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-white border-[3px] border-amber-950 text-amber-950 font-display font-bold text-base sm:text-lg shadow-[0_4px_0_#451A03] hover:bg-amber-50 active:translate-y-1 active:shadow-[0_1px_0_#451A03] transition-all whitespace-nowrap"
          >
            <Settings className="w-5 h-5 text-amber-700" />
            PENGATURAN
          </button>
        </div>
      </div>

      {/* Bottom control hint */}
      <div className="relative z-10 text-center text-xs font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
        Komputer: Panah / A-D Gerak · Spasi Lompat · E Interaksi &nbsp;|&nbsp; HP: Tombol Sentuh Layar
      </div>
    </div>
  );
};
