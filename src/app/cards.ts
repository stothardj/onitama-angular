import { Card } from './card';
import { Move } from './move';

interface CardDef {
    left?: number;
    right?: number;
    up?: number;
    down?: number;
}

export const CARDS: Record<string, CardDef[]> = {
    'monkey': [{'left': 1, 'up': 1},
	       {'right': 1, 'up': 1},
	       {'left': 1, 'down': 1},
	       {'right': 1, 'down': 1}],
    'ox': [{'up': 1},
	   {'right': 1},
	   {'down': 1}],
    'rabbit': [{'left': 1, 'down': 1},
	       {'right': 1, 'up': 1},
	       {'right': 2}],
    'eel': [{'left': 1, 'up': 1},
	    {'left': 1, 'down': 1},
	    {'right': 1}],
    'crab': [{'left': 2},
	     {'up': 1},
	     {'right': 2}]
};

export function getCards(ctx: CanvasRenderingContext2D) {
    const cards = [];
    for (const [name, moves] of Object.entries(CARDS)) {
	const parsedMoves = [];
	for (const move of moves) {
	    const right = move.right || -move.left || 0;
	    const down = move.down || -move.up || 0;
	    parsedMoves.push(new Move(right, down));
	}
	cards.push(new Card(ctx, name, parsedMoves));
    }
    return cards;
}
