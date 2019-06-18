import { ClickTarget } from './click-target';
import { EventTarget } from './event-target';
import { Rect } from './rect';

export const ButtonEvents = {
    CLICKED: 'clicked',
};

export class Button {
    text: string;
    rect: Rect;
    eventTarget: EventTarget;
    clickTargets: ClickTarget[];
    
    constructor(text: string, rect: Rect) {
	this.text = text;
	this.rect = rect;

	this.eventTarget = new EventTarget();

	this.clickTargets = [
	    new ClickTarget(this.rect, () => {
		this.eventTarget.dispatch(ButtonEvents.CLICKED);
	    })
	];
    }

    draw() {
	ctx.fillStyle = '#333333';
	ctx.fillRect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);
	ctx.fillStyle = '#FFFFFF';
	ctx.font = '30px serif';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText(this.text, this.rect.centerX, this.rect.centerY);
    }

    getClickTargets() {
	return this.clickTargets;
    }
}

