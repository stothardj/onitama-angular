import { Card } from './card';
import { Move } from './move';
import { shuffle } from './random';

interface CardDef {
  left?: number;
  right?: number;
  up?: number;
  down?: number;
}

export const CARDS: Record<string, CardDef[]> = {
  'monkey': [{ 'left': 1, 'up': 1 },
  { 'right': 1, 'up': 1 },
  { 'left': 1, 'down': 1 },
  { 'right': 1, 'down': 1 }],
  'ox': [{ 'up': 1 },
  { 'right': 1 },
  { 'down': 1 }],
  'rabbit': [{ 'left': 1, 'down': 1 },
  { 'right': 1, 'up': 1 },
  { 'right': 2 }],
  'eel': [{ 'left': 1, 'up': 1 },
  { 'left': 1, 'down': 1 },
  { 'right': 1 }],
  'crab': [{ 'left': 2 },
  { 'up': 1 },
  { 'right': 2 }],
  'cobra': [{ 'left': 1 },
  { 'right': 1, 'up': 1 },
  { 'right': 1, 'down': 1 }],
  'frog': [{ 'left': 2 },
  { 'left': 1, 'up': 1 },
  { 'right': 1, 'down': 1 }],
  'goose': [{ 'left': 1, 'up': 1 },
  { 'left': 1 },
  { 'right': 1 },
  { 'right': 1, 'down': 1 }],
  'rooster': [{ 'left': 1 },
  { 'left': 1, 'down': 1 },
  { 'right': 1 },
  { 'right': 1, 'up': 1 }],
  'horse': [{ 'left': 1 },
  { 'up': 1 },
  { 'down': 1 }],
  'crane': [{ 'left': 1, 'down': 1 },
  { 'up': 1 },
  { 'right': 1, 'down': 1 }],
  'boar': [{ 'left': 1 },
  { 'up': 1 },
  { 'right': 1 }],
  'elephant': [{ 'left': 1, 'up': 1 },
  { 'left': 1 },
  { 'right': 1, 'up': 1 },
  { 'right': 1 }],
  'mantis': [{ 'left': 1, 'up': 1 },
  { 'down': 1 },
  { 'right': 1, 'up': 1 }],
  'dragon': [{ 'left': 2, 'up': 1 },
  { 'left': 1, 'down': 1 },
  { 'right': 1, 'down': 1 },
  { 'right': 2, 'up': 1 }],
  'tiger': [{ 'up': 2 },
  { 'down': 1 }]
};

function getRight(move: CardDef): number {
  if (move.right) { return move.right; }
  if (move.left) { return -move.left; }
  return 0;
}

function getDown(move: CardDef): number {
  if (move.down) { return move.down; }
  if (move.up) { return -move.up; }
  return 0;
}

export function getCards(ctx: CanvasRenderingContext2D): Card[] {
  const cards: Card[] = [];
  for (const [name, moves] of Object.entries(CARDS)) {
    const parsedMoves: Move[] = [];
    for (const move of moves) {
      const right = getRight(move);
      const down = getDown(move);
      parsedMoves.push(new Move(right, down));
    }
    cards.push(new Card(ctx, name, parsedMoves));
  }
  shuffle(cards);

  return cards.slice(0, 5);
}
