import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Hand } from 'lucide-react';
import { gameBus } from '../game/eventBus';

interface TouchControlsProps {
  visible: boolean;
  nearbyPrompt: string | null;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ visible, nearbyPrompt }) => {
  if (!visible) return null;

  const send = (action: 'left' | 'right' | 'jump' | 'interact', pressed: boolean) => {
    gameBus.emit('touch-input', { action, pressed });
  };

  const makeHandlers = (action: 'left' | 'right' | 'jump' | 'interact') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      send(action, true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      send(action, false);
    },
    onPointerCancel: () => send(action, false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-4 pb-3 sm:px-6 sm:pb-4">
      {/* Bottom-left: Left & Right */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Geser Kiri"
          {...makeHandlers('left')}
          className="touch-control-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-950/55 border-2 border-amber-100/75 text-white flex items-center justify-center shadow-lg active:scale-90 active:bg-amber-700/80 transition-transform"
        >
          <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.8]" />
        </button>

        <button
          type="button"
          aria-label="Geser Kanan"
          {...makeHandlers('right')}
          className="touch-control-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-950/55 border-2 border-amber-100/75 text-white flex items-center justify-center shadow-lg active:scale-90 active:bg-amber-700/80 transition-transform"
        >
          <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.8]" />
        </button>
      </div>

      {/* Bottom-right: Interact & Jump */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Tombol Interaksi"
          {...makeHandlers('interact')}
          className={`touch-control-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all ${
            nearbyPrompt
              ? 'bg-amber-400 border-white text-amber-950 animate-bounce-gentle ring-4 ring-amber-300/60'
              : 'bg-amber-950/50 border-amber-100/65 text-amber-100'
          }`}
        >
          <Hand className="w-6 h-6 stroke-[2.5]" />
          <span className="text-[10px] font-extrabold leading-none mt-0.5">AKSI</span>
        </button>

        <button
          type="button"
          aria-label="Lompat"
          {...makeHandlers('jump')}
          className="touch-control-btn w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-emerald-600/80 border-2 border-white text-white flex items-center justify-center shadow-xl active:scale-90 active:bg-emerald-500 transition-transform"
        >
          <ArrowUp className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
