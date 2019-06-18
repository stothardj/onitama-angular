export class Move {
    right: number;
    down: number;
    
    constructor(right: number, down: number) {
	this.right = right;
	this.down = down;
    }

    flip() {
	return new Move(-this.right, -this.down);
    }

    eq(move: Move) {
	return this.right == move.right && this.down == move.down;
    }
}
