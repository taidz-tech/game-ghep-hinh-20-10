export interface PuzzlePiece {
  id: number; // 1-based index (1, 2, ..., total)
  row: number; // 0-based
  col: number; // 0-based
  currentSlotId: number | null; // null if in tray, or 1-based slot id
}

export interface PuzzleConfig {
  rows: number;
  cols: number;
  imageSrc: string;
  imageTitle: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
}
