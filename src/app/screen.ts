import { ClickTarget } from './click-target';

interface Clickable {
    getClickTargets: () => ClickTarget[];
}

export class Screen {
    clickables: Clickable[];
    
    constructor() {
	this.clickListener = registerClick.bind(this);
	this.clickables = [];
    }
    
    addEventListeners() {
	canvas.addEventListener('click', this.clickListener);
    }

    removeEventListeners() {
	canvas.removeEventListener('click', this.clickListener);
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
