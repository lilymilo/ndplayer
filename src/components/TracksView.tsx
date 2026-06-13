import React, { useState } from 'react';
import { Track } from '../types';
import { TRACKS_DATA } from '../data';
import { Search, Music, Volume2, Gamepad2, Layers } from 'lucide-react';

interface TracksViewProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onTogglePlay: () => void;
}

export default function TracksView({
  currentTrack,
  isPlaying,
  onTrackSelect,
  onTogglePlay
}: TracksViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTracks = TRACKS_DATA.filter((track) =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="tracks-screen-root" className="bg-neutral-900 border-4 border-[#42302e] p-4 md:p-6 shadow-[8px_8px_0_0_#180a09] font-mono text-[#f9dcd8]">
      
      {/* Sound System Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-[#42302e] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-[#ffb4ab]" size={20} />
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#ffb4ab] uppercase">
              Retro Sound Test
            </h1>
          </div>
          <p className="text-xs text-[#e4beb9] mt-1 tracking-wider">
            SYSTEM 8-BIT AUDIO SYNTHESIZER v1.4
          </p>
        </div>

        {/* Live Audio Monitor on Top right of Sound Test */}
        <div className="flex items-center gap-3 bg-[#180a09] border-2 border-[#5b403d] px-3 py-1.5 rounded-none">
          <div className="w-2 h-2 rounded-full bg-[#8BAC0F] animate-ping" />
          <div className="text-xs text-[#8BAC0F] tracking-widest font-mono">
            {isPlaying ? 'MELODY OUT' : 'STANDBY'}
          </div>
        </div>
      </div>

      {/* Filter / Search Bar (RPG Style) */}
      <div className="mb-6 relative">
        <div className="bg-[#42302e] border-2 border-[#ffb4ab] p-3 flex items-center gap-3">
          <Search className="text-[#ffb4ab]" size={16} />
          <input
            type="text"
            className="w-full bg-transparent border-none text-on-surface text-sm focus:ring-0 placeholder:text-[#e4beb9]/50 uppercase tracking-widest outline-none"
            placeholder="SELECT TRACK BY NAME..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-[#ffb4ab] animate-pulse">_</div>
        </div>
        <div className="absolute -top-3 left-4 bg-neutral-900 px-2 text-[#ffb4ab] text-[10px] font-bold tracking-widest uppercase">
          FILTER_SYSTEM
        </div>
      </div>

      {/* Retro LCD Glass Outer Shell */}
      <div className="bg-[#0F380F] p-2 border-4 border-[#2c1c1a]">
        <div className="bg-[#181818] p-4 min-h-[45vh] relative overflow-hidden">
          
          {/* CRT scanlines effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff02] via-transparent to-[#ffffff01] bg-[length:100%_4px] pointer-events-none z-10" />

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-[#5b403d] mb-4 text-[#ffb4ab] text-[10px] md:text-xs font-bold tracking-widest uppercase">
            <div className="col-span-2">NO.</div>
            <div className="col-span-6 md:col-span-7">TRACK TITLE</div>
            <div className="col-span-4 md:col-span-3">GAME ORIGIN</div>
          </div>

          {/* Track Items */}
          <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1">
            {filteredTracks.length === 0 ? (
              <div className="grid grid-cols-12 gap-2 p-3 text-center text-xs opacity-50">
                <div className="col-span-12 py-8 uppercase tracking-widest">
                  --- NO COMPATIBLE DATA FOUND ---
                </div>
              </div>
            ) : (
              filteredTracks.map((track) => {
                const isActive = currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      onTrackSelect(track);
                      if (!isPlaying) onTogglePlay();
                    }}
                    className={`grid grid-cols-12 gap-2 p-2.5 cursor-pointer flex items-center transition-all duration-75 relative group ${
                      isActive
                        ? 'bg-[#b51a1a] text-[#ffc7c1] border border-[#ffb4ab]'
                        : 'text-[#e4beb9]/80 border border-transparent hover:bg-[#42302e] hover:text-[#ffb4ab]'
                    }`}
                  >
                    {/* Active playing index with indicator */}
                    <div className="col-span-2 text-xs flex items-center gap-1.5 font-bold">
                      {isActive && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-3 w-3">
                          <span className="w-0.5 bg-current animate-[wave_0.6s_ease-in-out_infinite]" style={{ height: '50%' }} />
                          <span className="w-0.5 bg-current animate-[wave_0.8s_ease-in-out_infinite_0.15s]" style={{ height: '100%' }} />
                          <span className="w-0.5 bg-current animate-[wave_0.5s_ease-in-out_infinite_0.3s]" style={{ height: '70%' }} />
                        </div>
                      ) : (
                        <Music size={11} className={isActive ? 'text-[#ffc7c1]' : 'opacity-40'} />
                      )}
                      <span>{track.number}</span>
                    </div>

                    <div className="col-span-6 md:col-span-7 text-xs font-bold uppercase tracking-wide truncate">
                      {track.title}
                    </div>

                    <div className="col-span-4 md:col-span-3 text-[11px] uppercase tracking-wide truncate opacity-70">
                      {track.game}
                    </div>

                    {/* Hover indicator block on retro design */}
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ffb4ab]/10 text-[#ffb4ab] text-[9px] px-1.5 py-0.5 hidden md:block">
                      TAP TO PLAY
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats summary bar */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-[#180a09] p-3 border-2 border-[#42302e] gap-4">
        <div className="flex flex-wrap gap-4 text-[10px] uppercase text-[#e4beb9] tracking-wider">
          <div>
            TOTAL TRACKS: <span className="text-[#ffb4ab] font-bold">{TRACKS_DATA.length}</span>
          </div>
          <div>
            SAMPLING: <span className="text-[#ffb4ab] font-bold">8-BIT CHIPTUNE</span>
          </div>
          <div>
            SYNTH WAVE: <span className="text-[#ffb4ab] font-bold">SQUARE WAVE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <>
              <div className="w-2.5 h-2.5 bg-[#8BAC0F] animate-pulse" />
              <div className="text-[10px] text-[#8BAC0F] tracking-widest uppercase font-bold">
                AUD-ENG ACTIVE: PLAYING [{currentTrack.number}]
              </div>
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 bg-[#93000a]" />
              <div className="text-[10px] text-[#e4beb9] tracking-widest uppercase font-bold">
                AUD-ENG STANDBY
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
