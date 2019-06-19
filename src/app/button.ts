import { ClickTarget } from './click-target';
import { EventTarget } from './event-target';
import { Rect } from './rect';

export const ButtonEvents = {
    CLICKED: 'clicked',
};

export class Button {
    ctx: CanvasRenderingContext2D;
    text: string;
    rect: Rect;
    eventTarget: EventTarget;
    clickTargets: ClickTarget[];
    
    constructor(ctx: CanvasRenderingContext2D, text: string, rect: Rect) {
	this.ctx = ctx;
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
	this.ctx.fillStyle = '#333333';
	this.ctx.fillRect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);
	this.ctx.fillStyle = '#FFFFFF';
	this.ctx.font = '30px serif';
	this.ctx.textBaseline = 'middle';
	this.ctx.textAlign = 'center';
	this.ctx.fillText(this.text, this.rect.centerX, this.rect.centerY);
    }

    getClickTargets() {
	return this.clickTargets;
    }
}

