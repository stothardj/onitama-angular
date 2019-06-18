import { Screen } from './screen';
import { EventTarget } from './event-target';
import { Button, ButtonEvents } from './button';

export const VictoryScreenEvents = {
    RETURN_TO_TITLE: 'return-to-title',
};

export class VictoryScreen extends Screen {
    winner: string
    eventTarget: EventTarget;
    titleButton: Button;
    
    constructor(winner: string) {
	super();
	this.winner = winner;
	this.eventTarget = new EventTarget();
	this.titleButton = this.addClickable(
	    new Button('Return to Title',
		       new Rect(100, 200, WIDTH - 100, 300)));
	this.titleButton.eventTarget.listen(() => {
	    this.eventTarget.dispatch(VictoryScreenEvents.RETURN_TO_TITLE);
	}, ButtonEvents.CLICKED);
    }

    draw() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
    	ctx.fillStyle = '#000000';
	ctx.font = '50px serif';
	ctx.textAlign = 'center';
	ctx.fillText(`${this.winner} won!`, WIDTH / 2, 100);

	this.titleButton.draw();
    }
}
