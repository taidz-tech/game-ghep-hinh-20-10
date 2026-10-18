import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';
import { sound } from '../utils/audioSystem.ts';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleBGM = () => {
    sound.playClick();
    const playing = sound.toggleBGM();
    setIsPlaying(playing);
  };

  const toggleMute = () => {
    sound.playClick();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Autostart BGM on first user interaction if not started yet
  useEffect(() => {
    const startAudioOnFirstClick = () => {
      if (!sound.getIsBgmPlaying()) {
        sound.startBGM();
        setIsPlaying(true);
      }
      window.removeEventListener('click', startAudioOnFirstClick);
      window.removeEventListener('keydown', startAudioOnFirstClick);
    };

    window.addEventListener('click', startAudioOnFirstClick, { once: true });
    window.addEventListener('keydown', startAudioOnFirstClick, { once: true });

    return () => {
      window.removeEventListener('click', startAudioOnFirstClick);
      window.removeEventListener('keydown', startAudioOnFirstClick);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border-2 border-rose-200">
      {/* Vinyl Disc Animation */}
      <button
        onClick={toggleBGM}
        aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền du dương 20/10'}
        className="flex items-center gap-2 group text-rose-800 hover:text-rose-600 focus:outline-none"
      >
        <div className={`relative flex items-center justify-center w-7 h-7 rounded-full bg-rose-500 text-white shadow-sm ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
          <Disc3 className="w-5 h-5" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold leading-none text-rose-900 group-hover:text-rose-600">
            {isPlaying ? 'Nhạc Nền Đang Bật' : 'Bật Nhạc Nền'}
          </span>
          <span className="text-[9px] text-rose-500/80 leading-tight">
            Giai điệu 20/10 du dương
          </span>
        </div>
      </button>

      {/* Visualizer bars when playing */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-3 px-1" aria-hidden="true">
          <span className="w-0.5 bg-rose-400 rounded-full animate-pulse h-2" style={{ animationDelay: '0ms' }} />
          <span className="w-0.5 bg-rose-500 rounded-full animate-pulse h-3" style={{ animationDelay: '150ms' }} />
          <span className="w-0.5 bg-pink-400 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }} />
          <span className="w-0.5 bg-rose-600 rounded-full animate-pulse h-2.5" style={{ animationDelay: '450ms' }} />
        </div>
      )}

      {/* Mute SFX / Master Toggle */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        className="p-1 rounded-full text-rose-600 hover:bg-rose-100 transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
