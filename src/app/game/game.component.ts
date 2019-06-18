import { Component, OnInit } from '@angular/core';

import { Rect } from '../rect';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    constructor() { }

    ngOnInit() {
	console.log('game on');
    }

}
