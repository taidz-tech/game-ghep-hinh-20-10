import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  RotateCcw,
  Trophy,
  Lightbulb,
  Image as ImageIcon,
  Clock,
  Shuffle,
  Smile,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import roseThemeImg from './assets/images/rose_puzzle_theme_1792293188860.jpg';
import aodaiThemeImg from './assets/images/aodai_puzzle_theme_1792293205710.jpg';

import type { PuzzlePiece, ThemeOption } from './types.ts';
import { createPieces, shufflePieces, isPuzzleSolved, calculateProgress } from './utils/puzzleLogic.ts';
import { sound } from './utils/audioSystem.ts';
import { FallingPetals } from './components/FallingPetals.tsx';
import { PuzzleBoard } from './components/PuzzleBoard.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';

const THEMES: ThemeOption[] = [
  {
    id: 'rose',
    name: 'Hoa Hồng & 12A01 Rực Rỡ',
    description: 'Bó hoa hồng lung linh cùng lời chúc 20/10 rạng ngời',
    imageSrc: roseThemeImg,
  },
  {
    id: 'aodai',
    name: 'Tri Ân Cô Giáo & Hoa Sen',
    description: 'Cô giáo duyên dáng tà áo dài bên hoa sen ngát hương',
    imageSrc: aodaiThemeImg,
  },
];

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(THEMES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({ rows: 3, cols: 3 });
  
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [placedMap, setPlacedMap] = useState<Record<number, number>>({}); // slotId -> pieceId
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isLetterOpen, setIsLetterOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentImageSrc = customImage || selectedTheme.imageSrc;
  const totalPieces = gridSize.rows * gridSize.cols;
  const placedCount = Object.keys(placedMap).length;
  const progressPercent = calculateProgress(placedCount, totalPieces);

  // Initialize or reset puzzle
  const initGame = (rows = gridSize.rows, cols = gridSize.cols) => {
    const rawPieces = createPieces(rows, cols);
    const shuffled = shufflePieces(rawPieces);
    setPieces(shuffled);
    setPlacedMap({});
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(true);
    setIsVictoryModalOpen(false);
  };

  useEffect(() => {
    initGame(gridSize.rows, gridSize.cols);
  }, [selectedTheme, customImage, gridSize.rows, gridSize.cols]);

  // Timer interval
  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Handle piece successfully placed in slot
  const handlePiecePlaced = (pieceId: number, slotId: number) => {
    const updatedMap = { ...placedMap, [slotId]: pieceId };
    setPlacedMap(updatedMap);
    setMoves((prev) => prev + 1);

    if (isPuzzleSolved(updatedMap, totalPieces)) {
      setIsTimerRunning(false);
      setTimeout(() => {
        setIsVictoryModalOpen(true);
      }, 600);
    }
  };

  const handleAttemptFail = () => {
    setMoves((prev) => prev + 1);
  };

  // Helper Hint: auto-place 1 random unplaced piece for the user
  const handleHint = () => {
    sound.playClick();
    const unplacedSlots: number[] = [];
    for (let i = 1; i <= totalPieces; i++) {
      if (!placedMap[i]) unplacedSlots.push(i);
    }

    if (unplacedSlots.length === 0) return;
    const targetSlot = unplacedSlots[0];
    handlePiecePlaced(targetSlot, targetSlot);
    sound.playCorrect();
  };

  // Custom user photo upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          initGame();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 text-gray-800 selection:bg-rose-500 selection:text-white">
      {/* Background Animated Falling Petals & Hearts */}
      <FallingPetals />

      {/* Main Content Area */}
      <div className="relative z-20 flex min-h-screen flex-col justify-between px-3 py-4 sm:px-6 sm:py-6">
        {/* Sticky/Fixed Floating Controls Top Bar */}
        <header className="mx-auto w-full max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            {/* Music Player */}
            <MusicPlayer />

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => initGame()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md ring-2 ring-pink-200 transition-transform active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Xáo Trộn</span>
              </button>
            </div>
          </div>

          {/* Majestic Hero Banner */}
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-1 text-xs sm:text-sm font-bold text-rose-700 shadow-sm border border-rose-200 animate-float">
              <span>🌸</span>
              <span className="tracking-wide">CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10</span>
              <span>🌸</span>
            </div>

            <h1 className="mt-2 font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 drop-shadow-sm">
              TRÒ CHƠI GHÉP HÌNH 20/10
            </h1>
          </div>

          {/* Interactive Game Control Dashboard */}
          <div className="mt-5 rounded-2xl bg-white/85 backdrop-blur-md p-3 sm:p-4 shadow-lg border-2 border-rose-200 flex flex-wrap items-center justify-between gap-3">
            {/* Theme Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1 mr-1">
                <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                Chủ đề:
              </span>

              {THEMES.map((theme) => {
                const isActive = !customImage && selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      sound.playClick();
                      setCustomImage(null);
                      setSelectedTheme(theme);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-md ring-2 ring-pink-300'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {theme.id === 'rose' ? '🌹 ' : '🪷 '}
                    {theme.name.split('&')[0].trim()}
                  </button>
                );
              })}

              {/* Upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  customImage
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
                title="Tải ảnh kỷ niệm của lớp 12A01 lên để ghép"
              >
                📸 {customImage ? 'Ảnh Lớp 12A01' : 'Tải Ảnh Riêng'}
              </button>
            </div>

            {/* Grid Size / Difficulty selector */}
            <div className="flex items-center gap-1.5 bg-rose-50/80 p-1 rounded-full border border-rose-200">
              <span className="text-xs font-bold text-rose-800 ml-2">Độ khó:</span>
              <button
                onClick={() => {
                  sound.playClick();
                  setGridSize({ rows: 3, cols: 3 });
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  gridSize.rows === 3 && gridSize.cols === 3
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                3x3 (9 mảnh)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setGridSize({ rows: 3, cols: 4 });
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  gridSize.rows === 3 && gridSize.cols === 4
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                3x4 (12 mảnh)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setGridSize({ rows: 4, cols: 4 });
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  gridSize.rows === 4 && gridSize.cols === 4
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                4x4 (16 mảnh)
              </button>
            </div>

            {/* Stats: Timer, Moves, Progress, Hint */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-rose-100">
              <div className="flex items-center gap-1 text-xs font-bold text-rose-800">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>{formatTime(seconds)}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-rose-800">
                <span>🎯 {moves} lượt</span>
              </div>

              {/* Hint button */}
              <button
                onClick={handleHint}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs transition-colors shadow-sm border border-amber-300"
                title="Tự động ghép đúng 1 mảnh để trợ giúp"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Gợi ý</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 px-1">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700 mb-1">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                Tiến độ: {placedCount}/{totalPieces} mảnh ghép
              </span>
              <span>{progressPercent}% Hoàn tất</span>
            </div>
            <div className="w-full h-2.5 bg-white/70 rounded-full overflow-hidden border border-rose-200 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-rose-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </header>

        {/* Central Puzzle Game Board */}
        <main className="my-4 flex-1 flex flex-col justify-center">
          <PuzzleBoard
            rows={gridSize.rows}
            cols={gridSize.cols}
            imageSrc={currentImageSrc}
            imageTitle={customImage ? 'Ảnh Kỷ Niệm Lớp 12A01' : selectedTheme.name}
            pieces={pieces}
            placedMap={placedMap}
            onPiecePlaced={handlePiecePlaced}
            onAttemptFail={handleAttemptFail}
          />
        </main>

        {/* Dedicated Class 12A01 Greeting Envelope Card */}
        <div className="mx-auto w-full max-w-2xl mb-4">
          <div className="rounded-2xl bg-white/85 backdrop-blur-md border-2 border-rose-200 shadow-md overflow-hidden transition-all">
            <button
              onClick={() => setIsLetterOpen(!isLetterOpen)}
              className="w-full flex items-center justify-between p-3.5 text-left bg-gradient-to-r from-rose-50 to-pink-50 hover:bg-rose-100/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">💌</span>
                <span className="font-bold text-sm sm:text-base text-rose-900 font-serif">
                  Bức Thư Tri Ân & Chúc Mừng 20/10 Gửi Lớp 12A01
                </span>
              </div>
              <span className="text-rose-600 p-1">
                {isLetterOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </span>
            </button>

            {isLetterOpen && (
              <div className="p-4 sm:p-6 border-t border-rose-100 text-sm leading-relaxed text-gray-700 bg-white/90 animate-fade-in space-y-3">
                <p className="font-serif italic font-bold text-rose-700 text-base">
                  Kính gửi Cô và toàn thể các bạn nữ của tập thể 12A01,
                </p>
                <p>
                  Nhân ngày Phụ nữ Việt Nam 20/10, chúng em xin gửi đến Cô lời tri ân sâu sắc nhất. Chúc Cô luôn mạnh khỏe, tươi trẻ và hạnh phúc!
                </p>
                <p>
                  Gửi đến tất cả các bạn nữ 12A01: Chúc các bạn có một ngày 20/10 thật vui và những nụ cười rạng rỡ nhất. Chúc các bạn luôn tự tin, kiên cường và cố gắng chạm tay đến cánh cửa đại học mơ ước! 🌸💖
                </p>
                <div className="pt-2 text-right font-serif font-bold text-rose-600">
                  -Tập thể lớp 12A01-
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-rose-600/90 font-medium py-2">
          🌸 Chúc mừng Ngày Phụ Nữ Việt Nam 20/10 • Thiết kế dành riêng cho Lớp 12A01 🌸
        </footer>
      </div>

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        onClose={() => setIsVictoryModalOpen(false)}
        onRestart={() => initGame()}
        moves={moves}
        timeSpent={seconds}
        imageSrc={currentImageSrc}
      />
    </div>
  );
}
