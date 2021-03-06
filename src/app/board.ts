import { EventTarget } from './event-target';
import { Grid } from './grid';
import { Piece } from './piece';
import { Master } from './master';
import { Disciple } from './disciple';
import { Coord } from './coord';
import { ClickTarget } from './click-target';
import { Rect } from './rect';
import { BOARD_SIZE, RED, BLUE, SELECTED_COLOR } from './constants';

export const BoardEvents = {
  BOARD_SELECTED: 'board-selected',
  PIECE_SELECTED: 'piece-selected',
};

const LABELING_SPACE = 40;

export class Board {
  ctx: CanvasRenderingContext2D;
  pieces: Map<number, Piece>;
  x: number;
  y: number;
  size: number;
  grid: Grid;
  eventTarget: EventTarget;
  destinationMarker: Coord | null;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    this.ctx = ctx;
    this.pieces = new Map();
    this.x = x;
    this.y = y;
    this.size = size;
    this.grid = new Grid(this.ctx, x + LABELING_SPACE, y, size - LABELING_SPACE, BOARD_SIZE);
    this.eventTarget = new EventTarget();
    this.destinationMarker = null;
  }

  initPieces(): void {
    this.pieces.clear();
    const middle = Math.floor(BOARD_SIZE / 2);
    const bottom = BOARD_SIZE - 1;
    this.addPiece(new Coord(middle, 0), new Master(this.ctx, RED));
    this.addPiece(new Coord(middle, bottom), new Master(this.ctx, BLUE));
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (i === middle) { continue; }
      this.addPiece(new Coord(i, 0), new Disciple(this.ctx, RED));
      this.addPiece(new Coord(i, bottom), new Disciple(this.ctx, BLUE));
    }
  }

  addPiece(coord: Coord, piece: Piece): void {
    this.pieces.set(coord.toKey(), piece);
  }

  movePiece(from: Coord, to: Coord): void {
    const piece = this.pieces.get(from.toKey());
    if (piece) {
      this.pieces.delete(from.toKey());
      this.pieces.set(to.toKey(), piece);
    }
  }

  goalFor(turn: string): Coord {
    const goalX = Math.floor(BOARD_SIZE / 2);
    const goalY = turn === RED ? (BOARD_SIZE - 1) : 0;
    return new Coord(goalX, goalY);
  }

  draw(): void {
    this.ctx.font = 'bold 24px helvectica';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#000000';
    const aCharCode = 'a'.charCodeAt(0);
    for (let i = 0; i < this.grid.cells; i++) {
      this.ctx.fillText((i + 1).toString(), this.x + LABELING_SPACE / 2, this.grid.canvasY(BOARD_SIZE - i) - this.grid.cellSize / 2);
      this.ctx.fillText(String.fromCharCode(aCharCode + i), this.grid.canvasX(i) + this.grid.cellSize / 2, this.y + this.size - LABELING_SPACE / 2);
    }

    for (let x = 0; x < this.grid.cells; x++) {
      for (let y = 0; y < this.grid.cells; y++) {
        this.ctx.fillStyle = (x + y) % 2 ? '#dddddd' : '#ddffdd';
        const rect = this.grid.canvasRect(new Coord(x, y));
        this.ctx.fillRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
      }
    }

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#000000';
    this.grid.draw();

    if (this.destinationMarker) {
      this.ctx.fillStyle = SELECTED_COLOR;
      const rect = this.grid.canvasRect(this.destinationMarker);
      this.ctx.fillRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
    }

    for (const [coordKey, piece] of this.pieces) {
      const coord = Coord.fromKey(coordKey);
      piece.draw(this.grid.canvasX(coord.x), this.grid.canvasY(coord.y), this.grid.cellSize);
    }
  }

  getClickTargets(): ClickTarget[] {
    const targets: ClickTarget[] = [];
    for (const [coordKey, piece] of this.pieces) {
      const coord = Coord.fromKey(coordKey);
      targets.push(new ClickTarget(
        this.grid.canvasRect(coord),
        () => this.handleClickPiece(coord)));
    }
    targets.push(new ClickTarget(
      new Rect(this.x, this.y, this.x + this.size, this.y + this.size),
      (ev) => this.handleClickBoard(ev)));
    return targets;
  }

  getPiece(coord: Coord): Piece | undefined {
    const coordKey = coord.toKey();
    return this.pieces.get(coordKey);
  }

  handleClickBoard(ev): void {
    const x = ev.offsetX;
    const y = ev.offsetY;

    const coord = this.grid.coord(x, y);
    this.eventTarget.dispatch(BoardEvents.BOARD_SELECTED, { coord });
  }

  handleClickPiece(coord: Coord): boolean {
    this.eventTarget.dispatch(BoardEvents.PIECE_SELECTED, { coord });

    return false;
  }
}
