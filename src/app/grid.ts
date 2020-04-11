import { Coord } from './coord';
import { Rect } from './rect';

export class Grid {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  cells: number;
  cellSize: number;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, cells: number) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = size;
    this.cells = cells;
    this.cellSize = size / cells;
  }

  canvasX(coordX: number): number {
    return this.x + this.cellSize * coordX;
  }

  canvasY(coordY: number): number {
    return this.y + this.cellSize * coordY;
  }

  canvasRect(coord: Coord): Rect {
    return new Rect(this.canvasX(coord.x), // left
      this.canvasY(coord.y), // top
      this.canvasX(coord.x + 1), // right
      this.canvasY(coord.y + 1)); // bottom
  }

  coord(canvasX: number, canvasY: number): Coord {
    return new Coord(
      Math.floor((canvasX - this.x) / this.cellSize),
      Math.floor((canvasY - this.y) / this.cellSize));
  }

  draw(): void {
    for (let i = 1; i < this.cells; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvasX(i), this.y);
      this.ctx.lineTo(this.canvasX(i), this.y + this.size);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.canvasY(i));
      this.ctx.lineTo(this.x + this.size, this.canvasY(i));
      this.ctx.stroke();
    }
    this.ctx.strokeRect(this.x, this.y, this.size, this.size);
  }
}
