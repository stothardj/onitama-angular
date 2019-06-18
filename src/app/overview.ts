import { TitleScreen } from './title-screen';
import { Board } from './board';
import { CardSlot } from './card-slot';
import { Game } from './game';
import { VictoryScreen } from './victory-screen';

export class Overview {
    constructor() {
    }

    displayTitle() {
	const titleScreen = new TitleScreen();
	titleScreen.draw();
	titleScreen.addEventListeners();
	titleScreen.eventTarget.listen(() => {
	    titleScreen.removeEventListeners();
	    this.startGame();
	}, TitleScreenEvents.START_GAME);
    }

    startGame() {
	const board = new Board(20, 100, 350);
	board.initPieces();

	const cardSlots = [
	    new CardSlot(400, 20, RED),
	    new CardSlot(600, 20, RED),
	    new CardSlot(500, 220, null),
	    new CardSlot(400, 460, BLUE),
	    new CardSlot(600, 460, BLUE),
	];
	const cards = getCards();

	const game = new Game(board, cardSlots, RED);
	game.dealCards(cards);
	game.draw();
	game.addEventListeners();

	game.eventTarget.listen((type, data) => {
	    game.removeEventListeners();
	    this.displayVictory(data.winner);
	}, GameEvents.GAME_WON);
    }

    displayVictory(winner) {
	const victoryScreen = new VictoryScreen(winner);
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
