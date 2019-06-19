import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Overview } from '../overview';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    @ViewChild('gameCanvas') gameCanvas: ElementRef;

    constructor() { }

    ngOnInit() {
	console.log('game on');
    }

    ngAfterViewInit() {
	const canvas = (<HTMLCanvasElement>this.gameCanvas.nativeElement);
	const ctx = canvas.getContext('2d');
	const overview = new Overview(canvas, ctx);
	overview.run();
    }
}
