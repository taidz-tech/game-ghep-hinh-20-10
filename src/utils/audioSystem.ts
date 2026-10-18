/**
 * Web Audio API based sound synthesizer
 * Zero external audio file dependencies - 100% reliable, zero network latency
 */

class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.35;
        this.bgmGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1.0, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  /**
   * Click sound - soft woodblock tap
   */
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  /**
   * Correct placement sound - sparkling celesta arpeggio (C5 -> E5 -> G5 -> C6)
   */
  public playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.07;
      const duration = 0.45;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  /**
   * Wrong placement sound - cute friendly gentle wobble
   */
  public playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(190, now + 0.12);
    osc.frequency.linearRampToValueAtTime(150, now + 0.28);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  /**
   * Victory sound - triumphant royal fanfare and bells
   */
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0.0, dur: 0.35 },    // C major
      { notes: [587.33, 739.99, 880.00], time: 0.32, dur: 0.35 },   // D major
      { notes: [659.25, 830.61, 987.77], time: 0.64, dur: 0.4 },    // E major
      { notes: [783.99, 987.77, 1318.51, 1567.98], time: 1.05, dur: 1.6 }, // G - C high flourish
    ];

    const now = this.ctx.currentTime;
    chords.forEach(({ notes, time, dur }) => {
      notes.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    });
  }

  /**
   * Gentle, sweet background music (cute acoustic music box melody)
   */
  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Melody notes in pentatonic/diatonic warm romantic scale
    const melody = [
      // phrase 1 (F major / C major warmth)
      { f: 523.25, d: 0.4, p: 0.45 }, // C5
      { f: 587.33, d: 0.4, p: 0.45 }, // D5
      { f: 659.25, d: 0.7, p: 0.8 },  // E5
      { f: 783.99, d: 0.4, p: 0.45 }, // G5
      { f: 659.25, d: 0.5, p: 0.6 },  // E5
      { f: 523.25, d: 0.7, p: 0.85 }, // C5

      // phrase 2
      { f: 440.00, d: 0.4, p: 0.45 }, // A4
      { f: 523.25, d: 0.4, p: 0.45 }, // C5
      { f: 587.33, d: 0.8, p: 0.9 },  // D5
      { f: 523.25, d: 0.5, p: 0.6 },  // C5
      { f: 392.00, d: 0.8, p: 1.0 },  // G4

      // phrase 3
      { f: 523.25, d: 0.4, p: 0.45 }, // C5
      { f: 659.25, d: 0.4, p: 0.45 }, // E5
      { f: 783.99, d: 0.6, p: 0.7 },  // G5
      { f: 880.00, d: 0.5, p: 0.6 },  // A5
      { f: 1046.50, d: 0.9, p: 1.1 }, // C6
      { f: 783.99, d: 0.7, p: 0.85 }, // G5

      // phrase 4 (soft resolution)
      { f: 659.25, d: 0.4, p: 0.5 },  // E5
      { f: 587.33, d: 0.5, p: 0.6 },  // D5
      { f: 523.25, d: 1.2, p: 1.6 },  // C5
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const current = melody[noteIdx % melody.length];
      const now = this.ctx.currentTime;

      // Bell / music box tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(current.f, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + current.d);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + current.d + 0.05);

      // Harmony bass note every 4 notes
      if (noteIdx % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        const bassFreq = current.f > 500 ? current.f / 4 : current.f / 2;
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassGain.gain.setValueAtTime(0.05, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0005, now + 1.2);
        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);
        bassOsc.start(now);
        bassOsc.stop(now + 1.3);
      }

      noteIdx++;
      this.bgmTimeoutId = window.setTimeout(playNextNote, current.p * 1000);
    };

    playNextNote();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }
}

export const sound = new AudioSystem();
