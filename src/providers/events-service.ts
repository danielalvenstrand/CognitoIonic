import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Events} from "ionic-angular";

export const _USER_LOGOUT_EVENT = 'user:logout';
export const _USER_LOGIN_EVENT = 'user:login';

/*
  Generated class for the EventsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class EventsService {

  constructor(public events:Events) {

  }

  sendLoggedInEvent() {
    console.log("Publishing login event");
    this.events.publish(_USER_LOGIN_EVENT);
  }

  sendLogoutEvent() {
    console.log("Publishing logout event");
    this.events.publish(_USER_LOGOUT_EVENT);
  }

}
