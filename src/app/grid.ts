import { Coord } from './coord';
import { Rect } from './rect';

export class Grid {
    x: number;
    y: number;
    size: number;
    cells: number;
    cellSize: number;

    constructor(x: number, y: number, size: number, cells: number) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.cells = cells;
	this.cellSize = size / cells;
    }

    canvasX(coordX: number) {
	return this.x + this.cellSize * coordX;
    }

    canvasY(coordY: number) {
	return this.y + this.cellSize * coordY;
    }

    canvasRect(coord: Coord) {
	return new Rect(this.canvasX(coord.x), // left
			this.canvasY(coord.y), // top
			this.canvasX(coord.x + 1), //right
			this.canvasY(coord.y + 1)); // bottom
    }
    
    coord(canvasX: number, canvasY: number) {
	return new Coord(
	    Math.floor((canvasX - this.x) / this.cellSize),
	    Math.floor((canvasY - this.y) / this.cellSize));
    }

    draw() {
	for (let i=1; i<this.cells; i++) {
	    ctx.beginPath();
	    ctx.moveTo(this.canvasX(i), this.y);
	    ctx.lineTo(this.canvasX(i), this.y + this.size);
	    ctx.stroke();
	    ctx.beginPath();
	    ctx.moveTo(this.x, this.canvasY(i));
	    ctx.lineTo(this.x + this.size, this.canvasY(i));
	    ctx.stroke();
	}
	ctx.strokeRect(this.x, this.y, this.size, this.size);
    }
}
