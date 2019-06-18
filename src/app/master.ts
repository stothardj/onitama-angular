export class Master {
    color: string;
    selected: boolean;
    
    constructor(color: string) {
	this.color = color;
	this.selected = false;
    }

    draw(x: number, y: number, size: number) {
	if (this.selected) {
	    ctx.fillStyle = SELECTED_COLOR;
	    ctx.beginPath();
	    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
	    ctx.fill();
	}
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(x + size / 2, y + size / 2, size / 2 - 5, 0, Math.PI * 2);
	ctx.fill();
    }
}
