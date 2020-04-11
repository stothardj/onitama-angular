import { Rect } from './rect';

export class ClickTarget {
  private bounds: Rect;
  private handler: (ev) => void;

  constructor(bounds: Rect, handler: (ev) => void) {
    this.bounds = bounds;
    this.handler = handler;
  }

  contains(x: number, y: number): boolean {
    return this.bounds.contains(x, y);
  }

  trigger(ev): void {
    this.handler(ev);
  }
}
