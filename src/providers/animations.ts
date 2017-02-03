import { Injectable, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as bodymovin from 'bodymovin';

/*
Generated class for the Animations provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
	*/

export enum Animations {
	STAR = 0
};

@Injectable()
export class AnimationController implements IAnimations {
	types = {
		0: 'assets/animations/Star_1a.json'
	};

	constructor(public http: Http) {
		console.log('Hello Animations Provider');
	}

	loadAnimation(element: ElementRef, type: Animations, options?: any): void {
		this.http.get(this.types[type]).map(response => response.json()).subscribe(data => {
			element.nativeElement.animation = bodymovin.loadAnimation({
				container: element.nativeElement, // the dom element
				renderer: 'svg',
				animationData: data, // the animation data
				loop: options.loop,
				autoplay: options.autoplay
			})
		});
	}

	play(element: ElementRef): void {
		element.nativeElement.animation.play();
	}

	pause(element: ElementRef): void {
		element.nativeElement.animation.pause();
	}

	setSpeed(element: ElementRef, speed: number): void {
		element.nativeElement.animation.setSpeed(speed);
	}

}

interface IAnimations {
	types: { [id: number]: string };
}
