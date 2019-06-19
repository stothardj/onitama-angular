import { Screen } from './screen';
import { ClickTarget } from './click-target';
import { Button, ButtonEvents } from './button';
import { EventTarget } from './event-target';
import { Rect } from './rect';

export const TitleScreenEvents = {
    START_GAME: 'start-game',
};

export class TitleScreen extends Screen {
    ctx: CanvasRenderingContext2D;
    eventTarget: EventTarget;
    newGameButton: Button;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	super(canvas);
	this.ctx = ctx;
	this.eventTarget = new EventTarget();
	this.newGameButton = this.addClickable(
	    new Button(ctx, 'New Game',
		       new Rect(100, 200, this.canvas.width - 100, 300)));
	this.newGameButton.eventTarget.listen(() => {
	    this.eventTarget.dispatch(TitleScreenEvents.START_GAME);
	}, ButtonEvents.CLICKED);
    }
    
    draw() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    	this.ctx.fillStyle = '#000000';
	this.ctx.font = '50px serif';
	this.ctx.textAlign = 'center';
	this.ctx.fillText('Onitama', this.canvas.width / 2, 100);

	this.newGameButton.draw();
    }
}
