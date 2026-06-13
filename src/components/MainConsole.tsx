import React from 'react';
import { Track, ScreenType } from '../types';
import { Sliders, RefreshCw, Volume2, Gamepad } from 'lucide-react';

interface MainConsoleProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onNavigate: (screen: ScreenType) => void;
  waveform: OscillatorType;
  onWaveformChange: (type: OscillatorType) => void;
  tempoMultiplier: number;
  onTempoChange: (mult: number) => void;
  elapsedTimeStr: string;
  visualizerNote: string;
  visualizerFreq: number;
}

export default function MainConsole({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onStop,
  onNavigate,
  waveform,
  onWaveformChange,
  tempoMultiplier,
  onTempoChange,
  elapsedTimeStr,
  visualizerNote,
  visualizerFreq
}: MainConsoleProps) {
  
  // Waveform choices
  const waveOpts: { label: string; value: OscillatorType }[] = [
    { label: 'SQR', value: 'square' },
    { label: 'TRI', value: 'triangle' },
    { label: 'SAW', value: 'sawtooth' },
    { label: 'SIN', value: 'sine' }
  ];

  return (
    <div id="main-console-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT: The Handheld Console Illustration Panel */}
      <div className="lg:col-span-8 flex flex-col items-center justify-center bg-neutral-950 p-6 md:p-8 border-4 border-[#42302e] shadow-[8px_8px_0_0_#180a09]">
        
        {/* Handheld Body */}
        <div className="w-[300px] md:w-[350px] bg-[#d1cfcd] border-y-8 border-x-4 border-b-[#9da2a6] border-t-white border-x-[#b5b8ba] rounded-[24px] p-5 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.2),8px_12px_24px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center">
          
          {/* Top Battery Red LED Light */}
          <div className="absolute top-4 left-6 flex items-center gap-1.5">
            <span className="text-[7px] text-[#717375] font-bold tracking-widest font-mono">BATTERY</span>
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#ff1e1e] animate-pulse shadow-[0_0_4px_#ff1e1e]' : 'bg-[#5e0a0a]'}`} />
          </div>

          {/* Model Stamp */}
          <div className="w-full text-center mt-2 mb-3">
            <p className="text-[8px] md:text-[9px] text-[#2c1c1a]/60 font-bold tracking-widest font-mono">
              DOT MATRIX WITH STEREO SOUND
            </p>
          </div>

          {/* Retro LCD Screen Bezel Frame */}
          <div className="w-full bg-[#70767a] p-3 rounded-b-[4px] rounded-t-[12px] border-4 border-[#5b5e61] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)] flex flex-col items-center">
            
            {/* Screen Glass */}
            <div className="w-full bg-[#8BAC0F] border-4 border-[#0F380F] p-2 aspect-[4/3] flex flex-col justify-between select-none relative font-mono text-[#0F380F] shadow-[inset_3px_3px_0_rgba(0,0,0,0.15)]">
              
              {/* Scanline pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0000000a] to-transparent bg-[length:100%_4px] pointer-events-none" />

              {/* Title & Stats */}
              <div className="z-10">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest border-b border-[#0F380F] pb-1 uppercase">
                  <span>TRACK {currentTrack.number}</span>
                  <span>{waveform.substring(0, 3).toUpperCase()} WAVE</span>
                </div>

                <p className="text-sm font-bold tracking-wider mt-1.5 uppercase truncate text-shadow-lcd">
                  {currentTrack.title}
                </p>
                <p className="text-[10px] uppercase tracking-wide opacity-80 mt-0.5 truncate">
                  ORIGIN: {currentTrack.game}
                </p>
              </div>

              {/* Graphical EQ / Visualizer wave bars */}
              <div className="h-16 flex items-end justify-between px-1 mb-1 border-b border-[#0F380F] relative overflow-hidden z-10">
                
                {/* Simulated Wave or Note Tracker */}
                {isPlaying ? (
                  Array.from({ length: 14 }).map((_, idx) => {
                    // Random-themed animation height with visualizer frequency influence
                    const baseHeight = ((idx * 3 + (visualizerFreq % 17)) % 100);
                    const animDelay = `${idx * 0.05}s`;
                    return (
                      <div
                        key={idx}
                        style={{
                          height: `${Math.max(10, Math.min(95, baseHeight))}%`,
                          animationDelay: animDelay
                        }}
                        className="w-1.5 bg-[#0F380F] animate-[equalizer_0.4s_infinite_alternate_ease-in-out]"
                      />
                    );
                  })
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest">
                    --- PRESS START / PLAY ---
                  </div>
                )}
              </div>

              {/* Bottom LCD Stats strip */}
              <div className="z-10 flex justify-between items-center text-[9px] font-bold tracking-wider pt-0.5">
                <div className="flex items-center gap-1">
                  <span>{isPlaying ? '▶' : '■'}</span>
                  <span>{elapsedTimeStr} / {currentTrack.length}</span>
                </div>
                <div className="bg-[#0F380F] text-[#8BAC0F] px-1 text-[8px] tracking-widest font-extrabold uppercase">
                  {isPlaying ? `NOTE: ${visualizerNote || '...'}` : 'IDLE'}
                </div>
              </div>
            </div>
          </div>

          {/* D-Pad & Action Buttons Container */}
          <div className="w-full mt-7 flex justify-between items-start px-2 relative z-10">
            
            {/* The Direction Pad (Left Hand side) */}
            <div className="relative w-24 h-24 flex items-center justify-center select-none scale-95 md:scale-100">
              {/* D-pad middle housing */}
              <div className="w-8 h-8 bg-[#252528] rounded-sm shadow-md" />
              
              {/* UP */}
              <button
                onClick={() => onTempoChange(Math.min(2.5, tempoMultiplier + 0.1))}
                className="absolute top-0 w-8 h-9 bg-[#252528] active:bg-[#1a1a1c] border-t-2 border-x-2 border-[#161617] rounded-t-md flex items-center justify-center text-[10px] text-white/10 hover:text-white/30"
                title="Swell Tempo"
              >
                ▲
              </button>

              {/* DOWN */}
              <button
                onClick={() => onTempoChange(Math.max(0.4, tempoMultiplier - 0.1))}
                className="absolute bottom-0 w-8 h-9 bg-[#252528] active:bg-[#1a1a1c] border-b-2 border-x-2 border-[#161617] rounded-b-md flex items-center justify-center text-[10px] text-white/10 hover:text-white/30"
                title="Slump Tempo"
              >
                ▼
              </button>

              {/* LEFT */}
              <button
                onClick={() => onTempoChange(1.0)}
                className="absolute left-0 w-9 h-8 bg-[#252528] active:bg-[#1a1a1c] border-l-2 border-y-2 border-[#161617] rounded-l-md flex items-center justify-center text-[10px] text-white/10 hover:text-white/30"
                title="Reset Tempo"
              >
                ◀
              </button>

              {/* RIGHT */}
              <button
                onClick={onTogglePlay}
                className="absolute right-0 w-9 h-8 bg-[#252528] active:bg-[#1a1a1c] border-r-2 border-y-2 border-[#161617] rounded-r-md flex items-center justify-center text-[10px] text-white/10 hover:text-white/30"
                title="Pause / Play"
              >
                ▶
              </button>
            </div>

            {/* A & B Action Buttons (Right Hand side) */}
            <div className="flex gap-4 rotate-[-12deg] mt-4 mr-1">
              
              {/* Button B [STOP] */}
              <div className="flex flex-col items-center">
                <button
                  onClick={onStop}
                  className="w-11 h-11 bg-[#b51230] rounded-full border-b-4 border-[#80071c] active:border-b-0 active:translate-y-[4px] shadow-lg flex items-center justify-center text-white/20 font-bold font-mono hover:bg-[#c91838]"
                >
                  B
                </button>
                <span className="text-[8px] text-[#2c1c1a] font-black tracking-widest mt-1 uppercase font-mono">STOP</span>
              </div>

              {/* Button A [PLAY] */}
              <div className="flex flex-col items-center">
                <button
                  onClick={onTogglePlay}
                  className="w-11 h-11 bg-[#b51230] rounded-full border-b-4 border-[#80071c] active:border-b-0 active:translate-y-[4px] shadow-lg flex items-center justify-center text-white/20 font-bold font-mono hover:bg-[#c91838]"
                >
                  A
                </button>
                <span className="text-[8px] text-[#2c1c1a] font-black tracking-widest mt-1 uppercase font-mono">PLAY</span>
              </div>
            </div>
          </div>

          {/* Dynamic SELECT and START Buttons acting as screen routing togglers */}
          <div className="w-full flex justify-center gap-10 mt-6 pb-2">
            
            {/* SELECT Link (To Tracks Screen) */}
            <div className="flex flex-col items-center rotate-[-12deg]">
              <button
                onClick={() => onNavigate('TRACKS')}
                className="w-12 h-3.5 bg-[#787b80] rounded-full shadow-inner border-y border-[#545659] active:bg-[#5b5d61] active:scale-95 transition-all"
              />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('TRACKS');
                }}
                className="text-[9px] text-[#2c1c1a] font-black tracking-widest mt-1.5 uppercase font-mono hover:text-[#b51a1a] transition-all underline decoration-dotted"
              >
                Select
              </a>
            </div>

            {/* START Link (To Stages Screen) */}
            <div className="flex flex-col items-center rotate-[-12deg]">
              <button
                onClick={() => onNavigate('STAGES')}
                className="w-12 h-3.5 bg-[#787b80] rounded-full shadow-inner border-y border-[#545659] active:bg-[#5b5d61] active:scale-95 transition-all"
              />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('STAGES');
                }}
                className="text-[9px] text-[#2c1c1a] font-black tracking-widest mt-1.5 uppercase font-mono hover:text-[#b51a1a] transition-all underline decoration-dotted"
              >
                Start
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Synthesizer Settings Dashboard */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Track Card */}
        <div className="bg-[#2c1c1a] border-4 border-[#5b403d] p-4 text-[#f9dcd8] shadow-[4px_4px_0_0_#180a09]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#ffb4ab] border-b border-[#5b403d] pb-2 flex items-center gap-2">
            <Gamepad size={14} /> NOW PLAYING DECK
          </h2>
          <div className="mt-4 flex gap-4">
            <div className="w-12 h-12 bg-[#180a09] border border-[#ffb4ab] flex items-center justify-center text-[#ffb4ab] text-xs font-bold rounded-none">
              {currentTrack.number}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#ffb4ab] font-bold tracking-wide">LEGENDARY GAME TRACK</p>
              <p className="text-sm font-extrabold uppercase mt-1 truncate">{currentTrack.title}</p>
              <p className="text-xs text-[#e4beb9] mt-0.5 uppercase truncate opacity-70">{currentTrack.game}</p>
            </div>
          </div>
        </div>

        {/* Custom Synthesizer Controls */}
        <div className="bg-[#2c1c1a] border-4 border-[#5b403d] p-4 text-[#f9dcd8] shadow-[4px_4px_0_0_#180a09] flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#ffb4ab] border-b border-[#5b403d] pb-2 flex items-center gap-2">
            <Sliders size={14} /> CHIP CONFIGURATION
          </h2>

          {/* Synth Oscillator Waveform Selector */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#e4beb9]">
              OSCILLATOR FORM
            </label>
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {waveOpts.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onWaveformChange(opt.value)}
                  className={`text-[10px] font-bold py-1 px-0.5 tracking-tighter text-center transition-all ${
                    waveform === opt.value
                      ? 'bg-[#b51a1a] text-[#ffc7c1] border border-[#ffb4ab]'
                      : 'bg-[#180a09] text-[#e4beb9]/70 border border-transparent hover:bg-[#42302e]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Tempo Multiplier Slider */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#e4beb9] mb-1">
              <span>TEMPO RATIO</span>
              <span className="text-[#ffb4ab]">{Math.round(tempoMultiplier * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={tempoMultiplier}
              onChange={(e) => onTempoChange(parseFloat(e.target.value))}
              className="w-full accent-[#b51a1a] bg-[#180a09] h-1"
            />
            <div className="flex justify-between items-center text-[8px] text-[#e4beb9]/50 tracking-wider mt-1 uppercase">
              <span>HALFSPEED</span>
              <span>NORMAL</span>
              <span>OVERCLOCK</span>
            </div>
          </div>

          {/* Instructions box */}
          <div className="bg-[#180a09] border border-[#42302e] p-2.5 text-[10px] leading-relaxed text-[#e4beb9] tracking-wider uppercase">
            <p className="text-[#ffb4ab] font-bold mb-1">🎮 PANEL KEYBOARD INSTRUCTIONS</p>
            <p>• D-PAD UP / DOWN adjusts TEMPO variables.</p>
            <p>• D-PAD RIGHT pauses melody.</p>
            <p>• Press <span className="text-[#ffb4ab]">B</span> or <span className="text-[#ffb4ab]">A</span> relative buttons on console to STOP or PLAY tracks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
