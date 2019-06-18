import { EventTarget } from './event-target';
import { Grid } from './grid';
import { Piece } from './piece';
import { Coord } from './coord';

export const BoardEvents = {
    BOARD_SELECTED: 'board-selected',
    PIECE_SELECTED: 'piece-selected',
};

export class Board {
    pieces: Map;
    x: number;
    y: number;
    size: number;
    grid: Grid;
    eventTarget: EventTarget;
    destinationMarker: Coord;
    
    constructor(x: number, y: number, size: number) {
	this.pieces = new Map();
	this.x = x;
	this.y = y;
	this.size = size;
	this.grid = new Grid(x, y, size, BOARD_SIZE);
	this.eventTarget = new EventTarget();
	this.destinationMarker = null;
    }

    initPieces() {
	this.pieces.clear();
	const middle = Math.floor(BOARD_SIZE / 2);
	const bottom = BOARD_SIZE - 1;
	this.addPiece(new Coord(middle, 0), new Master(RED));
	this.addPiece(new Coord(middle, bottom), new Master(BLUE));
	for (let i=0; i<BOARD_SIZE; i++) {
	    if (i == middle) continue;
	    this.addPiece(new Coord(i, 0), new Disciple(RED));
	    this.addPiece(new Coord(i, bottom), new Disciple(BLUE));
	}
    }

    addPiece(coord: Coord, piece: Piece) {
	this.pieces.set(coord.toKey(), piece);
    }

    movePiece(from: Coord, to: Coord) {
	const piece = this.pieces.get(from.toKey());
	this.pieces.delete(from.toKey());
	this.pieces.set(to.toKey(), piece);
    }

    goalFor(turn: string) {
	const goalX = Math.floor(BOARD_SIZE / 2);
	const goalY = turn == RED ? (BOARD_SIZE - 1) : 0;
	return new Coord(goalX, goalY);
    }

    draw() {
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000000';
	this.grid.draw();

	if (this.destinationMarker) {
	    ctx.fillStyle = SELECTED_COLOR;
	    const rect = this.grid.canvasRect(this.destinationMarker);
	    ctx.fillRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
	}

	for (const [coordKey, piece] of this.pieces) {
	    const coord = Coord.fromKey(coordKey);
	    piece.draw(this.grid.canvasX(coord.x), this.grid.canvasY(coord.y), this.grid.cellSize);
	}
    }

    getClickTargets() {
	const targets = [];
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

    getPiece(coord: Coord) {
	const coordKey = coord.toKey();
	return this.pieces.get(coordKey);
    }

    handleClickBoard(ev) {
	const x = ev.offsetX;
	const y = ev.offsetY;

	const coord = this.grid.coord(x, y);
	this.eventTarget.dispatch(BoardEvents.BOARD_SELECTED, {coord});
    }

    handleClickPiece(coord: Coord) {
	this.eventTarget.dispatch(BoardEvents.PIECE_SELECTED, {coord});

	return false;
    }
}
