export type ScreenType = 'TRACKS' | 'PLAY' | 'STAGES' | 'RADIO';

export interface Track {
  id: string;
  number: string;
  title: string;
  game: string;
  length: string;
  notes: { note: string; duration: number }[]; // custom notes for synthesize player
  bpm: number;
}

export interface Stage {
  id: string;
  name: string;
  game: string;
  description: string;
  trackId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';
  color: string;
}

export interface PlaybackState {
  currentTrackId: string;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number; // 0 to 1
  tempoMultiplier: number; // 0.5 to 1.5
  waveform: OscillatorType; // 'square' | 'sawtooth' | 'triangle' | 'sine'
  progress: number; // seconds elapsed
}
