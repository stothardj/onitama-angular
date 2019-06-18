import { Move } from './move';

export class Card {
    name: string;
    moves: Move[];
    
    constructor(name: string, moves: Move[]) {
	this.name = name;
	this.moves = moves;
    }

    hasMove(move: Move, flipped: boolean) {
	const mv = flipped ? move.flip() : move;
	return !!this.moves.find(el => el.eq(mv));
    }

    draw(x: number, y: number, flipped = false: boolean) {
	ctx.save();
	ctx.translate(x, y);
	if (flipped) {
	    ctx.translate(CARD_WIDTH / 2, CARD_HEIGHT / 2);
	    ctx.rotate(Math.PI);
	    ctx.translate(- CARD_WIDTH / 2, -CARD_HEIGHT / 2);
	}
	ctx.fillStyle = '#ddcc99';
	ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
	ctx.strokeStyle = '#000000';
	ctx.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
	ctx.fillStyle = '#000000'
	ctx.font = '16px serif';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'left';
	ctx.fillText(this.name.toUpperCase(), 5, 60);
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(80, 10, 100, 100);
	ctx.strokeStyle = '#000000';
	ctx.strokeWidth = 2;
	const grid = new Grid(80, 10, 100, 5);
	grid.draw();
	ctx.fillStyle = '#000000';
	const middle = 2;
	ctx.fillRect(grid.canvasX(middle), grid.canvasY(middle), grid.cellSize, grid.cellSize);
	ctx.fillStyle = '#555555';
	for (const move of this.moves) {
	    const x = middle + move.right;
	    const y = middle + move.down;
	    ctx.fillRect(grid.canvasX(x), grid.canvasY(y), grid.cellSize, grid.cellSize);
	}
	ctx.restore();
    }
}
