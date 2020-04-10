export interface Piece {
  color: string;
  selected: boolean;
  draw: (x: number, y: number, size: number) => void;
}
