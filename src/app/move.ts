export class Move {
  right: number;
  down: number;

  constructor(right: number, down: number) {
    this.right = right;
    this.down = down;
  }

  flip(): Move {
    return new Move(-this.right, -this.down);
  }

  eq(move: Move): boolean {
    return this.right === move.right && this.down === move.down;
  }
}
