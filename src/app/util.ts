import { RED, BLUE } from './constants';

export function nextTurn(turn: string): string {
  return turn === RED ? BLUE : RED;
}

export function registerClick(ev): void {
  const x = ev.offsetX;
  const y = ev.offsetY;
  for (const target of this.getClickTargets()) {
    if (target.contains(x, y)) {
      const bubble = target.trigger(ev);
      if (!bubble) { break; }
    }
  }
}
