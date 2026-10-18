import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Heart, Gift, Award, Music, X } from 'lucide-react';
import { sound } from '../utils/audioSystem.ts';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  moves: number;
  timeSpent: number;
  imageSrc: string;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  moves,
  timeSpent,
  imageSrc,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      triggerConfettiSalvo();
    }
  }, [isOpen]);

  const triggerConfettiSalvo = () => {
    // Left side burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ec4899', '#ffffff'],
    });
    // Right side burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ec4899', '#ffffff'],
    });

    // Star and rose petal fireworks center
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        shapes: ['circle', 'square'],
        colors: ['#e11d48', '#fda4af', '#fbbf24', '#f43f5e'],
      });
    }, 400);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}p ` : ''}${seconds}s`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 p-6 sm:p-8 shadow-2xl border-4 border-rose-200">
        {/* Decorative corner ribbons */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-28 w-28 rotate-45 bg-gradient-to-r from-rose-400 to-pink-500 opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-28 w-28 rotate-45 bg-gradient-to-r from-amber-300 to-rose-300 opacity-20 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Đóng bảng chúc mừng"
          className="absolute top-3 right-3 p-2 rounded-full text-rose-500 hover:bg-rose-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg ring-4 ring-pink-200 animate-bounce">
            <Award className="w-10 h-10" />
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-white text-xs font-bold shadow">
              ✨
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-100 text-rose-700 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Xuất Sắc Hoàn Thành
          </span>

          <h2
            id="victory-title"
            className="text-2xl sm:text-3xl font-extrabold text-rose-900 font-serif tracking-tight leading-snug"
          >
            TUYỆT VỜI! BẠN ĐÃ THẮNG!
          </h2>

          {/* Stats Bar */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs sm:text-sm font-medium text-rose-800 bg-white/70 py-2 px-5 rounded-2xl border border-rose-100 shadow-sm">
            <span>⏱️ Thời gian: <strong className="text-rose-600">{timeFormatted}</strong></span>
            <span className="w-1 h-3 bg-rose-200 rounded-full" />
            <span>🎯 Lượt ghép: <strong className="text-rose-600">{moves} lần</strong></span>
          </div>
        </div>

        {/* Central Dedicated Greeting Card */}
        <div className="mt-5 rounded-2xl bg-white/95 p-5 sm:p-6 shadow-md border-2 border-rose-300 relative text-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full shadow">
            💌 THÔNG ĐIỆP YÊU THƯƠNG
          </div>

          <div className="mt-3 text-left space-y-3 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans">
            <p className="font-serif font-bold text-rose-700 text-sm sm:text-base">
              Kính gửi Cô và toàn thể các bạn nữ của tập thể 12A01,
            </p>
            <p>
              Nhân ngày Phụ nữ Việt Nam 20/10, chúng em xin gửi đến Cô lời tri ân sâu sắc nhất. Chúc Cô luôn mạnh khỏe, tươi trẻ và hạnh phúc!
            </p>
            <p>
              Gửi đến tất cả các bạn nữ 12A01: Chúc các bạn có một ngày 20/10 thật vui và những nụ cười rạng rỡ nhất. Chúc các bạn luôn tự tin, kiên cường và cố gắng chạm tay đến cánh cửa đại học mơ ước! 🌸💖
            </p>
            <p className="pt-2 text-right font-serif font-bold text-rose-600">
              -Tập thể lớp 12A01-
            </p>
          </div>

          {/* Small thumbnail of completed image */}
          <div className="mt-4 flex justify-center">
            <div className="relative group overflow-hidden rounded-xl border-2 border-pink-300 shadow-sm max-w-[200px]">
              <img
                src={imageSrc}
                alt="Bức tranh hoàn thiện 20/10"
                className="w-full h-auto object-cover transform transition-transform group-hover:scale-105"
              />
              <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                100% Hoàn hảo
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              triggerConfettiSalvo();
              sound.playCorrect();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold text-sm transition-transform active:scale-95 shadow-sm border border-pink-200"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            Bắn Pháo Hoa ✨
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-200 transition-transform active:scale-95 ring-2 ring-rose-300"
          >
            <RotateCcw className="w-4 h-4" />
            Chơi Lại Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
