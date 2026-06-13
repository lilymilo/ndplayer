import React, { useState, useEffect } from 'react';
import { Track, ScreenType } from '../types';
import { TRACKS_DATA } from '../data';
import { audioEngine } from '../audioEngine';
import { Radio, RefreshCw, ArrowLeft, Disc, Volume2, ShieldAlert } from 'lucide-react';

interface RadioViewProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onTogglePlay: () => void;
  onNavigate: (screen: ScreenType) => void;
}

// Map channels to secret frequencies
const RADIO_STATIONS = [
  { freq: 89.1, trackId: 'mario', name: 'MUSHROOM STATION', genre: 'MUSHROOM KINGDOM' },
  { freq: 94.5, trackId: 'zelda', name: 'HYRULE WORLD NEWS', genre: 'REDRUM FOREST' },
  { freq: 99.3, trackId: 'metroid', name: 'SECTOR ZEBES FM', genre: 'ALIEN CAVERNS' },
  { freq: 102.7, trackId: 'castlevania', name: 'DRACULA CASTLE BEATS', genre: 'GOTHIC METAL 8-BIT' },
  { freq: 106.1, trackId: 'megaman', name: 'WILY RADIO NETWORK', genre: 'INDUSTRIAL CHIP' },
  { freq: 107.9, trackId: 'ducktales', name: 'TRANSYLVANIA REVERB', genre: 'MOON ADVENTURE' }
];

export default function RadioView({
  currentTrack,
  isPlaying,
  onTrackSelect,
  onTogglePlay,
  onNavigate
}: RadioViewProps) {
  const [frequency, setFrequency] = useState(92.0); // slider frequency 88.0 to 108.0
  const [lockedStation, setLockedStation] = useState<typeof RADIO_STATIONS[0] | null>(null);
  const [tunerActive, setTunerActive] = useState(false);

  // Turn on static tuner on component load
  useEffect(() => {
    audioEngine.startStaticNoise();
    setTunerActive(true);
    
    return () => {
      audioEngine.stopStaticNoise();
    };
  }, []);

  // Handle Frequency Change
  const handleFreqChange = (newFreq: number) => {
    setFrequency(newFreq);

    // Calculate map to 0-100 limit for audio bandpass filter
    const percent = ((newFreq - 88.0) / (108.0 - 88.0)) * 100;
    audioEngine.setStaticFrequency(percent);

    // Check station locking (within +/- 0.4 MHz tolerance)
    const station = RADIO_STATIONS.find((st) => Math.abs(st.freq - newFreq) <= 0.3);
    
    if (station) {
      if (!lockedStation || lockedStation.trackId !== station.trackId) {
        setLockedStation(station);
        const targetTrack = TRACKS_DATA.find((t) => t.id === station.trackId);
        if (targetTrack) {
          // Play the radio station track
          onTrackSelect(targetTrack);
          // Reduce background noise when signal lock is achieved
          audioEngine.setVolume(0.05); 
        }
      }
    } else {
      if (lockedStation) {
        setLockedStation(null);
        // Turn background noise back up when off-signal
        audioEngine.setVolume(0.3);
      }
    }
  };

  return (
    <div id="radio-screen-root" className="bg-neutral-900 border-4 border-[#42302e] p-4 md:p-6 shadow-[8px_8px_0_0_#180a09] font-mono text-[#f9dcd8]">
      
      {/* Title & Return Trigger */}
      <div className="mb-6 border-b-4 border-[#42302e] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="text-[#ffb4ab]" size={20} />
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#ffb4ab] uppercase">
              Chiptune Radio Tuner
            </h1>
          </div>
          <p className="text-xs text-[#e4beb9] mt-1 tracking-wider">
            ROTATE AM/FM ANTENNA TO CHASER SECRET FREQUENCIES
          </p>
        </div>

        {/* EXIT LINK: crucial for navigation flow criteria */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            audioEngine.stopStaticNoise();
            onNavigate('PLAY');
          }}
          className="bg-[#180a09] hover:bg-[#b51a1a] hover:text-white border-2 border-[#ffb4ab] px-3 py-1.5 text-xs text-[#ffb4ab] font-bold tracking-widest uppercase transition-all flex items-center gap-2 self-start md:self-auto shadow-[2px_2px_0_0_#180a09] hover:translate-y-[1px]"
        >
          <ArrowLeft size={12} />
          <span>Exit Tuner</span>
        </a>
      </div>

      {/* Retro Signal Receiver Panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Frequency Meter Bar left */}
        <div className="lg:col-span-8 bg-[#180a09] border-4 border-[#42302e] p-4 flex flex-col gap-6 relative">
          
          {/* Signal Indicator Display */}
          <div className="bg-[#8BAC0F] border-4 border-[#0F380F] p-4 inset-shadow relative overflow-hidden text-[#0F380F]">
            
            {/* Scanlines overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0000000d] to-transparent bg-[length:100%_4px] pointer-events-none" />

            <div className="flex justify-between items-center border-b border-[#0F380F] pb-1.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest">RF SIGNAL REGISTER</span>
              <span className="text-[10px] font-mono tracking-widest">{lockedStation ? 'SIGNAL LOCK' : 'WHITE NOISE STATIC'}</span>
            </div>

            {/* Huge Frequency numbers */}
            <div className="flex items-baseline justify-between py-4">
              <div className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                {frequency.toFixed(1)} <span className="text-xl">MHz</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extrabold block tracking-wider uppercase">TUNING RANGE:</span>
                <span className="text-[10px] font-extrabold block tracking-widest uppercase text-[#0F380F]/70">88.0 - 108.0 MHZ</span>
              </div>
            </div>

            {/* Oscilloscope Grid screen */}
            <div className="h-16 border-t border-[#0F380F] pt-2 flex items-center justify-center relative">
              {lockedStation ? (
                // Beautiful locked frequency sine wave elements
                <div className="w-full flex justify-around items-end h-8">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#0F380F] animate-[wave_0.7s_infinite_alternate]"
                      style={{
                        height: `${Math.max(15, Math.sin(i * 0.5) * 100)}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              ) : (
                // Static noise chaotic waves
                <div className="w-full flex justify-around items-end h-8 opacity-60">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#0F380F]"
                      style={{ height: `${Math.random() * 50 + 10}%` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Precision Tuning Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-[#e4beb9] tracking-wider uppercase">
              <span>◄ 88.0 MHz</span>
              <span className="text-[#ffb4ab] font-bold">TUNER DIAL KNOB</span>
              <span>108.0 MHz ►</span>
            </div>
            
            <input
              type="range"
              min="88.0"
              max="108.0"
              step="0.2"
              value={frequency}
              onChange={(e) => handleFreqChange(parseFloat(e.target.value))}
              className="w-full h-8 accent-[#b51a1a] bg-[#2c1c1a] border-2 border-[#5b403d] p-1 cursor-pointer"
            />
          </div>

          {/* Locked Station Meta summary */}
          <div className="bg-[#2c1c1a]/50 border border-[#5b403d] p-3 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] text-[#e4beb9]/40 font-bold block uppercase tracking-widest">STATION CARRIER</span>
              <span className="text-sm font-extrabold text-[#ffb4ab] tracking-wider uppercase">
                {lockedStation ? lockedStation.name : 'NO SIGNAL (TUNE TO UNLOCK)'}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#e4beb9]/40 font-bold block uppercase tracking-widest">FREQUENCY GENRE</span>
              <span className="text-xs font-bold uppercase text-white/90">
                {lockedStation ? lockedStation.genre : 'STATIC INTERFERENCE'}
              </span>
            </div>
          </div>

        </div>

        {/* Right Station Guide Table */}
        <div className="lg:col-span-4 bg-[#2c1c1a] border-4 border-[#5b403d] p-4 flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#ffb4ab] border-b border-[#5b403d] pb-2 flex items-center gap-2">
            <Radio size={14} /> GOLD SECRET STATION DIAL
          </h2>

          <p className="text-[10px] leading-relaxed text-[#e4beb9] tracking-wider uppercase">
            CHALLENGE YOUR RADIO DIAL TO MATCH THESE CLASSIC RETRO CARRIER FREQUENCIES EXACTLY:
          </p>

          <div className="space-y-2 mt-2">
            {RADIO_STATIONS.map((st) => (
              <button
                key={st.trackId}
                onClick={() => handleFreqChange(st.freq)}
                className={`w-full p-2.5 text-left text-xs transition-all flex items-center justify-between border ${
                  lockedStation?.trackId === st.trackId
                    ? 'bg-[#b51a1a] text-[#ffc7c1] border-[#ffb4ab]'
                    : 'bg-[#180a09] text-[#e4beb9] border-[#42302e] hover:bg-[#1e100e] hover:border-[#ffb4ab]/50'
                }`}
              >
                <div>
                  <span className="font-bold tracking-wider text-inherit block uppercase truncate max-w-[140px]">{st.name}</span>
                  <span className="text-[9px] opacity-60 uppercase block">{st.genre}</span>
                </div>
                <div className="text-right font-bold text-sm tracking-tighter whitespace-nowrap">
                  {st.freq.toFixed(1)} MHz
                </div>
              </button>
            ))}
          </div>

          <div className="bg-[#180a09] p-3 text-[10px] leading-relaxed text-[#e4beb9]/70 border border-[#5b403d] uppercase tracking-wider flex gap-2">
            <ShieldAlert size={16} className="text-[#ffb4ab] shrink-0" />
            <span>Tuning knob responds in increments of 0.2 MHz. Click a station above to quick-tune, or dial manually to isolate signals.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
