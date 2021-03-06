import { Card } from './card';
import { ClickTarget } from './click-target';
import { EventTarget } from './event-target';
import { Rect } from './rect';
import { CARD_WIDTH, CARD_HEIGHT, SELECTED_COLOR, RED } from './constants';

export const CardSlotEvents = {
  CARD_SELECTED: 'card-selected',
};

export class CardSlot {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  player: string | null;
  card: Card | null;
  selected: boolean;
  clickTarget: ClickTarget;
  eventTarget: EventTarget;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, player: string | null) {
    this.ctx = ctx;
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

  placeCard(card: Card): CardSlot {
    this.card = card;
    return this;
  }

  draw(turn: string): void {
    if (!this.card) { return; }
    if (this.selected) {
      this.ctx.fillStyle = SELECTED_COLOR;
      this.ctx.fillRect(this.x - 4, this.y - 4, CARD_WIDTH + 8, CARD_HEIGHT + 8);
    }
    const flipped = this.player === RED || (this.player == null && turn === RED);
    this.card.draw(this.x, this.y, flipped);
  }

  getClickTargets(): ClickTarget[] {
    return [this.clickTarget];
  }

  handleClick(): void {
    this.eventTarget.dispatch(CardSlotEvents.CARD_SELECTED);
  }
}
