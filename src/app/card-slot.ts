import { Card } from './card';
import { ClickTarget } from './click-target';
import { EventTarget } from './event-target';
import { Rect } from './rect';

export const CardSlotEvents = {
    CARD_SELECTED: 'card-selected',
};

export class CardSlot {
    x: number;
    y: number;
    player: string;
    card: Card;
    selected: boolean;
    clickTarget: ClickTarget;
    eventTarget: EventTarget;
    
    constructor(x: number, y: number, player: string) {
	this.x = x;
	this.y = y;
	this.player = player;
	this.card = null;
	this.selected = false;
	this.clickTarget = new ClickTarget(
	    new Rect(this.x, this.y, this.x + CARD_WIDTH, this.y + CARD_HEIGHT),
	    () => this.handleClick());
	this.eventTarget = new EventTarget();
    }

    placeCard(card: Card) {
	this.card = card;
	return this;
    }

    draw(turn: string) {
	if (!this.card) return;
	if (this.selected) {
	    ctx.fillStyle = SELECTED_COLOR;
	    ctx.fillRect(this.x - 4, this.y - 4, CARD_WIDTH + 8, CARD_HEIGHT + 8);
	}
	const flipped = this.player == RED || (this.player == null && turn == RED);
	this.card.draw(this.x, this.y, flipped);
    }

    getClickTargets() {
	return [this.clickTarget];
    }

    handleClick() {
	this.eventTarget.dispatch(CardSlotEvents.CARD_SELECTED);
    }
}
