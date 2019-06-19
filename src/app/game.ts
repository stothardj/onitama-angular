import { Board, BoardEvents } from './board';
import { Card } from './card';
import { CardSlot, CardSlotEvents } from './card-slot';
import { Coord } from './coord';
import { EventTarget } from './event-target';
import { nextTurn, registerClick } from './util';
import { Master } from './master';
import { RED } from './constants';

export const GameEvents = {
    GAME_WON: 'game-won',
};

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    board: Board;
    cardSlots: CardSlot[];
    turn: string;
    neutralCardSlot: CardSlot;
    selectedPieceCoord: Coord;
    selectedCardSlot: CardSlot;
    eventTarget: EventTarget;
    clickListener: (Event) => void;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, board: Board, cardSlots: CardSlot[], turn: string) {
	this.canvas = canvas;
	this.ctx = ctx;
	this.board = board;
	this.cardSlots = cardSlots;
	this.turn = turn;

	this.neutralCardSlot = this.cardSlots.find(cardSlot => cardSlot.player == null);

	this.selectedPieceCoord = null;
	this.selectedCardSlot = null;

	this.board.eventTarget.listen((type, data) => this.pieceSelected(data), BoardEvents.PIECE_SELECTED);
	this.board.eventTarget.listen((type, data) => this.boardSelected(data), BoardEvents.BOARD_SELECTED);
	for (const cardSlot of this.cardSlots) {
	    cardSlot.eventTarget.listen(() => this.cardSlotSelected(cardSlot), CardSlotEvents.CARD_SELECTED);
	}

	this.eventTarget = new EventTarget();

	this.clickListener = registerClick.bind(this);
    }

    dealCards(cards: Card[]) {
	for (let i=0; i<this.cardSlots.length; i++) {
	    this.cardSlots[i].placeCard(cards[i]);
	}
    }

    draw() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.board.draw();
	for (const cardSlot of this.cardSlots) {
	    cardSlot.draw(this.turn);
	}
    }

    addEventListeners() {
	this.canvas.addEventListener('click', this.clickListener);
    }

    removeEventListeners() {
	this.canvas.removeEventListener('click', this.clickListener);
    }

    getSelectedPiece() {
	if (this.selectedPieceCoord == null) return null;
	return this.board.getPiece(this.selectedPieceCoord);
    }

    selectPieceAt(coord) {
	this.selectedPieceCoord = coord;
	this.board.getPiece(coord).selected = true;
    }

    deselectPiece() {
	if (this.selectedPieceCoord == null) return;
	this.board.getPiece(this.selectedPieceCoord).selected = false;
	this.selectedPieceCoord = null;
    }

    selectCardSlot(cardSlot: CardSlot) {
	this.selectedCardSlot = cardSlot;
	cardSlot.selected = true;
    }

    deselectCardSlot() {
	if (this.selectedCardSlot == null) return;
	this.selectedCardSlot.selected = false;
	this.selectedCardSlot = null;
    }

    getClickTargets() {
	const targets = [];
	targets.push(...this.board.getClickTargets());
	for (const cardSlot of this.cardSlots) {
	    targets.push(...cardSlot.getClickTargets());
	}
	return targets;
    }

    canSelectPiece(piece) {
	return this.turn == piece.color;
    }
    
    canSelectCardSlot(cardSlot: CardSlot) {
	return this.turn == cardSlot.player;
    }

    willWin() {
	const takenPiece = this.board.getPiece(this.board.destinationMarker);
	if (takenPiece instanceof Master) return true;
	const selectedPiece = this.getSelectedPiece();
	if (!(selectedPiece instanceof Master)) return false;
	const goal = this.board.goalFor(this.turn);
	return this.board.destinationMarker.eq(goal);
    }

    // Returns the winner, or null if the game is not over yet.
    completeMove() {
	if (this.selectedPieceCoord == null
	    || this.selectedCardSlot == null
	    || this.board.destinationMarker == null) {
	    return null;
	}

	const move = this.selectedPieceCoord.moveTo(this.board.destinationMarker);
	// Important to save the piece as a local var so we don't lose track of it
	// as we move things around.
	const piece = this.getSelectedPiece();
	const card = this.selectedCardSlot.card;

	const flipped = this.turn == RED;
	if (!card.hasMove(move, flipped)) return null;

	let winner = null;
	if (this.willWin()) {
	    winner = this.turn;
	}

	this.board.movePiece(this.selectedPieceCoord, this.board.destinationMarker);

	const neutralCard = this.neutralCardSlot.card;

	this.selectedCardSlot.placeCard(neutralCard);
	this.neutralCardSlot.placeCard(card);

	// Use the local we saved before we moved things around for setting the
	// internal selected state to false.
	piece.selected = false;
	// No problem with card slot though as it's the slot not the card which
	// is selected.
	this.selectedCardSlot.selected = false;
	this.selectedPieceCoord = null;
	this.selectedCardSlot = null;
	this.board.destinationMarker = null;
	this.turn = nextTurn(this.turn);

	return winner;
    }

    endGame(winner: string) {
	this.eventTarget.dispatch(GameEvents.GAME_WON, {winner});
    }

    boardSelected(data) {
	const coord = data.coord;
	this.board.destinationMarker = coord;

	const winner = this.completeMove();

	this.draw();

	if (winner) this.endGame(winner);
    }

    pieceSelected(data) {
	const coord = data.coord;
	const piece = this.board.getPiece(coord);

	if (!this.canSelectPiece(piece)) {
	    this.boardSelected({coord})
	    return;
	}

	let winner = null;
	if (piece.selected) {
	    this.deselectPiece();
	} else {
	    const selectedPiece = this.getSelectedPiece();
	    if (selectedPiece) selectedPiece.selected = false;
	    this.selectPieceAt(coord);
	    winner = this.completeMove();
	}
	this.draw();

	if (winner) this.endGame(winner);
    }

    cardSlotSelected(cardSlot: CardSlot) {
	if (!this.canSelectCardSlot(cardSlot)) return;

	let winner = null;
	if (cardSlot.selected) {
	    this.deselectCardSlot();
	} else {
	    if (this.selectedCardSlot) this.selectedCardSlot.selected = false;
	    this.selectCardSlot(cardSlot);
	    winner = this.completeMove();
	}
	this.draw();

	if (winner) this.endGame(winner);
    }
}
