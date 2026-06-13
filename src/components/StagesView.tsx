import React from 'react';
import { Stage, Track } from '../types';
import { STAGES_DATA, TRACKS_DATA } from '../data';
import { Trophy, Compass, Swords, Zap, RefreshCcw } from 'lucide-react';

interface StagesViewProps {
  currentTrack: Track;
  onTrackSelect: (track: Track) => void;
  onNavigateToConsole: () => void;
}

export default function StagesView({
  currentTrack,
  onTrackSelect,
  onNavigateToConsole
}: StagesViewProps) {

  const handleStageSelect = (stage: Stage) => {
    const matchedTrack = TRACKS_DATA.find((t) => t.id === stage.trackId);
    if (matchedTrack) {
      onTrackSelect(matchedTrack);
      onNavigateToConsole();
    }
  };

  const getDifficultyBadge = (diff: Stage['difficulty']) => {
    switch (diff) {
      case 'EASY':
        return <span className="bg-green-950 text-green-400 border border-green-700 text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">EASY</span>;
      case 'MEDIUM':
        return <span className="bg-yellow-950 text-yellow-400 border border-yellow-700 text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">MEDIUM</span>;
      case 'HARD':
        return <span className="bg-red-950 text-red-400 border border-red-700 text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">HARD</span>;
      case 'BOSS':
        return <span className="bg-purple-950 text-purple-400 border border-purple-700 text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase flex items-center gap-1">BOSS <Zap size={8} /></span>;
      default:
        return null;
    }
  };

  return (
    <div id="stages-screen-root" className="bg-neutral-900 border-4 border-[#42302e] p-4 md:p-6 shadow-[8px_8px_0_0_#180a09] font-mono text-[#f9dcd8]">
      
      {/* Stages Title Area */}
      <div className="mb-6 border-b-4 border-[#42302e] pb-4">
        <div className="flex items-center gap-2">
          <Compass className="text-[#ffb4ab]" size={20} />
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#ffb4ab] uppercase">
            Classic Game Levels
          </h1>
        </div>
        <p className="text-xs text-[#e4beb9] mt-1 tracking-wider">
          SELECT A RETRO DUNGEON STAGE TO LOAD ITS SOUNDTRACK CARTRIDGE
        </p>
      </div>

      {/* Grid of Illustrated Stage Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAGES_DATA.map((stage) => {
          const matchedTrack = TRACKS_DATA.find((t) => t.id === stage.trackId);
          const isCurrentlyActive = currentTrack.id === stage.trackId;

          return (
            <div
              key={stage.id}
              style={{ borderColor: isCurrentlyActive ? stage.color : '#42302e' }}
              className={`bg-[#2c1c1a]/60 border-2 p-4 flex flex-col justify-between transition-all duration-100 hover:translate-y-[-2px] relative group ${
                isCurrentlyActive
                  ? 'shadow-[4px_4px_0_0_rgba(255,255,255,0.05)] bg-[#2c1c1a]'
                  : 'shadow-[2px_2px_0_0_#180a09] hover:border-[#ffb4ab]/80'
              }`}
            >
              {/* Highlight ribbon for active stages */}
              {isCurrentlyActive && (
                <div
                  style={{ backgroundColor: stage.color }}
                  className="absolute top-0 right-0 h-1 left-0"
                />
              )}

              <div>
                {/* Header detail with icons */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#e4beb9]/60 tracking-widest block">
                      {stage.game}
                    </span>
                    <h2 className="text-base font-extrabold uppercase tracking-wide text-white truncate mt-0.5">
                      {stage.name}
                    </h2>
                  </div>
                  {getDifficultyBadge(stage.difficulty)}
                </div>

                <p className="text-xs text-[#e4beb9] leading-relaxed tracking-wide min-h-[50px] mt-2 group-hover:text-white transition-colors">
                  {stage.description}
                </p>

                {/* Level parameters */}
                <div className="mt-4 pt-3 border-t border-[#42302e] flex flex-col gap-1.5 text-[10px] tracking-wider uppercase text-[#e4beb9]/60">
                  <div className="flex justify-between">
                    <span>CARTRIDGE ROM:</span>
                    <span className="text-[#ffb4ab] font-bold">128 KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>THEME SONG:</span>
                    <span className="text-white font-bold truncate max-w-[130px]" title={matchedTrack?.title}>
                      {matchedTrack?.title || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action play/warp button */}
              <div className="mt-5">
                <button
                  onClick={() => handleStageSelect(stage)}
                  style={{
                    backgroundColor: isCurrentlyActive ? stage.color : '#180a09',
                    color: isCurrentlyActive ? '#111' : '#ffb4ab'
                  }}
                  className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] border border-[#ffb4ab]/20 shadow-[2px_2px_0_0_#111] flex items-center justify-center gap-1.5 hover:opacity-90`}
                >
                  <Trophy size={12} className={isCurrentlyActive ? 'animate-bounce' : ''} />
                  <span>{isCurrentlyActive ? 'ACTIVE STAGE' : 'WARP & PLAY'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Retro Information Banner bottom */}
      <div className="mt-6 bg-[#180a09] border border-[#ffb4ab]/20 p-3 flex gap-3 items-center">
        <Swords size={20} className="text-[#ffb4ab] shrink-0" />
        <p className="text-[10px] text-[#e4beb9]/80 uppercase leading-relaxed tracking-wider">
          💡 WARPING TO A CLASSIC LEVEL POPULATES THE SOUND MODULE WITH THE GAME'S SOURCE THEME SONG AND SENDS YOU DIRECTLY BACK TO THE CONSOLE PLAY DECK TO ADJUST AUDIO VARIABLES IN REALTIME!
        </p>
      </div>

    </div>
  );
}
