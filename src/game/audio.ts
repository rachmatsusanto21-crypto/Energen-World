type MusicMode = 'menu' | 'adventure' | 'boss' | 'none';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicEnabled = true;
  private sfxEnabled = true;
  private currentMode: MusicMode = 'none';
  private loopTimer: number | null = null;
  private step = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.ensureContext();
  }

  public configure(musicEnabled: boolean, sfxEnabled: boolean): void {
    this.musicEnabled = musicEnabled;
    this.sfxEnabled = sfxEnabled;
    if (!musicEnabled) {
      this.stopMusicLoop();
    } else if (this.currentMode !== 'none') {
      this.startMusicLoop(this.currentMode);
    }
  }

  public setMusicMode(mode: MusicMode): void {
    if (this.currentMode === mode && this.loopTimer !== null) return;
    this.currentMode = mode;
    this.stopMusicLoop();
    if (mode !== 'none' && this.musicEnabled) {
      this.startMusicLoop(mode);
    }
  }

  private stopMusicLoop(): void {
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
  }

  private startMusicLoop(mode: MusicMode): void {
    this.stopMusicLoop();
    this.step = 0;

    // Cheerful C-major / pentatonic notes in Hz
    const menuNotes = [523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 587.33];
    const adventureNotes = [
      523.25, 587.33, 659.25, 783.99, 659.25, 783.99, 880.0, 1046.5,
      880.0, 783.99, 659.25, 587.33, 659.25, 523.25, 587.33, 523.25,
    ];
    const bossNotes = [
      220.0, 261.63, 293.66, 329.63, 293.66, 261.63, 246.94, 220.0,
      293.66, 329.63, 392.0, 349.23, 329.63, 293.66, 261.63, 246.94,
    ];

    const notes =
      mode === 'boss' ? bossNotes : mode === 'adventure' ? adventureNotes : menuNotes;
    const tempoMs = mode === 'boss' ? 210 : mode === 'adventure' ? 240 : 320;

    this.loopTimer = window.setInterval(() => {
      if (!this.musicEnabled || this.currentMode === 'none') return;
      const ctx = this.ctx;
      if (!ctx || ctx.state !== 'running') return;

      const freq = notes[this.step % notes.length];
      this.step += 1;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = mode === 'boss' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(mode === 'boss' ? 0.032 : 0.038, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (tempoMs / 1000) * 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (tempoMs / 1000) * 0.9);
    }, tempoMs);
  }

  private playTone(
    freq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.14,
    delay = 0
  ): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + duration);
    }

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  public click(): void {
    this.playTone(540, 680, 0.07, 'triangle', 0.12);
  }

  public jump(): void {
    this.playTone(280, 580, 0.15, 'sine', 0.14);
  }

  public collect(): void {
    this.playTone(660, 880, 0.09, 'triangle', 0.13, 0);
    this.playTone(880, 1180, 0.11, 'triangle', 0.11, 0.06);
  }

  public symbol(): void {
    this.playTone(523.25, 523.25, 0.09, 'triangle', 0.14, 0);
    this.playTone(659.25, 659.25, 0.09, 'triangle', 0.14, 0.08);
    this.playTone(783.99, 1046.5, 0.18, 'triangle', 0.14, 0.16);
  }

  public checkpoint(): void {
    this.playTone(523.25, 523.25, 0.1, 'sine', 0.14, 0);
    this.playTone(659.25, 659.25, 0.1, 'sine', 0.14, 0.09);
    this.playTone(1046.5, 1046.5, 0.22, 'sine', 0.15, 0.18);
  }

  public stomp(): void {
    this.playTone(320, 140, 0.12, 'square', 0.1);
  }

  public hurt(): void {
    this.playTone(220, 95, 0.24, 'sawtooth', 0.12);
  }

  public quizCorrect(): void {
    this.playTone(523.25, 523.25, 0.1, 'triangle', 0.14, 0);
    this.playTone(659.25, 659.25, 0.1, 'triangle', 0.14, 0.09);
    this.playTone(783.99, 783.99, 0.1, 'triangle', 0.14, 0.18);
    this.playTone(1046.5, 1046.5, 0.26, 'triangle', 0.16, 0.27);
  }

  public quizWrong(): void {
    this.playTone(260, 210, 0.15, 'triangle', 0.12, 0);
    this.playTone(210, 170, 0.2, 'triangle', 0.12, 0.14);
  }

  public bossHit(): void {
    this.playTone(180, 60, 0.28, 'sawtooth', 0.16, 0);
    this.playTone(440, 880, 0.18, 'triangle', 0.12, 0.06);
  }

  public victory(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const delays = [0, 0.11, 0.22, 0.33, 0.48, 0.6];
    notes.forEach((n, idx) => {
      this.playTone(n, n, idx === notes.length - 1 ? 0.38 : 0.11, 'triangle', 0.15, delays[idx]);
    });
  }
}

export const soundEngine = new SoundEngine();
