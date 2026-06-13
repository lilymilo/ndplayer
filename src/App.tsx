import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, Track } from './types';
import { TRACKS_DATA } from './data';
import { audioEngine } from './audioEngine';
import TracksView from './components/TracksView';
import MainConsole from './components/MainConsole';
import StagesView from './components/StagesView';
import RadioView from './components/RadioView';
import { Volume2, VolumeX, Keyboard, RefreshCcw, Gamepad, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('TRACKS');
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [elapsedTimeStr, setElapsedTimeStr] = useState('00:00');
  
  // Audio state
  const [volume, setVolume] = useState(0.4);
  const [waveform, setWaveform] = useState<OscillatorType>('square');
  const [tempoMultiplier, setTempoMultiplier] = useState(1.0);
  
  // Realtime visualizer indicators
  const [visualizerNote, setVisualizerNote] = useState('...');
  const [visualizerFreq, setVisualizerFreq] = useState(0);

  // Screen transition config
  const [transitionDirection, setTransitionDirection] = useState<'push' | 'push_back' | 'none'>('none');

  // Mute Toggle
  const [isMuted, setIsMuted] = useState(false);

  // Synchronize player setup
  useEffect(() => {
    if (isPlaying) {
      audioEngine.setVolume(isMuted ? 0 : volume);
      audioEngine.setWaveform(waveform);
      audioEngine.setTempo(tempoMultiplier);

      audioEngine.play(
        currentTrack,
        (sec, timeStr) => {
          setElapsedSeconds(sec);
          setElapsedTimeStr(timeStr);
        },
        (freq, noteName) => {
          setVisualizerNote(noteName);
          setVisualizerFreq(freq);
        }
      );
    } else {
      audioEngine.stop();
      setVisualizerNote('...');
      setVisualizerFreq(0);
    }
  }, [isPlaying, currentTrack]);

  // Reactive audio attributes adjustment
  useEffect(() => {
    audioEngine.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  useEffect(() => {
    audioEngine.setWaveform(waveform);
  }, [waveform]);

  useEffect(() => {
    audioEngine.setTempo(tempoMultiplier);
  }, [tempoMultiplier]);

  // Safe release on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Custom Navigation Router supporting specified specs
  const handleNavigate = (target: ScreenType, specificTransition?: 'push' | 'push_back' | 'none') => {
    if (specificTransition) {
      setTransitionDirection(specificTransition);
    } else {
      setTransitionDirection('none');
    }
    
    // Stop tuner static when moving away from radio
    if (activeScreen === 'RADIO' && target !== 'RADIO') {
      audioEngine.stopStaticNoise();
    }

    setActiveScreen(target);
  };

  const togglePlay = () => {
    // Lazy initializing support for safety web audio rules
    audioEngine.init();
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    setElapsedTimeStr('00:00');
    audioEngine.stop();
  };

  const handleTrackChange = (track: Track) => {
    audioEngine.init();
    setCurrentTrack(track);
    setElapsedSeconds(0);
    setElapsedTimeStr('00:00');
    // If it was already active, force restarted playback
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 150);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Motion Variants
  const variants = {
    initial: (dir: 'push' | 'push_back' | 'none') => {
      if (dir === 'push') return { x: '100%', opacity: 0.8 };
      if (dir === 'push_back') return { x: '-100%', opacity: 0.8 };
      return { opacity: 0 };
    },
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: (dir: 'push' | 'push_back' | 'none') => {
      if (dir === 'push') return { x: '-100%', opacity: 0.8, transition: { ease: 'easeInOut', duration: 0.2 } };
      if (dir === 'push_back') return { x: '100%', opacity: 0.8, transition: { ease: 'easeInOut', duration: 0.2 } };
      return { opacity: 0, transition: { duration: 0.1 } };
    }
  };

  // Screen Title generator for top panel header
  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'PLAY': return 'NES MAIN CONSOLE';
      case 'TRACKS': return 'NES MUSIC SOUND TEST';
      case 'STAGES': return '8-BIT ADVENTURE STAGES';
      case 'RADIO': return 'RETRO CHIPTUNE TUNER';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1e100e] text-[#f9dcd8] pb-32">
      
      {/* Background visual asset layer */}
      <div className="fixed inset-0 z-0 bg-cover bg-center opacity-30 select-none pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200')" }} />
      
      {/* Visual CRT Glass Screen Scanlines */}
      <div className="fixed inset-0 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[size:100%_4px,3px_100%] pointer-events-none" />

      {/* Retro Header Nav Panel */}
      <header className="sticky top-0 w-full bg-[#1e100e] z-30 border-b-4 border-[#42302e] shadow-[0_4px_0_0_#42302e] flex justify-between items-center px-4 md:px-8 h-20">
        <div className="flex items-center gap-2 md:gap-4">
          <Gamepad className="text-[#ffb4ab] shrink-0" size={24} />
          <div>
            <span className="text-[10px] md:text-xs font-black text-[#ffb4ab] uppercase tracking-widest block font-mono">RETRO CHIP</span>
            <span className="text-sm md:text-base font-extrabold text-white tracking-widest uppercase font-mono">
              {getScreenTitle()}
            </span>
          </div>
        </div>

        {/* Top Control widgets */}
        <div className="flex items-center gap-2">
          {/* Mute Widget Button */}
          <button
            onClick={toggleMute}
            className="p-2 border-2 border-[#5b403d] bg-[#2c1c1a] text-[#ffb4ab] hover:bg-[#bba09b]/15 active:translate-y-[2px] transition-all"
            title="Toggle Squelch"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Sizing Indicator scale */}
          <div className="hidden sm:flex bg-[#180a09] border border-[#5b403d] px-2.5 py-1 text-[10px] text-[#ffb4ab] tracking-widest font-bold font-mono">
            V-CLK: 1.79 MHZ
          </div>
        </div>
      </header>

      {/* Screen Container Canvas */}
      <main className="relative z-10 pt-8 px-4 md:px-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait" custom={transitionDirection}>
          <motion.div
            key={activeScreen}
            custom={transitionDirection}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {activeScreen === 'TRACKS' && (
              <TracksView
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTrackSelect={handleTrackChange}
                onTogglePlay={togglePlay}
              />
            )}

            {activeScreen === 'PLAY' && (
              <MainConsole
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onStop={handleStop}
                onNavigate={(target) => {
                  let edge: 'push' | 'push_back' | 'none' = 'none';
                  if (target === 'TRACKS') edge = 'push';
                  if (target === 'STAGES') edge = 'push';
                  handleNavigate(target, edge);
                }}
                waveform={waveform}
                onWaveformChange={setWaveform}
                tempoMultiplier={tempoMultiplier}
                onTempoChange={setTempoMultiplier}
                elapsedTimeStr={elapsedTimeStr}
                visualizerNote={visualizerNote}
                visualizerFreq={visualizerFreq}
              />
            )}

            {activeScreen === 'STAGES' && (
              <StagesView
                currentTrack={currentTrack}
                onTrackSelect={handleTrackChange}
                onNavigateToConsole={() => handleNavigate('PLAY', 'none')}
              />
            )}

            {activeScreen === 'RADIO' && (
              <RadioView
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTrackSelect={handleTrackChange}
                onTogglePlay={togglePlay}
                onNavigate={(target) => {
                  let edge: 'push' | 'push_back' | 'none' = 'none';
                  if (target === 'PLAY') edge = 'push_back';
                  handleNavigate(target, edge);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Consolidated Retro Console Navigation Bezel Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-30 bg-[#2c1c1a] border-t-4 border-[#5b403d] shadow-[0_-4px_0_0_#180a09] flex justify-around items-center px-2 pb-2 h-24">
        
        {/* Tab PLAY (Sends to Console) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('PLAY', 'none');
          }}
          className={`flex flex-col items-center justify-center p-2.5 transition-all text-xs font-bold font-mono tracking-widest ${
            activeScreen === 'PLAY'
              ? 'bg-[#b51a1a] text-white border-2 border-[#ffb4ab] translate-y-1 shadow-none'
              : 'text-[#e4beb9] opacity-80 border-2 border-transparent hover:bg-[#42302e]/60 active:translate-y-1'
          }`}
        >
          <span className="text-base sm:text-lg mb-0.5">▶</span>
          <span>PLAY</span>
        </a>

        {/* Tab TRACKS (Sends to list tracks) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('TRACKS', 'none');
          }}
          className={`flex flex-col items-center justify-center p-2.5 transition-all text-xs font-bold font-mono tracking-widest ${
            activeScreen === 'TRACKS'
              ? 'bg-[#b51a1a] text-white border-2 border-[#ffb4ab] translate-y-1 shadow-none'
              : 'text-[#e4beb9] opacity-80 border-2 border-transparent hover:bg-[#42302e]/60 active:translate-y-1'
          }`}
        >
          <span className="text-base sm:text-lg mb-0.5">♫</span>
          <span>TRACKS</span>
        </a>

        {/* Tab STAGES (Sends to cartridge index) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('STAGES', 'none');
          }}
          className={`flex flex-col items-center justify-center p-2.5 transition-all text-xs font-bold font-mono tracking-widest ${
            activeScreen === 'STAGES'
              ? 'bg-[#b51a1a] text-white border-2 border-[#ffb4ab] translate-y-1 shadow-none'
              : 'text-[#e4beb9] opacity-80 border-2 border-transparent hover:bg-[#42302e]/60 active:translate-y-1'
          }`}
        >
          <span className="text-base sm:text-lg mb-0.5">⚏</span>
          <span>STAGES</span>
        </a>

        {/* Tab RADIO (Sends to AM/FM frequency tuner) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('RADIO', 'none');
          }}
          className={`flex flex-col items-center justify-center p-2.5 transition-all text-xs font-bold font-mono tracking-widest ${
            activeScreen === 'RADIO'
              ? 'bg-[#b51a1a] text-white border-2 border-[#ffb4ab] translate-y-1 shadow-none'
              : 'text-[#e4beb9] opacity-80 border-2 border-transparent hover:bg-[#42302e]/60 active:translate-y-1'
          }`}
        >
          <span className="text-base sm:text-lg mb-0.5">📻</span>
          <span>RADIO</span>
        </a>

      </nav>

    </div>
  );
}
