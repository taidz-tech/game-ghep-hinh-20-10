import React, { useState } from 'react';
import type { PuzzlePiece } from '../types.ts';
import { checkPlacement } from '../utils/puzzleLogic.ts';
import { sound } from '../utils/audioSystem.ts';
import { CheckCircle2, Sparkles, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

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
  const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
  const [errorSlotId, setErrorSlotId] = useState<number | null>(null);
  const [glowSlotId, setGlowSlotId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const totalSlots = rows * cols;
  const unplacedPieces = pieces.filter((p) => !Object.values(placedMap).includes(p.id));

  const triggerError = (slotId: number) => {
    setErrorSlotId(slotId);
    setFeedbackMessage({
      type: 'error',
      text: '❌ Bạn đã ghép sai rồi! Hãy thử lại nhé.',
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
      text: `✨ Tuyệt vời! Bạn đã ghép đúng vị trí ô số ${slotId}!`,
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

    if (placedMap[slotId]) return;

    if (selectedPieceId === null) {
      setFeedbackMessage({
        type: 'error',
        text: '👉 Hãy bấm chọn một mảnh ghép ở khay bên cạnh trước nhé!',
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
      {/* Toast Notification Alert Banner */}
      <div className="min-h-12 flex items-center justify-center w-full max-w-xl mb-3 px-2">
        {feedbackMessage && (
          <div
            className={`w-full text-center py-2 px-5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 ${
              feedbackMessage.type === 'error'
                ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 animate-shake'
                : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 animate-pulse'
            }`}
          >
            {feedbackMessage.text}
          </div>
        )}
      </div>

      {/* Side-by-side on desktop (lg:flex-row), stacked on mobile */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 px-2">
        {/* Left Column: Puzzle Board */}
        <div className="w-full max-w-md sm:max-w-lg lg:w-[460px] flex-shrink-0">
          <div className="relative p-3.5 sm:p-4 rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border-4 border-rose-300 ring-4 ring-pink-100/70">
            {/* Top Bar with title & Preview toggle */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-rose-900 font-serif">
                  {imageTitle}
                </span>
              </div>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors shadow-sm"
                aria-label={showPreview ? 'Ẩn ảnh mẫu' : 'Xem ảnh mẫu gốc'}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    Ẩn ảnh mẫu
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Xem ảnh mẫu
                  </>
                )}
              </button>
            </div>

            {/* Puzzle Grid */}
            <div
              className="relative w-full aspect-square overflow-hidden rounded-2xl bg-white shadow-inner border-2 border-rose-200"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gap: '3px',
                padding: '3px',
                backgroundColor: '#fecdd3', // soft rose dividing borders
              }}
            >
              {Array.from({ length: totalSlots }).map((_, idx) => {
                const slotId = idx + 1;
                const placedPieceId = placedMap[slotId];
                const isCorrectlyPlaced = placedPieceId === slotId;
                const isError = errorSlotId === slotId;
                const isGlow = glowSlotId === slotId;

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
                        ? 'shadow-sm'
                        : 'bg-white hover:bg-pink-50/80 border border-dashed border-rose-300'
                    } ${
                      isError
                        ? 'ring-4 ring-rose-500 bg-rose-100 animate-shake z-20'
                        : ''
                    } ${
                      isGlow
                        ? 'ring-4 ring-emerald-400 animate-green-glow z-20'
                        : ''
                    } ${
                      selectedPieceId && !isCorrectlyPlaced
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
                    {/* Clean pure white slot with clear sequence number */}
                    {!isCorrectlyPlaced && (
                      <div className="flex flex-col items-center justify-center w-full h-full p-1 bg-white">
                        <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-rose-400/90 font-serif tracking-tight drop-shadow-sm">
                          {slotId}
                        </span>
                        <span className="text-[10px] sm:text-xs text-rose-300 font-medium">
                          Ô {slotId}
                        </span>
                      </div>
                    )}

                    {/* Tiny badge indicating completed slot */}
                    {isCorrectlyPlaced && (
                      <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity bg-black/60 text-white rounded-full p-0.5 pointer-events-none">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Overlay Reference Preview */}
              {showPreview && (
                <div
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 p-3 text-white animate-fade-in"
                  onClick={() => setShowPreview(false)}
                >
                  <img
                    src={imageSrc}
                    alt={imageTitle}
                    className="max-h-[85%] max-w-[85%] rounded-xl object-contain shadow-2xl border-2 border-white/50"
                  />
                  <p className="mt-2 text-xs font-medium text-pink-200">
                    (Bấm vào ảnh để đóng ảnh mẫu)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pieces Tray */}
        <div className="w-full max-w-md sm:max-w-lg lg:flex-1 flex flex-col gap-3">
          <div className="rounded-3xl bg-white/90 backdrop-blur-md p-4 sm:p-5 shadow-xl border-3 border-rose-200">
            {/* Tray Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-rose-500 text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-rose-900 font-serif">
                  Khay Mảnh Ghép ({unplacedPieces.length} mảnh còn lại)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {selectedPieceId ? 'Đang chọn 1 mảnh ghép' : 'Chưa chọn mảnh nào'}
              </span>
            </div>

            {/* Instruction Callout */}
            <div className="mb-3 p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-800 leading-snug flex items-start gap-2">
              <span className="text-sm">💡</span>
              <div>
                <strong>Cách chơi rất dễ:</strong> Bấm chọn một mảnh ghép dưới đây (hoặc kéo thả) rồi bấm vào ô số chuẩn trên khung tranh bên trái!
              </div>
            </div>

            {/* Pieces Grid or Scrollable Tray */}
            {unplacedPieces.length === 0 ? (
              <div className="py-10 text-center text-emerald-600 font-bold flex flex-col items-center gap-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                <span className="text-base sm:text-lg">Tuyệt vời! Bạn đã ghép xong toàn bộ bức tranh!</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto p-1">
                {unplacedPieces.map((piece) => {
                  const isSelected = selectedPieceId === piece.id;

                  return (
                    <div
                      key={`piece-${piece.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece.id)}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPieceId(isSelected ? null : piece.id);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Mảnh ghép ${isSelected ? 'đang được chọn' : ''}`}
                      className={`group relative aspect-square rounded-xl cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-200 select-none ${
                        isSelected
                          ? 'ring-4 ring-rose-500 shadow-xl scale-105 z-10'
                          : 'hover:scale-105 shadow-md border-2 border-rose-200 hover:border-rose-400 bg-white'
                      }`}
                      style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: `${cols * 100}% ${rows * 100}%`,
                        backgroundPosition: getBackgroundPosition(piece.row, piece.col),
                      }}
                    >
                      {/* Selection glow border */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-rose-500/20 pointer-events-none ring-2 ring-inset ring-rose-400 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
