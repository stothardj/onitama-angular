import { Clickable } from './clickable';
import { ClickTarget } from './click-target';
import { registerClick } from './util';

export class Screen {
  canvas: HTMLCanvasElement;
  clickListener: () => void;
  clickables: Clickable[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.clickListener = registerClick.bind(this);
    this.clickables = [];
  }

  addEventListeners(): void {
    this.canvas.addEventListener('click', this.clickListener);
  }

  removeEventListeners(): void {
    this.canvas.removeEventListener('click', this.clickListener);
  }

  addClickable(child: Clickable): void {
    this.clickables.push(child);
  }

  getClickTargets(): ClickTarget[] {
    let targets: ClickTarget[] = [];
    for (const child of this.clickables) {
      targets = targets.concat(child.getClickTargets());
    }
    return targets;
  }
}
