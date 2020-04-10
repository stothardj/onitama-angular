import { Move } from './move';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';
import { Grid } from './grid';

export class Card {
  ctx: CanvasRenderingContext2D;
  name: string;
  moves: Move[];

  constructor(ctx: CanvasRenderingContext2D, name: string, moves: Move[]) {
    this.ctx = ctx;
    this.name = name;
    this.moves = moves;
  }

  hasMove(move: Move, flipped: boolean) {
    const mv = flipped ? move.flip() : move;
    return !!this.moves.find(el => el.eq(mv));
  }

  draw(x: number, y: number, flipped: boolean = false) {
    this.ctx.save();
    this.ctx.translate(x, y);
    if (flipped) {
      this.ctx.translate(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      this.ctx.rotate(Math.PI);
      this.ctx.translate(- CARD_WIDTH / 2, -CARD_HEIGHT / 2);
    }
    this.ctx.fillStyle = '#ddcc99';
    this.ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    this.ctx.strokeStyle = '#000000';
    this.ctx.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    this.ctx.fillStyle = '#000000'
    this.ctx.font = '16px serif';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(this.name.toUpperCase(), 5, 60);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(80, 10, 100, 100);
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    const grid = new Grid(this.ctx, 80, 10, 100, 5);
    grid.draw();
    this.ctx.fillStyle = '#000000';
    const middle = 2;
    this.ctx.fillRect(grid.canvasX(middle), grid.canvasY(middle), grid.cellSize, grid.cellSize);
    this.ctx.fillStyle = '#555555';
    for (const move of this.moves) {
      const x = middle + move.right;
      const y = middle + move.down;
      this.ctx.fillRect(grid.canvasX(x), grid.canvasY(y), grid.cellSize, grid.cellSize);
    }
    this.ctx.restore();
  }
}
