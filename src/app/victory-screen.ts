import { Screen } from './screen';
import { EventTarget } from './event-target';
import { Button, ButtonEvents } from './button';
import { Rect } from './rect';

export const VictoryScreenEvents = {
  RETURN_TO_TITLE: 'return-to-title',
};

export class VictoryScreen extends Screen {
  ctx: CanvasRenderingContext2D;
  winner: string;
  eventTarget: EventTarget;
  titleButton: Button;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, winner: string) {
    super(canvas);
    this.ctx = ctx;
    this.winner = winner;
    this.eventTarget = new EventTarget();
    this.titleButton = new Button(ctx, 'Return to Title',
      new Rect(100, 200, this.canvas.width - 100, 300));
    this.addClickable(this.titleButton);
    this.titleButton.eventTarget.listen(() => {
      this.eventTarget.dispatch(VictoryScreenEvents.RETURN_TO_TITLE);
    }, ButtonEvents.CLICKED);
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '50px serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${this.winner} won!`, this.canvas.width / 2, 100);

    this.titleButton.draw();
  }
}
