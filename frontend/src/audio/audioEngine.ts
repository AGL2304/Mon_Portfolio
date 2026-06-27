/**
 * Moteur audio generatif (Web Audio API native, zero dependance).
 *
 * Genere une ambiance "cyber" sans aucun fichier MP3 (libre de droits, hors-ligne) :
 * une nappe de 3 voix qui morphe sur une progression d'accords (Am - F - C - G),
 * une basse soutenue, et un arpege pentatonique, le tout passe dans un delay
 * feedback pour l'espace. Expose un AnalyserNode pour piloter le fond audio-reactif.
 *
 * Singleton : le lecteur ET le fond partagent la meme instance / le meme analyser.
 */

export type EngineState = { playing: boolean; volume: number };
type Listener = (state: EngineState) => void;

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Progression d'accords (triades, notes MIDI) en La mineur : i - VI - III - VII.
const CHORDS: number[][] = [
  [57, 60, 64], // Am : A3 C4 E4
  [53, 57, 60], // F  : F3 A3 C4
  [48, 52, 55], // C  : C3 E3 G3
  [55, 59, 62], // G  : G3 B3 D4
];
// Basse (un La/Fa/Do/Sol grave par accord).
const BASS_MIDI = [45, 41, 36, 43]; // A2 F2 C2 G2

const STEP_SECONDS = 60 / 68 / 2; // arpege en croches a ~68 bpm
const STEPS_PER_CHORD = 8;

type WindowWithWebkit = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as WindowWithWebkit;
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private master: GainNode | null = null; // gain final (fade in/out + volume)
  private voiceBus: GainNode | null = null; // bus des nappes/basse/arpege

  private padOscillators: OscillatorNode[] = []; // 2 par voix (detune) -> 6
  private padGains: GainNode[] = []; // 1 par voix -> 3
  private bassOsc: OscillatorNode | null = null;
  private arpGain: GainNode | null = null;

  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private chordIndex = 0;

  private playing = false;
  private volume = 0.6;
  private listeners = new Set<Listener>();

  /* ----------------------------- API publique ----------------------------- */

  isSupported(): boolean {
    return getAudioContextCtor() !== null;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  getVolume(): number {
    return this.volume;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.snapshot());
    return () => {
      this.listeners.delete(fn);
    };
  }

  async toggle(): Promise<void> {
    if (this.playing) this.pause();
    else await this.play();
  }

  async play(): Promise<void> {
    const ctx = this.ensureGraph();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), now);
    this.master.gain.linearRampToValueAtTime(this.volume, now + 1.4);

    this.applyChord(this.chordIndex, now, 0.05);
    if (!this.timer) {
      this.timer = setInterval(() => this.tick(), STEP_SECONDS * 1000);
    }
    this.playing = true;
    this.emit();
  }

  pause(): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.0001, now + 0.6);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Suspend apres le fade pour economiser le CPU (les nappes restent en place).
    window.setTimeout(() => {
      if (!this.playing && this.ctx && this.ctx.state === "running") {
        void this.ctx.suspend();
      }
    }, 700);

    this.playing = false;
    this.emit();
  }

  setVolume(v: number): void {
    this.volume = Math.min(1, Math.max(0, v));
    if (this.playing && this.ctx && this.master) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(Math.max(0.0001, this.volume), now + 0.15);
    }
    this.emit();
  }

  /* ------------------------------- Interne -------------------------------- */

  private snapshot(): EngineState {
    return { playing: this.playing, volume: this.volume };
  }

  private emit(): void {
    const s = this.snapshot();
    this.listeners.forEach((fn) => fn(s));
  }

  private ensureGraph(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const Ctor = getAudioContextCtor();
    if (!Ctor) return null;

    const ctx = new Ctor();
    this.ctx = ctx;

    // Chaine maitresse : voiceBus -> filtre -> (dry + delay) -> compresseur -> master -> analyser -> sortie.
    const master = ctx.createGain();
    master.gain.value = 0.0001;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.82;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 24;
    comp.ratio.value = 3;
    comp.attack.value = 0.01;
    comp.release.value = 0.25;

    const voiceBus = ctx.createGain();
    voiceBus.gain.value = 0.5;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1500;
    filter.Q.value = 0.6;

    // LFO lent sur la coupure du filtre (mouvement organique).
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 700;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    // Delay feedback pour l'espace.
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.34;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.34;
    const wet = ctx.createGain();
    wet.gain.value = 0.5;

    voiceBus.connect(filter);
    filter.connect(comp); // signal direct (dry)
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(comp);

    comp.connect(master);
    master.connect(analyser);
    analyser.connect(ctx.destination);

    this.master = master;
    this.analyser = analyser;
    this.voiceBus = voiceBus;

    // 3 voix de nappe (2 oscillateurs detunes chacune) toujours actives.
    for (let i = 0; i < 3; i++) {
      const vGain = ctx.createGain();
      vGain.gain.value = 0.16;
      vGain.connect(voiceBus);
      this.padGains.push(vGain);

      for (let d = 0; d < 2; d++) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.detune.value = d === 0 ? -5 : 6;
        osc.connect(vGain);
        osc.start();
        this.padOscillators.push(osc);
      }
    }

    // Basse soutenue.
    const bass = ctx.createOscillator();
    bass.type = "sine";
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.22;
    bass.connect(bassGain).connect(voiceBus);
    bass.start();
    this.bassOsc = bass;

    // Bus de l'arpege.
    const arpGain = ctx.createGain();
    arpGain.gain.value = 0.0001;
    arpGain.connect(voiceBus);
    this.arpGain = arpGain;

    return ctx;
  }

  private applyChord(index: number, when: number, glide: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chord = CHORDS[index];

    for (let v = 0; v < 3; v++) {
      const freq = midiToFreq(chord[v]);
      const o1 = this.padOscillators[v * 2];
      const o2 = this.padOscillators[v * 2 + 1];
      [o1, o2].forEach((osc) => {
        if (!osc) return;
        osc.frequency.cancelScheduledValues(when);
        osc.frequency.setValueAtTime(osc.frequency.value, when);
        osc.frequency.linearRampToValueAtTime(freq, when + glide + 1.1);
      });
    }

    if (this.bassOsc) {
      const bf = midiToFreq(BASS_MIDI[index]);
      this.bassOsc.frequency.cancelScheduledValues(when);
      this.bassOsc.frequency.setValueAtTime(this.bassOsc.frequency.value, when);
      this.bassOsc.frequency.linearRampToValueAtTime(bf, when + glide + 0.9);
    }
  }

  private tick(): void {
    const ctx = this.ctx;
    if (!ctx || !this.voiceBus) return;
    const now = ctx.currentTime + 0.03;

    // Changement d'accord toutes les STEPS_PER_CHORD croches.
    if (this.step % STEPS_PER_CHORD === 0) {
      this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
      this.applyChord(this.chordIndex, now, 0.05);
    }

    // Arpege : tons de l'accord montes d'une octave, motif a 4 pas.
    const chord = CHORDS[this.chordIndex];
    const pattern = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12];
    const note = pattern[this.step % pattern.length];
    this.pluck(midiToFreq(note), now);

    this.step = (this.step + 1) % (STEPS_PER_CHORD * CHORDS.length);
  }

  private pluck(freq: number, when: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.arpGain) return;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(0.18, when + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 0.9);

    osc.connect(env).connect(this.arpGain);
    osc.start(when);
    osc.stop(when + 1.0);
    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
    };
  }
}

export const audioEngine = new AudioEngine();
