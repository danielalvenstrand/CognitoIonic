import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AnimationController, Animations } from '../../providers/animations';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	@ViewChild('star') star: ElementRef;

	constructor(public navCtrl: NavController, public animationCtrl: AnimationController) {
	}

	ionViewDidLoad(): void {
		this.animationCtrl.loadAnimation(this.star, Animations.STAR,
		{
			loop: true,
			autoplay: true
		});
	}

	play(): void {
		this.animationCtrl.play(this.star);
	}

	pause(): void {
		this.animationCtrl.pause(this.star);
	}

	speed($event): void {
		this.animationCtrl.setSpeed(this.star,$event.value/100);
	}

}
