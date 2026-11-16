import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  HelpCircle,
  Home,
  Map as MapIcon,
  Play,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
  X,
  XCircle,
} from 'lucide-react';
import {
  LEVEL2_FOOD_ITEMS,
  LEVEL3_LABEL_FACTS,
  LEVEL3_PAIRING_ITEMS,
  LEVELS_META,
  LEVEL_QUIZZES,
} from '../game/content';
import { soundEngine } from '../game/audio';
import { GameSettings, LevelId, SaveData } from '../game/types';
import { BoboBallsSvg, EnergenJahatSvg, MalkiSvg } from './CharacterArt';

/* 1. PETUNJUK MODAL */
export const GuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-3">
    <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-4 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-xl sm:text-2xl flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-700" />
          Petunjuk Petualangan
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-red-100 border-2 border-amber-950 flex items-center justify-center hover:bg-red-200"
          aria-label="Tutup Petunjuk"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="bg-white border-2 border-amber-900/25 rounded-2xl p-3">
          <h3 className="font-display font-bold text-base text-amber-900 mb-1.5">Kontrol Komputer</h3>
          <ul className="space-y-1 font-medium text-slate-700">
            <li>• <strong>Panah Kiri/Kanan</strong> atau <strong>A / D</strong>: Berjalan & berlari</li>
            <li>• <strong>Spasi</strong> atau <strong>Panah Atas / W</strong>: Melompat</li>
            <li>• <strong>E</strong> atau <strong>Enter</strong>: Bicara / Buka Kuis / Aksi</li>
            <li>• <strong>Esc</strong> atau <strong>P</strong>: Jeda permainan</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-amber-900/25 rounded-2xl p-3">
          <h3 className="font-display font-bold text-base text-emerald-800 mb-1.5">Kontrol HP (Layar Sentuh)</h3>
          <ul className="space-y-1 font-medium text-slate-700">
            <li>• Tombol <strong>◀ / ▶</strong> di kiri bawah: Bergerak ke kiri & kanan</li>
            <li>• Tombol <strong>▲</strong> di kanan bawah: Melompat</li>
            <li>• Tombol <strong>AKSI</strong>: Bicara dengan Malki & buka tantangan</li>
            <li>• Putar HP ke posisi <strong>Landscape (mendatar)</strong> agar nyaman!</li>
          </ul>
        </div>

        <div className="sm:col-span-2 bg-yellow-100 border-2 border-amber-800/30 rounded-2xl p-3">
          <h3 className="font-display font-bold text-base text-amber-950 mb-1">Misi & Penilaian</h3>
          <p className="text-slate-800 leading-relaxed">
            Bantu <strong>Bobo Balls</strong> dan <strong>Malki</strong> melewati 4 wilayah! Kumpulkan item gizi, sentuh bendera checkpoint, selesaikan mini-game menyusun sarapan, dan jawab 3 pertanyaan kuis di setiap level untuk meraih <strong>3 Bintang</strong>. Jika salah menjawab, jangan khawatir—baca penjelasan Malki dan coba lagi!
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold border-2 border-amber-950 shadow-[0_3px_0_#451A03]"
        >
          Siap Bermain!
        </button>
      </div>
    </div>
  </div>
);

/* 2. PENGATURAN MODAL */
export const SettingsModal: React.FC<{
  settings: GameSettings;
  onUpdate: (next: GameSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}> = ({ settings, onUpdate, onResetProgress, onClose }) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-3">
      <div className="w-full max-w-md bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl">Pengaturan</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-red-100 border-2 border-amber-950 flex items-center justify-center"
            aria-label="Tutup Pengaturan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between bg-white border-2 border-amber-900/20 rounded-2xl p-3">
            <span className="font-bold">Musik Latar</span>
            <button
              type="button"
              onClick={() => onUpdate({ ...settings, musicEnabled: !settings.musicEnabled })}
              className={`px-4 py-1.5 rounded-xl font-bold border-2 border-amber-950 ${
                settings.musicEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {settings.musicEnabled ? 'Aktif' : 'Mati'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-white border-2 border-amber-900/20 rounded-2xl p-3">
            <span className="font-bold">Efek Suara</span>
            <button
              type="button"
              onClick={() => onUpdate({ ...settings, sfxEnabled: !settings.sfxEnabled })}
              className={`px-4 py-1.5 rounded-xl font-bold border-2 border-amber-950 ${
                settings.sfxEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {settings.sfxEnabled ? 'Aktif' : 'Mati'}
            </button>
          </div>

          <div className="bg-white border-2 border-amber-900/20 rounded-2xl p-3">
            <div className="font-bold mb-2">Tombol Sentuh Layar</div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  ['auto', 'Otomatis'],
                  ['always', 'Selalu Ada'],
                  ['off', 'Sembunyi'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onUpdate({ ...settings, showTouchControls: val })}
                  className={`py-1.5 rounded-xl text-xs font-bold border-2 ${
                    settings.showTouchControls === val
                      ? 'bg-amber-400 border-amber-950 text-amber-950'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-3">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 font-bold border border-red-400 text-xs"
              >
                Reset Progres Tersimpan
              </button>
            ) : (
              <div className="space-y-2 text-center">
                <p className="text-xs font-bold text-red-900">Yakin hapus semua bintang dan level terbuka?</p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold"
                  >
                    Ya, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-1.5 rounded-xl bg-white border border-slate-400 text-xs font-bold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-amber-400 border-2 border-amber-950 font-display font-bold text-base shadow-[0_3px_0_#451A03]"
        >
          Simpan & Tutup
        </button>
      </div>
    </div>
  );
};

/* 3. PAUSE MODAL */
export const PauseModal: React.FC<{
  muted: boolean;
  onToggleMute: () => void;
  onResume: () => void;
  onRestart: () => void;
  onWorldMap: () => void;
}> = ({ muted, onToggleMute, onResume, onRestart, onWorldMap }) => (
  <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
    <div className="w-full max-w-sm bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-5 shadow-2xl text-center">
      <h2 className="font-display font-bold text-2xl mb-4">Permainan Dijeda</h2>
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onResume}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-display font-bold text-lg border-2 border-amber-950 shadow-[0_3px_0_#451A03]"
        >
          <Play className="w-5 h-5 fill-white" />
          Lanjutkan
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-300 hover:bg-amber-200 text-amber-950 font-display font-bold border-2 border-amber-950"
        >
          <RotateCcw className="w-4 h-4" />
          Ulangi Level
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white hover:bg-amber-100 text-amber-950 font-display font-bold border-2 border-amber-950"
        >
          {muted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          {muted ? 'Suara: Mati (Klik untuk Aktifkan)' : 'Suara: Aktif (Klik untuk Matikan)'}
        </button>

        <button
          type="button"
          onClick={onWorldMap}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-display font-bold border-2 border-amber-950"
        >
          <MapIcon className="w-4 h-4" />
          Kembali ke Peta Dunia
        </button>
      </div>
    </div>
  </div>
);

/* 4. MALKI DIALOG OVERLAY */
export const DialogModal: React.FC<{
  speaker: 'Malki' | 'Bobo Balls';
  title: string;
  lines: string[];
  onClose: () => void;
}> = ({ speaker, title, lines, onClose }) => {
  const [step, setStep] = useState(0);
  const isLast = step >= lines.length - 1;

  return (
    <div className="fixed inset-0 z-40 bg-black/55 flex items-end sm:items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-2xl bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center gap-3 sm:gap-5">
        <div className="shrink-0 hidden sm:block">
          {speaker === 'Malki' ? (
            <MalkiSvg className="w-24 h-24" mood="happy" />
          ) : (
            <BoboBallsSvg className="w-24 h-24" mood="happy" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-display font-bold text-sm sm:text-base text-amber-800">
              {title}
            </span>
            <span className="text-xs font-bold text-amber-700 tabular-nums">
              {step + 1}/{lines.length}
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed mb-3">
            {lines[step]}
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                soundEngine.click();
                if (isLast) onClose();
                else setStep((s) => s + 1);
              }}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-bold text-sm border-2 border-amber-950 shadow-[0_3px_0_#451A03]"
            >
              {isLast ? 'Ayo Jalan!' : 'Lanjut →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 5. QUIZ MODAL (3 questions per level, or 1 phase question in Boss Battle) */
export const QuizModal: React.FC<{
  levelId: LevelId;
  mode: 'LEVEL_GATE' | 'BOSS_PHASE';
  phase?: 1 | 2 | 3;
  onComplete: (correctCount: number) => void;
}> = ({ levelId, mode, phase, onComplete }) => {
  const allQuestions = LEVEL_QUIZZES[levelId];
  const questions =
    mode === 'BOSS_PHASE' && phase ? [allQuestions[phase - 1]] : allQuestions;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'answering' | 'correct' | 'wrong'>('answering');
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);

  const q = questions[index];

  const handleChoose = (optIdx: number) => {
    if (status === 'correct') return;
    setSelected(optIdx);
    if (optIdx === q.correctIndex) {
      soundEngine.quizCorrect();
      setStatus('correct');
      if (!hadWrongAttempt) {
        setFirstTryCorrectCount((c) => c + 1);
      }
    } else {
      soundEngine.quizWrong();
      setStatus('wrong');
      setHadWrongAttempt(true);
    }
  };

  const handleNext = () => {
    soundEngine.click();
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setStatus('answering');
      setHadWrongAttempt(false);
    } else {
      onComplete(Math.max(1, firstTryCorrectCount));
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-3">
      <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {mode === 'BOSS_PHASE' ? (
              <EnergenJahatSvg className="w-11 h-11" />
            ) : (
              <MalkiSvg className="w-11 h-11" mood="happy" />
            )}
            <div>
              <div className="text-xs font-extrabold text-amber-700">
                {mode === 'BOSS_PHASE'
                  ? `Tantangan Boss Fase ${phase} dari 3`
                  : `Kuis ${LEVELS_META[levelId].name} · Pertanyaan ${index + 1} dari ${questions.length}`}
              </div>
              <h2 className="font-display font-bold text-base sm:text-xl leading-snug">
                {q.question}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isPicked = selected === i;
            let btnStyle = 'bg-white border-amber-900/30 hover:bg-amber-100 text-slate-900';
            if (isPicked && status === 'correct') {
              btnStyle = 'bg-emerald-100 border-emerald-700 text-emerald-950';
            } else if (isPicked && status === 'wrong') {
              btnStyle = 'bg-red-100 border-red-600 text-red-950';
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleChoose(i)}
                className={`w-full text-left px-4 py-3 rounded-2xl border-2 font-semibold text-sm sm:text-base transition-colors flex items-center justify-between gap-2 min-h-[48px] ${btnStyle}`}
              >
                <span>
                  <strong className="mr-2">{String.fromCharCode(65 + i)}.</strong>
                  {opt}
                </span>
                {isPicked && status === 'correct' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                )}
                {isPicked && status === 'wrong' && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Educational Feedback */}
        {status !== 'answering' && (
          <div
            className={`mt-3 p-3 rounded-2xl border-2 text-xs sm:text-sm font-semibold ${
              status === 'correct'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                : 'bg-orange-50 border-orange-500 text-orange-950'
            }`}
          >
            <p>{status === 'correct' ? q.explanationCorrect : q.explanationWrong}</p>
            <div className="mt-2.5 flex justify-end">
              {status === 'wrong' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setStatus('answering');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 border-2 border-amber-950 text-amber-950 font-display font-bold text-xs sm:text-sm"
                >
                  Coba Pilih Lagi
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-2 border-amber-950 text-white font-display font-bold text-xs sm:text-sm"
                >
                  {mode === 'BOSS_PHASE'
                    ? 'Serang Energen Jahat!'
                    : index < questions.length - 1
                      ? 'Pertanyaan Berikutnya →'
                      : 'Buka Gerbang!'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* 6. LEVEL 2 MINI-GAME: SUSUN MENU SARAPAN BERAGAM */
export const MiniGameL2Modal: React.FC<{
  onComplete: (bonusScore: number) => void;
}> = ({ onComplete }) => {
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>(
    'Pilih 3 makanan sehat: 1 Karbohidrat + 1 Protein + 1 Sayur/Buah ke piring sarapan!'
  );
  const [success, setSuccess] = useState(false);

  const toggleItem = (id: string) => {
    const item = LEVEL2_FOOD_ITEMS.find((f) => f.id === id)!;
    if (item.category === 'kurang_sehat') {
      soundEngine.quizWrong();
      setFeedback(`Ups! ${item.name}: ${item.note}`);
      return;
    }

    soundEngine.click();
    if (pickedIds.includes(id)) {
      setPickedIds((prev) => prev.filter((x) => x !== id));
      return;
    }

    const next = [...pickedIds, id].slice(-3);
    setPickedIds(next);

    const chosen = next.map((nid) => LEVEL2_FOOD_ITEMS.find((f) => f.id === nid)!);
    const hasKarbo = chosen.some((c) => c.category === 'karbo');
    const hasProtein = chosen.some((c) => c.category === 'protein');
    const hasSayurBuah = chosen.some((c) => c.category === 'sayur_buah');

    if (chosen.length === 3 && hasKarbo && hasProtein && hasSayurBuah) {
      soundEngine.quizCorrect();
      setSuccess(true);
      setFeedback(
        'Hebat! Piring sarapanmu sudah lengkap dengan Karbohidrat, Protein, dan Vitamin dari Sayur/Buah!'
      );
    } else {
      setFeedback(item.note);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-3">
      <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-4 sm:p-5 shadow-2xl">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-emerald-900">
          Mini-Game: Susun Menu Sarapan Beragam!
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 mb-3">{feedback}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LEVEL2_FOOD_ITEMS.map((item) => {
            const active = pickedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                  active
                    ? 'bg-emerald-200 border-emerald-700 scale-[1.02] shadow-md'
                    : 'bg-white border-amber-900/25 hover:bg-amber-100'
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1">{item.emoji}</div>
                <div className="text-xs font-bold leading-tight">{item.name}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 bg-white border-2 border-amber-900/20 rounded-2xl p-3">
          <div className="text-xs sm:text-sm font-bold">
            Di Piring ({pickedIds.length}/3):{' '}
            {pickedIds
              .map((id) => LEVEL2_FOOD_ITEMS.find((f) => f.id === id)?.name)
              .join(', ') || 'Belum ada'}
          </div>
          {success && (
            <button
              type="button"
              onClick={() => onComplete(200)}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-display font-bold text-sm border-2 border-amber-950 shrink-0"
            >
              Selesai (+200)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* 7. LEVEL 3 MINI-GAME: BACA LABEL PANGAN & SARAPAN PRAKTIS */
export const MiniGameL3Modal: React.FC<{
  onComplete: (bonusScore: number) => void;
}> = ({ onComplete }) => {
  const [step, setStep] = useState<'label' | 'pairing'>('label');
  const [inspected, setInspected] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['energen']);
  const [note, setNote] = useState(
    'Klik semua bagian label pangan untuk mempelajarinya sebelum menyeduh sarapan praktis!'
  );
  const [donePairing, setDonePairing] = useState(false);

  const inspectFact = (id: string, highlight: string) => {
    soundEngine.click();
    if (!inspected.includes(id)) {
      setInspected((prev) => [...prev, id]);
    }
    setNote(highlight);
  };

  const togglePartner = (id: string) => {
    const item = LEVEL3_PAIRING_ITEMS.find((x) => x.id === id)!;
    if (!item.isHealthyPartner) {
      soundEngine.quizWrong();
      setNote(item.feedback);
      return;
    }
    soundEngine.click();
    const next = selectedIds.includes(id) ? selectedIds : [...selectedIds, id];
    setSelectedIds(next);
    setNote(item.feedback);

    if (next.includes('energen') && next.includes('telur_rebus') && next.includes('apel')) {
      soundEngine.quizCorrect();
      setDonePairing(true);
      setNote(
        'Sempurna! Energen dapat menjadi bagian dari sarapan praktis, dan dipadukan dengan telur & buah agar gizinya makin lengkap!'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-3">
      <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-4 sm:p-5 shadow-2xl">
        {step === 'label' ? (
          <>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-orange-900">
              Tantangan 1: Membaca Informasi Label Pangan
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 mb-3">{note}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LEVEL3_LABEL_FACTS.map((fact) => {
                const seen = inspected.includes(fact.id);
                return (
                  <button
                    key={fact.id}
                    type="button"
                    onClick={() => inspectFact(fact.id, fact.highlight)}
                    className={`text-left p-3 rounded-2xl border-2 transition-all ${
                      seen
                        ? 'bg-emerald-100 border-emerald-700'
                        : 'bg-white border-amber-900/30 hover:bg-amber-100'
                    }`}
                  >
                    <div className="text-xs font-extrabold text-orange-700">{fact.label}</div>
                    <div className="font-display font-bold text-base text-amber-950">{fact.value}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Diperiksa: {inspected.length}/{LEVEL3_LABEL_FACTS.length}
              </span>
              {inspected.length >= LEVEL3_LABEL_FACTS.length && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.click();
                    setStep('pairing');
                    setNote(
                      'Sekarang padukan Energen dengan Telur Rebus dan Buah agar bukan menjadi pengganti seluruh gizi!'
                    );
                  }}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white font-display font-bold text-sm border-2 border-amber-950"
                >
                  Lanjut Susun Menu Praktis →
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-orange-900">
              Tantangan 2: Sarapan Praktis Seimbang
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 mb-3">{note}</p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {LEVEL3_PAIRING_ITEMS.map((item) => {
                const active = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePartner(item.id)}
                    className={`p-2.5 rounded-2xl border-2 text-center ${
                      active
                        ? 'bg-emerald-200 border-emerald-700 shadow'
                        : 'bg-white border-amber-900/25 hover:bg-amber-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-bold leading-tight">{item.name}</div>
                  </button>
                );
              })}
            </div>

            {donePairing && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => onComplete(250)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-display font-bold text-sm border-2 border-amber-950"
                >
                  Lanjutkan ke Gerbang (+250)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* 8. LEVEL COMPLETE & GAME OVER MODALS */
export const LevelCompleteModal: React.FC<{
  levelId: LevelId;
  score: number;
  stars: number;
  itemsCollected: number;
  quizCorrect: number;
  onNextLevel: () => void;
  onWorldMap: () => void;
}> = ({ levelId, score, stars, itemsCollected, quizCorrect, onNextLevel, onWorldMap }) => {
  const meta = LEVELS_META[levelId];
  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-3">
      <div className="w-full max-w-md bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-5 shadow-2xl text-center">
        <div className="flex justify-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-10 h-10 ${
                s <= stars ? 'fill-yellow-400 text-amber-700' : 'fill-slate-200 text-slate-400'
              }`}
            />
          ))}
        </div>
        <h2 className="font-display font-bold text-2xl text-emerald-800">
          Level {levelId} Selesai!
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 mb-3">
          {meta.outroDialog}
        </p>

        <div className="grid grid-cols-3 gap-2 bg-white border-2 border-amber-900/20 rounded-2xl p-3 text-xs font-bold mb-4 tabular-nums">
          <div>
            <div className="text-slate-500">Skor</div>
            <div className="text-base font-extrabold text-amber-900">{score}</div>
          </div>
          <div>
            <div className="text-slate-500">Item</div>
            <div className="text-base font-extrabold text-amber-900">{itemsCollected}</div>
          </div>
          <div>
            <div className="text-slate-500">Kuis Benar</div>
            <div className="text-base font-extrabold text-emerald-700">{quizCorrect}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onWorldMap}
            className="flex-1 py-2.5 rounded-xl bg-white border-2 border-amber-950 font-display font-bold text-sm"
          >
            Peta Dunia
          </button>
          <button
            type="button"
            onClick={onNextLevel}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-amber-950 font-display font-bold text-sm shadow-[0_3px_0_#451A03]"
          >
            {levelId < 4 ? 'Level Berikutnya →' : 'Rayakan Kemenangan!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const GameOverModal: React.FC<{
  score: number;
  onRetry: () => void;
  onWorldMap: () => void;
}> = ({ score, onRetry, onWorldMap }) => (
  <div className="fixed inset-0 z-40 bg-black/75 flex items-center justify-center p-3">
    <div className="w-full max-w-sm bg-amber-50 text-amber-950 border-4 border-amber-950 rounded-3xl p-5 shadow-2xl text-center">
      <div className="flex justify-center mb-2">
        <BoboBallsSvg className="w-20 h-20" mood="sad" />
      </div>
      <h2 className="font-display font-bold text-2xl text-red-700">Energi Habis!</h2>
      <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 mb-3">
        Jangan menyerah ya! Ayo isi ulang tenaga Bobo Balls dan coba petualangan ini lagi. (Skor: {score})
      </p>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onWorldMap}
          className="flex-1 py-2.5 rounded-xl bg-white border-2 border-amber-950 font-display font-bold text-sm"
        >
          Peta Dunia
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-amber-950 font-display font-bold text-sm shadow-[0_3px_0_#451A03]"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  </div>
);

/* 9. FINAL VICTORY SCREEN */
export const FinalVictoryScreen: React.FC<{
  save: SaveData;
  onWorldMap: () => void;
  onMainMenu: () => void;
}> = ({ save, onWorldMap, onMainMenu }) => {
  const levels = ([1, 2, 3, 4] as LevelId[]).map((id) => ({
    id,
    meta: LEVELS_META[id],
    progress: save.levels[id],
  }));

  const totalScore = levels.reduce((acc, l) => acc + l.progress.bestScore, 0);
  const totalItems = levels.reduce((acc, l) => acc + l.progress.itemsCollected, 0);
  const totalCorrect = levels.reduce((acc, l) => acc + l.progress.quizCorrect, 0);

  return (
    <div className="relative w-full h-full overflow-y-auto bg-gradient-to-b from-yellow-300 via-amber-200 to-emerald-300 flex flex-col items-center justify-center p-4 sm:p-6 text-amber-950">
      <div className="w-full max-w-3xl bg-amber-50/95 border-4 border-amber-950 rounded-3xl p-4 sm:p-6 shadow-2xl text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-300 border-2 border-amber-950 rounded-2xl px-4 py-1 text-xs sm:text-sm font-extrabold mb-2">
          <Award className="w-4 h-4 text-amber-800" />
          MISI SARAPAN SEHAT BERHASIL
        </div>

        <h1 className="font-display font-bold text-xl sm:text-3xl text-red-700 leading-tight">
          SELAMAT! PETUALANGAN ENERGEN WORLD SELESAI!
        </h1>

        <div className="flex items-center justify-center gap-6 my-3">
          <div className="animate-bounce-gentle">
            <BoboBallsSvg className="w-20 h-20 sm:w-24 sm:h-24" mood="cheer" />
          </div>
          <div className="animate-float-slow">
            <MalkiSvg className="w-20 h-20 sm:w-24 sm:h-24" mood="cheer" />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 tabular-nums">
          <div className="bg-white border-2 border-amber-900/25 rounded-2xl p-2.5">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">Total Skor</div>
            <div className="font-display font-bold text-lg sm:text-2xl text-amber-900">{totalScore}</div>
          </div>
          <div className="bg-white border-2 border-amber-900/25 rounded-2xl p-2.5">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">Jumlah Item</div>
            <div className="font-display font-bold text-lg sm:text-2xl text-orange-700">{totalItems}</div>
          </div>
          <div className="bg-white border-2 border-amber-900/25 rounded-2xl p-2.5">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500">Jawaban Benar</div>
            <div className="font-display font-bold text-lg sm:text-2xl text-emerald-700">{totalCorrect}</div>
          </div>
        </div>

        {/* Stars per Level */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {levels.map(({ id, meta, progress }) => (
            <div key={id} className="bg-amber-100/80 border-2 border-amber-900/20 rounded-2xl p-2">
              <div className="text-[11px] font-extrabold text-amber-900 truncate">{meta.name}</div>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= progress.stars ? 'fill-yellow-400 text-amber-700' : 'fill-slate-300 text-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onWorldMap}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 border-2 border-amber-950 font-display font-bold text-sm sm:text-base shadow-[0_3px_0_#451A03]"
          >
            <MapIcon className="w-4 h-4" />
            Peta Dunia
          </button>
          <button
            type="button"
            onClick={onMainMenu}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-amber-100 border-2 border-amber-950 font-display font-bold text-sm sm:text-base shadow-[0_3px_0_#451A03]"
          >
            <Home className="w-4 h-4" />
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};
