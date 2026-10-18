import React, { useState } from 'react';
import type { PuzzlePiece } from '../types.ts';
import { checkPlacement } from '../utils/puzzleLogic.ts';
import { sound } from '../utils/audioSystem.ts';
import { CheckCircle2, Sparkles, Check } from 'lucide-react';

interface PuzzleBoardProps {
  rows: number;
  cols: number;
  imageSrc: string;
  imageTitle: string;
  pieces: PuzzlePiece[];
  placedMap: Record<number, number>; // slotId -> pieceId
  onPiecePlaced: (pieceId: number, slotId: number) => void;
  onAttemptFail: () => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  rows,
  cols,
  imageSrc,
  imageTitle,
  pieces,
  placedMap,
  onPiecePlaced,
  onAttemptFail,
}) => {
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [hoveredPieceId, setHoveredPieceId] = useState<number | null>(null);
  const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
  const [errorSlotId, setErrorSlotId] = useState<number | null>(null);
  const [glowSlotId, setGlowSlotId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'error' | 'success' | 'info';
    text: string;
  } | null>(null);

  const totalSlots = rows * cols;
  const unplacedPieces = pieces.filter((p) => !Object.values(placedMap).includes(p.id));

  const triggerError = (slotId: number) => {
    setErrorSlotId(slotId);
    setFeedbackMessage({
      type: 'error',
      text: `❌ Mảnh này không phải ở ô số ${slotId}! Bạn hãy thử ô khác nhé.`,
    });
    sound.playWrong();
    onAttemptFail();

    setTimeout(() => {
      setErrorSlotId(null);
    }, 700);
  };

  const triggerSuccess = (pieceId: number, slotId: number) => {
    setGlowSlotId(slotId);
    setFeedbackMessage({
      type: 'success',
      text: `✨ Chuẩn xác! Bạn đã ghép đúng vào ô số ${slotId}!`,
    });
    sound.playCorrect();
    onPiecePlaced(pieceId, slotId);
    setSelectedPieceId(null);

    setTimeout(() => {
      setGlowSlotId(null);
    }, 900);
  };

  const handleSlotClick = (slotId: number) => {
    sound.playClick();

    if (placedMap[slotId]) {
      setFeedbackMessage({
        type: 'info',
        text: `Ô số ${slotId} đã được ghép thành công rồi!`,
      });
      return;
    }

    if (selectedPieceId === null) {
      setFeedbackMessage({
        type: 'info',
        text: '👉 Hãy bấm chọn một mảnh ghép ở khay bên phải trước nhé!',
      });
      return;
    }

    if (checkPlacement(selectedPieceId, slotId)) {
      triggerSuccess(selectedPieceId, slotId);
    } else {
      triggerError(slotId);
    }
  };

  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPieceId(pieceId);
    e.dataTransfer.setData('text/plain', pieceId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    if (placedMap[slotId]) return;

    const pieceIdStr = e.dataTransfer.getData('text/plain');
    const pieceId = pieceIdStr ? parseInt(pieceIdStr, 10) : draggedPieceId;
    if (!pieceId) return;

    if (checkPlacement(pieceId, slotId)) {
      triggerSuccess(pieceId, slotId);
    } else {
      triggerError(slotId);
    }
    setDraggedPieceId(null);
  };

  const getBackgroundPosition = (r: number, c: number) => {
    const x = cols > 1 ? (c / (cols - 1)) * 100 : 0;
    const y = rows > 1 ? (r / (rows - 1)) * 100 : 0;
    return `${x}% ${y}%`;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toast Notification Banner */}
      <div className="min-h-11 flex items-center justify-center w-full max-w-2xl mb-3 px-2">
        {feedbackMessage && (
          <div
            className={`w-full text-center py-2 px-5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 ${
              feedbackMessage.type === 'error'
                ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 animate-shake'
                : feedbackMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 animate-pulse'
                : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
            }`}
          >
            {feedbackMessage.text}
          </div>
        )}
      </div>

      {/* 2-Panel Side-by-Side: Khung Ghép Tranh & Khay Mảnh Ghép */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 px-2 sm:px-4 items-start">
        
        {/* PANEL 1: KHUNG GHÉP TRANH */}
        <div className="w-full flex flex-col rounded-3xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-xl border-4 border-rose-300 ring-4 ring-pink-100/70">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-rose-900 font-serif">
                  Khung Ghép Tranh
                </h3>
                <p className="text-[11px] text-rose-600 font-medium">
                  Bấm ô hoặc kéo thả mảnh ghép vào vị trí
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
              {unplacedPieces.length > 0 ? `Còn ${unplacedPieces.length} ô trống` : '🎉 Hoàn tất!'}
            </span>
          </div>

          {/* Interactive Target Grid */}
          <div
            className="relative w-full aspect-square overflow-hidden rounded-2xl bg-white shadow-inner border-2 border-rose-200"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gap: '3px',
              padding: '3px',
              backgroundColor: '#fecdd3',
            }}
          >
            {Array.from({ length: totalSlots }).map((_, idx) => {
              const slotId = idx + 1;
              const placedPieceId = placedMap[slotId];
              const isCorrectlyPlaced = placedPieceId === slotId;
              const isError = errorSlotId === slotId;
              const isGlow = glowSlotId === slotId;
              const isTargetOfSelected = selectedPieceId === slotId;

              const slotRow = Math.floor(idx / cols);
              const slotCol = idx % cols;

              return (
                <div
                  key={`slot-${slotId}`}
                  onClick={() => handleSlotClick(slotId)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slotId)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ô số ${slotId}${isCorrectlyPlaced ? ' đã ghép đúng' : ' chưa ghép'}`}
                  className={`relative flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden rounded-lg select-none ${
                    isCorrectlyPlaced
                      ? 'shadow-xs'
                      : 'bg-white hover:bg-pink-50/90 border border-dashed border-rose-300'
                  } ${
                    isError
                      ? 'ring-4 ring-rose-500 bg-rose-100 animate-shake z-20'
                      : ''
                  } ${
                    isGlow
                      ? 'ring-4 ring-emerald-400 animate-green-glow z-20'
                      : ''
                  } ${
                    isTargetOfSelected && !isCorrectlyPlaced
                      ? 'ring-4 ring-rose-400 bg-rose-50/80 scale-[0.98]'
                      : selectedPieceId && !isCorrectlyPlaced
                      ? 'hover:ring-2 hover:ring-rose-400'
                      : ''
                  }`}
                  style={
                    isCorrectlyPlaced
                      ? {
                          backgroundImage: `url(${imageSrc})`,
                          backgroundSize: `${cols * 100}% ${rows * 100}%`,
                          backgroundPosition: getBackgroundPosition(slotRow, slotCol),
                        }
                      : {}
                  }
                >
                  {!isCorrectlyPlaced && (
                    <div className="flex flex-col items-center justify-center w-full h-full p-1 bg-white hover:bg-pink-50 transition-colors">
                      <span className={`text-xl sm:text-2xl md:text-3xl font-extrabold font-serif tracking-tight drop-shadow-xs ${
                        isTargetOfSelected ? 'text-rose-600 scale-110' : 'text-rose-400/90'
                      }`}>
                        {slotId}
                      </span>
                      <span className="text-[10px] sm:text-xs text-rose-300 font-medium">
                        Ô {slotId}
                      </span>
                    </div>
                  )}

                  {isCorrectlyPlaced && (
                    <div className="absolute top-1 right-1 bg-black/60 text-emerald-400 rounded-full p-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-rose-700">
            <span>👉 Bấm mảnh ghép bên phải rồi bấm vào ô này</span>
            {selectedPieceId ? (
              <span className="font-bold text-rose-600">Đang chọn: Mảnh #{selectedPieceId}</span>
            ) : (
              <span className="text-gray-400">Chưa chọn mảnh</span>
            )}
          </div>
        </div>

        {/* PANEL 2: KHAY TOÀN BỘ MẢNH GHÉP (HIỂN THỊ ĐẦY ĐỦ, SONG SONG) */}
        <div className="w-full flex flex-col rounded-3xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-xl border-3 border-rose-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500 text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-rose-900 font-serif">
                  Toàn Bộ Mảnh Ghép ({unplacedPieces.length} mảnh)
                </h3>
                <p className="text-[11px] text-rose-600 font-medium">
                  Hiển thị đầy đủ tất cả các mảnh ghép
                </p>
              </div>
            </div>

            {selectedPieceId ? (
              <button
                onClick={() => setSelectedPieceId(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
              >
                Hủy chọn
              </button>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-rose-700">
                Chọn 1 mảnh
              </span>
            )}
          </div>

          {/* Full Grid of Pieces: Render ALL pieces clearly */}
          {unplacedPieces.length === 0 ? (
            <div className="py-14 text-center text-emerald-600 font-bold flex flex-col items-center justify-center gap-2 bg-emerald-50/60 rounded-2xl border-2 border-dashed border-emerald-300">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-bounce" />
              <span className="text-base sm:text-lg font-serif">Tuyệt vời! Bạn đã hoàn thành bức tranh 20/10!</span>
              <span className="text-xs text-emerald-700">Xin chúc mừng tập thể Lớp 12A01!</span>
            </div>
          ) : (
            <div className="w-full">
              <div
                className="grid gap-2 sm:gap-2.5 p-1"
                style={{
                  gridTemplateColumns: `repeat(${cols === 4 ? 4 : 3}, minmax(0, 1fr))`,
                }}
              >
                {unplacedPieces.map((piece) => {
                  const isSelected = selectedPieceId === piece.id;
                  const isHovered = hoveredPieceId === piece.id;

                  return (
                    <div
                      key={`piece-${piece.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece.id)}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPieceId(isSelected ? null : piece.id);
                      }}
                      onMouseEnter={() => setHoveredPieceId(piece.id)}
                      onMouseLeave={() => setHoveredPieceId(null)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Mảnh ghép ${isSelected ? 'đang chọn' : ''}`}
                      className={`group relative aspect-square rounded-xl cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-200 select-none ${
                        isSelected
                          ? 'ring-4 ring-rose-500 shadow-2xl scale-105 z-20'
                          : isHovered
                          ? 'scale-105 shadow-lg border-2 border-rose-400 z-10'
                          : 'shadow-md border-2 border-rose-200 hover:border-rose-400 bg-white'
                      }`}
                      style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: `${cols * 100}% ${rows * 100}%`,
                        backgroundPosition: getBackgroundPosition(piece.row, piece.col),
                      }}
                    >
                      {/* Selection overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-rose-500/25 ring-2 ring-inset ring-rose-500 flex items-center justify-center">
                          <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Đã chọn
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status footer for tray */}
              <div className="mt-3 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>🖱️ Kéo thả hoặc bấm chọn mảnh rồi bấm ô</span>
                <span className="font-semibold text-rose-600">
                  Còn {unplacedPieces.length}/{totalSlots} mảnh
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
