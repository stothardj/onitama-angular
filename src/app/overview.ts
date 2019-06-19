import { TitleScreen, TitleScreenEvents } from './title-screen';
import { Board } from './board';
import { CardSlot } from './card-slot';
import { Game, GameEvents } from './game';
import { VictoryScreen, VictoryScreenEvents } from './victory-screen';
import { RED, BLUE } from './constants';
import { getCards } from './cards';

export class Overview {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	this.canvas = canvas;
	this.ctx = ctx;
    }

    displayTitle() {
	const titleScreen = new TitleScreen(this.canvas, this.ctx);
	titleScreen.draw();
	titleScreen.addEventListeners();
	titleScreen.eventTarget.listen(() => {
	    titleScreen.removeEventListeners();
	    this.startGame();
	}, TitleScreenEvents.START_GAME);
    }

    startGame() {
	const board = new Board(this.ctx, 20, 100, 350);
	board.initPieces();

	const cardSlots = [
	    new CardSlot(this.ctx, 400, 20, RED),
	    new CardSlot(this.ctx, 600, 20, RED),
	    new CardSlot(this.ctx, 500, 220, null),
	    new CardSlot(this.ctx, 400, 460, BLUE),
	    new CardSlot(this.ctx, 600, 460, BLUE),
	];
	const cards = getCards(this.ctx);

	const game = new Game(this.canvas, this.ctx, board, cardSlots, RED);
	game.dealCards(cards);
	game.draw();
	game.addEventListeners();

	game.eventTarget.listen((type, data) => {
	    game.removeEventListeners();
	    this.displayVictory(data.winner);
	}, GameEvents.GAME_WON);
    }

    displayVictory(winner) {
	const victoryScreen = new VictoryScreen(this.canvas, this.ctx, winner);
	victoryScreen.draw();
	victoryScreen.addEventListeners();
	victoryScreen.eventTarget.listen(() => {
	    victoryScreen.removeEventListeners();
	    this.displayTitle();
	}, VictoryScreenEvents.RETURN_TO_TITLE);
    }

    run() {
	this.displayTitle();
    }
}
