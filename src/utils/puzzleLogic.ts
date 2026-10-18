import type { PuzzlePiece } from '../types.ts';

/**
 * Generates initial pieces for a given grid dimensions
 */
export function createPieces(rows: number, cols: number): PuzzlePiece[] {
  const pieces: PuzzlePiece[] = [];
  let id = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pieces.push({
        id,
        row: r,
        col: c,
        currentSlotId: null,
      });
      id++;
    }
  }
  return pieces;
}

/**
 * Deterministic or randomized shuffle that guarantees pieces are shuffled
 */
export function shufflePieces(pieces: PuzzlePiece[], randomFn: () => number = Math.random): PuzzlePiece[] {
  const result = [...pieces];
  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  // Ensure it's not already in perfectly sorted order if more than 2 pieces
  if (result.length > 2 && result.every((p, idx) => p.id === idx + 1)) {
    // swap first two
    [result[0], result[1]] = [result[1], result[0]];
  }

  return result;
}

/**
 * Validates if the selected piece belongs to the given slot
 */
export function checkPlacement(pieceId: number, slotId: number): boolean {
  return pieceId === slotId;
}

/**
 * Checks if all slots from 1 to totalPieces are correctly filled
 */
export function isPuzzleSolved(placedPiecesMap: Record<number, number>, totalPieces: number): boolean {
  if (Object.keys(placedPiecesMap).length !== totalPieces) {
    return false;
  }
  for (let slotId = 1; slotId <= totalPieces; slotId++) {
    if (placedPiecesMap[slotId] !== slotId) {
      return false;
    }
  }
  return true;
}

/**
 * Calculates current completion percentage
 */
export function calculateProgress(placedCount: number, totalPieces: number): number {
  if (totalPieces <= 0) return 0;
  return Math.min(100, Math.round((placedCount / totalPieces) * 100));
}
