import { Move } from './move';
import { BOARD_SIZE } from './constants';

export class Coord {

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;

  static fromKey(key): Coord {
    return new Coord(key % BOARD_SIZE, Math.floor(key / BOARD_SIZE));
  }

  toKey(): number {
    return this.x + this.y * BOARD_SIZE;
  }

  moveTo(other): Move {
    return new Move(other.x - this.x, other.y - this.y);
  }

  eq(other): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
