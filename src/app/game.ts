import { Board, BoardEvents } from './board';
import { Card } from './card';
import { CardSlot, CardSlotEvents } from './card-slot';
import { ClickTarget } from './click-target';
import { Coord } from './coord';
import { EventTarget } from './event-target';
import { Master } from './master';
import { Piece } from './piece';
import { RED } from './constants';
import { nextTurn, registerClick } from './util';

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
  selectedPieceCoord: Coord | null;
  selectedCardSlot: CardSlot | null;
  eventTarget: EventTarget;
  clickListener: (Event) => void;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, board: Board, cardSlots: CardSlot[], turn: string) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.board = board;
    this.cardSlots = cardSlots;
    this.turn = turn;

    const neutralSlot = this.cardSlots.find(cardSlot => cardSlot.player == null);
    if (!neutralSlot) {
      throw new Error('Could not find neutral card slot');
    }
    this.neutralCardSlot = neutralSlot;

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

  dealCards(cards: Card[]): void {
    for (let i = 0; i < this.cardSlots.length; i++) {
      this.cardSlots[i].placeCard(cards[i]);
    }
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.board.draw();
    for (const cardSlot of this.cardSlots) {
      cardSlot.draw(this.turn);
    }
  }

  addEventListeners(): void {
    this.canvas.addEventListener('click', this.clickListener);
  }

  removeEventListeners(): void {
    this.canvas.removeEventListener('click', this.clickListener);
  }

  getSelectedPiece(): Piece | null {
    if (this.selectedPieceCoord == null) { return null; }
    return this.board.getPiece(this.selectedPieceCoord) || null;
  }

  selectPieceAt(coord: Coord): void {
    this.selectedPieceCoord = coord;
    const piece = this.board.getPiece(coord);
    if (piece) {
      piece.selected = true;
    }
  }

  deselectPiece(): void {
    if (this.selectedPieceCoord == null) { return; }
    const piece = this.board.getPiece(this.selectedPieceCoord);
    if (piece) {
      piece.selected = false;
    }
    this.selectedPieceCoord = null;
  }

  selectCardSlot(cardSlot: CardSlot): void {
    this.selectedCardSlot = cardSlot;
    cardSlot.selected = true;
  }

  deselectCardSlot(): void {
    if (this.selectedCardSlot == null) { return; }
    this.selectedCardSlot.selected = false;
    this.selectedCardSlot = null;
  }

  getClickTargets(): ClickTarget[] {
    const targets: ClickTarget[] = [];
    targets.push(...this.board.getClickTargets());
    for (const cardSlot of this.cardSlots) {
      targets.push(...cardSlot.getClickTargets());
    }
    return targets;
  }

  canSelectPiece(piece): boolean {
    return this.turn === piece.color;
  }

  canSelectCardSlot(cardSlot: CardSlot): boolean {
    return this.turn === cardSlot.player;
  }

  willWin(): boolean {
    if (this.board.destinationMarker == null) { return false; }
    const takenPiece = this.board.getPiece(this.board.destinationMarker);
    if (takenPiece instanceof Master) { return true; }
    const selectedPiece = this.getSelectedPiece();
    if (!(selectedPiece instanceof Master)) { return false; }
    const goal = this.board.goalFor(this.turn);
    return this.board.destinationMarker.eq(goal);
  }

  // Returns the winner, or null if the game is not over yet.
  completeMove(): string | null {
    if (this.selectedPieceCoord == null
      || this.selectedCardSlot == null
      || this.board.destinationMarker == null) {
      return null;
    }

    const move = this.selectedPieceCoord.moveTo(this.board.destinationMarker);
    // Important to save the piece as a local var so we don't lose track of it
    // as we move things around.
    const piece = this.getSelectedPiece();
    if (!piece) {
      return null;
    }
    const card = this.selectedCardSlot.card;
    if (!card) {
      return null;
    }

    const flipped = this.turn === RED;
    if (!card.hasMove(move, flipped)) { return null; }

    let winner: string | null = null;
    if (this.willWin()) {
      winner = this.turn;
    }

    this.board.movePiece(this.selectedPieceCoord, this.board.destinationMarker);

    const neutralCard = this.neutralCardSlot.card;
    if (!neutralCard) {
      return null;
    }

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
    this.eventTarget.dispatch(GameEvents.GAME_WON, { winner });
  }

  boardSelected(data) {
    const coord = data.coord;
    this.board.destinationMarker = coord;

    const winner = this.completeMove();

    this.draw();

    if (winner) { this.endGame(winner); }
  }

  pieceSelected(data) {
    const coord = data.coord;
    const piece = this.board.getPiece(coord);

    if (!piece) {
      return;
    }

    if (!this.canSelectPiece(piece)) {
      this.boardSelected({ coord });
      return;
    }

    let winner: string | null = null;
    if (piece.selected) {
      this.deselectPiece();
    } else {
      const selectedPiece = this.getSelectedPiece();
      if (selectedPiece) { selectedPiece.selected = false; }
      this.selectPieceAt(coord);
      winner = this.completeMove();
    }
    this.draw();

    if (winner) { this.endGame(winner); }
  }

  cardSlotSelected(cardSlot: CardSlot) {
    if (!this.canSelectCardSlot(cardSlot)) { return; }

    let winner: string | null = null;
    if (cardSlot.selected) {
      this.deselectCardSlot();
    } else {
      if (this.selectedCardSlot) { this.selectedCardSlot.selected = false; }
      this.selectCardSlot(cardSlot);
      winner = this.completeMove();
    }
    this.draw();

    if (winner) { this.endGame(winner); }
  }
}
