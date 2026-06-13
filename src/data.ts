import { Track, Stage } from './types';

export const TRACKS_DATA: Track[] = [
  {
    id: 'mario',
    number: '001',
    title: 'Super Mario Bros Theme',
    game: 'NES Classic',
    length: '01:14',
    bpm: 120,
    notes: [
      { note: 'E5', duration: 0.15 },
      { note: 'E5', duration: 0.15 },
      { note: 'REST', duration: 0.15 },
      { note: 'E5', duration: 0.15 },
      { note: 'REST', duration: 0.15 },
      { note: 'C5', duration: 0.15 },
      { note: 'E5', duration: 0.3 },
      { note: 'G5', duration: 0.3 },
      { note: 'REST', duration: 0.3 },
      { note: 'G4', duration: 0.3 },
      { note: 'REST', duration: 0.3 },
      // bar 2
      { note: 'C5', duration: 0.4 },
      { note: 'REST', duration: 0.2 },
      { note: 'G4', duration: 0.4 },
      { note: 'REST', duration: 0.2 },
      { note: 'E4', duration: 0.4 },
      { note: 'REST', duration: 0.2 },
      { note: 'A4', duration: 0.3 },
      { note: 'B4', duration: 0.3 },
      { note: 'A#4', duration: 0.15 },
      { note: 'A4', duration: 0.3 },
      { note: 'G4', duration: 0.2 },
      { note: 'E5', duration: 0.2 },
      { note: 'G5', duration: 0.2 },
      { note: 'A5', duration: 0.4 },
      { note: 'F5', duration: 0.15 },
      { note: 'G5', duration: 0.15 },
      { note: 'REST', duration: 0.15 },
      { note: 'E5', duration: 0.3 },
      { note: 'C5', duration: 0.15 },
      { note: 'D5', duration: 0.15 },
      { note: 'B4', duration: 0.4 }
    ]
  },
  {
    id: 'zelda',
    number: '002',
    title: 'Legend of Zelda Title',
    game: 'Famicom / NES',
    length: '01:45',
    bpm: 130,
    notes: [
      { note: 'A#4', duration: 0.5 },
      { note: 'F4', duration: 0.25 },
      { note: 'A#4', duration: 0.25 },
      { note: 'A#4', duration: 0.15 },
      { note: 'C5', duration: 0.15 },
      { note: 'D5', duration: 0.15 },
      { note: 'D#5', duration: 0.15 },
      { note: 'F5', duration: 0.8 },
      // theme start
      { note: 'REST', duration: 0.2 },
      { note: 'F5', duration: 0.2 },
      { note: 'F5', duration: 0.15 },
      { note: 'F#5', duration: 0.15 },
      { note: 'G#5', duration: 0.15 },
      { note: 'A#5', duration: 0.8 },
      { note: 'A#5', duration: 0.2 },
      { note: 'A#5', duration: 0.15 },
      { note: 'A5', duration: 0.15 },
      { note: 'G#5', duration: 0.15 },
      { note: 'F#5', duration: 0.3 },
      { note: 'G#5', duration: 0.15 },
      { note: 'F#5', duration: 0.4 }
    ]
  },
  {
    id: 'castlevania',
    number: '003',
    title: 'Vampire Killer',
    game: 'Castlevania',
    length: '01:05',
    bpm: 140,
    notes: [
      { note: 'A4', duration: 0.2 },
      { note: 'A4', duration: 0.2 },
      { note: 'D5', duration: 0.4 },
      { note: 'C5', duration: 0.2 },
      { note: 'D5', duration: 0.2 },
      { note: 'E5', duration: 0.4 },
      { note: 'F5', duration: 0.2 },
      { note: 'E5', duration: 0.2 },
      { note: 'AA5', duration: 0.4 },
      { note: 'G5', duration: 0.2 },
      { note: 'A5', duration: 0.2 },
      { note: 'A#5', duration: 0.4 },
      { note: 'A5', duration: 0.4 },
      { note: 'E5', duration: 0.4 }
    ]
  },
  {
    id: 'metroid',
    number: '004',
    title: 'Brinstar Depths',
    game: 'Metroid NES',
    length: '01:28',
    bpm: 100,
    notes: [
      { note: 'E3', duration: 0.4 },
      { note: 'E3', duration: 0.4 },
      { note: 'G3', duration: 0.3 },
      { note: 'E3', duration: 0.4 },
      { note: 'A3', duration: 0.3 },
      { note: 'E3', duration: 0.4 },
      { note: 'A#3', duration: 0.2 },
      { note: 'A3', duration: 0.2 },
      { note: 'G3', duration: 0.3 },
      { note: 'E3', duration: 0.5 },
      { note: 'D4', duration: 0.4 },
      { note: 'C#4', duration: 0.4 },
      { note: 'C4', duration: 0.6 }
    ]
  },
  {
    id: 'megaman',
    number: '005',
    title: 'Dr. Wily Stage 1',
    game: 'Mega Man 2',
    length: '01:50',
    bpm: 148,
    notes: [
      { note: 'C4', duration: 0.15 },
      { note: 'D#4', duration: 0.15 },
      { note: 'G4', duration: 0.15 },
      { note: 'C5', duration: 0.15 },
      { note: 'D#5', duration: 0.3 },
      { note: 'D5', duration: 0.3 },
      { note: 'C5', duration: 0.3 },
      { note: 'A#4', duration: 0.3 },
      { note: 'C5', duration: 0.3 },
      { note: 'G4', duration: 0.6 },
      { note: 'REST', duration: 0.3 },
      { note: 'F4', duration: 0.3 },
      { note: 'G4', duration: 0.3 },
      { note: 'A#4', duration: 0.3 },
      { note: 'D5', duration: 0.3 }
    ]
  },
  {
    id: 'ducktales',
    number: '006',
    title: 'The Moon Theme',
    game: 'DuckTales',
    length: '01:32',
    bpm: 135,
    notes: [
      { note: 'G5', duration: 0.3 },
      { note: 'REST', duration: 0.1 },
      { note: 'G5', duration: 0.3 },
      { note: 'B5', duration: 0.3 },
      { note: 'D6', duration: 0.3 },
      { note: 'C6', duration: 0.6 },
      { note: 'C5', duration: 0.3 },
      { note: 'REST', duration: 0.1 },
      { note: 'C5', duration: 0.3 },
      { note: 'E5', duration: 0.3 },
      { note: 'G5', duration: 0.3 },
      { note: 'F5', duration: 0.6 },
      { note: 'F5', duration: 0.3 },
      { note: 'G5', duration: 0.3 },
      { note: 'A5', duration: 0.6 }
    ]
  }
];

export const STAGES_DATA: Stage[] = [
  {
    id: 'stage1',
    name: 'WORLD 1-1',
    game: 'Super Mario Bros',
    description: 'The legendary kingdom entryway complete with Pipe gates, brick stacks, and Goomba troops.',
    trackId: 'mario',
    difficulty: 'EASY',
    color: '#38bdf8' // Sky blue
  },
  {
    id: 'stage2',
    name: 'HYRULE OVERWORLD',
    game: 'Legend of Zelda',
    description: 'A vast pixelated labyrinth filled with hostile Octoroks, hidden dungeon caverns, and magical relics.',
    trackId: 'zelda',
    difficulty: 'MEDIUM',
    color: '#22c55e' // Forest green
  },
  {
    id: 'stage3',
    name: 'CASTLE ENTRANCE',
    game: 'Castlevania',
    description: 'The spooky vestibule of Count Dracula\'s castle. Bats scream and torches guide the path of the dark lord.',
    trackId: 'castlevania',
    difficulty: 'MEDIUM',
    color: '#ef4444' // Sanguine red
  },
  {
    id: 'stage4',
    name: 'BRINSTAR DEPTHS',
    game: 'Metroid',
    description: 'A hostile alien ecosystem. Red rock terrain housing Kraid, Ridley, and acidic flora underneath.',
    trackId: 'metroid',
    difficulty: 'HARD',
    color: '#a855f7' // Xenomorph purple
  },
  {
    id: 'stage5',
    name: 'WILY FORTRESS',
    game: 'Mega Man 2',
    description: 'The metallic stronghold of the maniacal mad scientist. Laser spikes and structural traps await Mega Man.',
    trackId: 'megaman',
    difficulty: 'BOSS',
    color: '#64748b' // Slate steel
  },
  {
    id: 'stage6',
    name: 'THE LUNAR SURFACE',
    game: 'DuckTales',
    description: 'Gravity-defying planetary exploration! Play golf with meteorites and dodge spatial space octopuses.',
    trackId: 'ducktales',
    difficulty: 'MEDIUM',
    color: '#0ea5e9' // Celestial blue
  }
];
