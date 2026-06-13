import { Track } from './types';

// Web audio freq table helper
const NOTE_FREQS: Record<string, number> = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98,
  'REST': 0
};

class RetroChiptuneEngine {
  private ctx: AudioContext | null = null;
  private currentTrack: Track | null = null;
  private isPlaying = false;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private schedulerTimer: number | null = null;
  private currentNoteIndex = 0;
  private volumeValue = 0.3;
  private waveformType: OscillatorType = 'square';
  private tempoRatio = 1.0;
  private tickInterval = 0;

  // callbacks
  private onTickCallback?: (progress: number, totalLen: string) => void;
  private onNoteCallback?: (frequency: number, note: string) => void;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(
    track: Track,
    onTick?: (progress: number, totalLen: string) => void,
    onNotePlay?: (frequency: number, note: string) => void
  ) {
    this.init();
    this.stop();

    this.currentTrack = track;
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.tickInterval = 0;
    this.onTickCallback = onTick;
    this.onNoteCallback = onNotePlay;

    this.playNextNote();
  }

  private playNextNote() {
    if (!this.isPlaying || !this.currentTrack || !this.ctx) return;

    const notes = this.currentTrack.notes;
    if (notes.length === 0) return;

    if (this.currentNoteIndex >= notes.length) {
      // Loop track
      this.currentNoteIndex = 0;
    }

    const item = notes[this.currentNoteIndex];
    const frequency = NOTE_FREQS[item.note] || 0;
    
    // Calculate precise duration based on BPM
    const beatDuration = 60 / this.currentTrack.bpm;
    const actualDuration = item.duration * beatDuration * (1 / this.tempoRatio);

    if (frequency > 0) {
      this.triggerTone(frequency, actualDuration);
      if (this.onNoteCallback) {
        this.onNoteCallback(frequency, item.note);
      }
    } else {
      if (this.onNoteCallback) {
        this.onNoteCallback(0, 'REST');
      }
    }

    // Schedule next step
    this.schedulerTimer = window.setTimeout(() => {
      this.currentNoteIndex++;
      this.tickInterval += actualDuration;
      if (this.onTickCallback) {
        const minutes = Math.floor(this.tickInterval / 60);
        const seconds = Math.floor(this.tickInterval % 60);
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.onTickCallback(this.tickInterval, timeStr);
      }
      this.playNextNote();
    }, actualDuration * 1000);
  }

  private triggerTone(freq: number, duration: number) {
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.waveformType;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Simple 8-bit envelopes (clean retro pluck, small decay)
      gain.gain.setValueAtTime(this.volumeValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration - 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);

      const item = { osc, gain };
      this.activeOscillators.push(item);

      // Clean up reference after finish
      setTimeout(() => {
        this.activeOscillators = this.activeOscillators.filter(x => x !== item);
      }, duration * 1000);
    } catch (e) {
      console.warn("Audio Context trigger failed:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    this.activeOscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  setVolume(vol: number) {
    this.volumeValue = Math.max(0, Math.min(1, vol));
  }

  setWaveform(type: OscillatorType) {
    this.waveformType = type;
  }

  setTempo(multiplier: number) {
    this.tempoRatio = Math.max(0.2, Math.min(3.0, multiplier));
  }

  // Generate background frequency noise (static tuner) for the Radio screen
  private staticNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  startStaticNoise() {
    this.init();
    this.stopStaticNoise();
    if (!this.ctx) return;

    try {
      // Classic white noise synthesis
      const bufferSize = 4096;
      const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
      node.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * this.volumeValue * 0.15; // lower static level
        }
      };

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1;

      node.connect(filter);
      filter.connect(this.ctx.destination);

      this.staticNode = node;
      this.filterNode = filter;
    } catch (e) {
      console.warn("Tuner noise start failed:", e);
    }
  }

  setStaticFrequency(freqSlider: number) { // 0 to 100 slider
    if (this.filterNode) {
      // Map 0-100 slider to bandpass center frequency
      const freq = 150 + freqSlider * 25;
      this.filterNode.frequency.setValueAtTime(freq, this.ctx?.currentTime || 0);
    }
  }

  stopStaticNoise() {
    if (this.staticNode) {
      try {
        this.staticNode.disconnect();
        this.filterNode?.disconnect();
      } catch (e) {}
      this.staticNode = null;
      this.filterNode = null;
    }
  }
}

export const audioEngine = new RetroChiptuneEngine();
