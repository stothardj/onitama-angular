import { Screen } from './screen';
import { ClickTarget } from './click-target';
import { Button, ButtonEvents } from './button';
import { EventTarget } from './event-target';

export const TitleScreenEvents = {
    START_GAME: 'start-game',
};

export class TitleScreen extends Screen {
    eventTarget: EventTarget;
    newGameButton: Button;

    constructor() {
	super();
	this.eventTarget = new EventTarget();
	this.newGameButton = this.addClickable(
	    new Button('New Game',
		       new Rect(100, 200, WIDTH - 100, 300)));
	this.newGameButton.eventTarget.listen(() => {
	    this.eventTarget.dispatch(TitleScreenEvents.START_GAME);
	}, ButtonEvents.CLICKED);
    }
    
    draw() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
    	ctx.fillStyle = '#000000';
	ctx.font = '50px serif';
	ctx.textAlign = 'center';
	ctx.fillText('Onitama', WIDTH / 2, 100);

	this.newGameButton.draw();
    }
}
