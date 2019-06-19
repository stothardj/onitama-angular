import { ClickTarget } from './click-target';
import { registerClick } from './util';

interface Clickable {
    getClickTargets: () => ClickTarget[];
}

export class Screen {
    canvas: HTMLCanvasElement;
    clickListener: () => void;
    clickables: Clickable[];
    
    constructor(canvas: HTMLCanvasElement) {
	this.canvas = canvas;
	this.clickListener = registerClick.bind(this);
	this.clickables = [];
    }
    
    addEventListeners() {
	this.canvas.addEventListener('click', this.clickListener);
    }

    removeEventListeners() {
	this.canvas.removeEventListener('click', this.clickListener);
    }

    addClickable(child) {
	this.clickables.push(child);
	return child;
    }

    getClickTargets() {
	let targets = [];
	for (const child of this.clickables) {
	    targets = targets.concat(child.getClickTargets());
	}
	return targets;
    }
}
