import { Move } from './move';
import { BOARD_SIZE } from './constants';

export class Coord {

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;

  static fromKey(key) {
    return new Coord(key % BOARD_SIZE, (key / BOARD_SIZE) | 0);
  }

  toKey() {
    return this.x + this.y * BOARD_SIZE;
  }

  moveTo(other) {
    return new Move(other.x - this.x, other.y - this.y);
  }

  eq(other) {
    return this.x == other.x && this.y == other.y;
  }
}
