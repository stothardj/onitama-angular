import { SELECTED_COLOR } from './constants';

export class Disciple {
  ctx: CanvasRenderingContext2D;
  color: string;
  selected: boolean;

  constructor(ctx: CanvasRenderingContext2D, color: string) {
    this.ctx = ctx;
    this.color = color;
    this.selected = false;
  }

  draw(x: number, y: number, size: number): void {
    if (this.selected) {
      this.ctx.fillStyle = SELECTED_COLOR;
      this.ctx.beginPath();
      this.ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.fillStyle = '#ffffff';
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, size / 2 - 5, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
}
