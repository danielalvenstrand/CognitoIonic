import {Component} from "@angular/core";
import {NavController, NavParams, AlertController} from "ionic-angular";
import {
  UserRegistrationService,
  CognitoCallback,
  UserLoginService,
  LoggedInCallback,
  RegistrationUser
} from "../../providers/cognito-service";
import {HomePage} from "../";
import {EventsService} from "../../providers/events-service";

import { LoginComponent, RegisterComponent,ForgotPasswordStep2Component } from '../';

@Component({
  templateUrl: 'forgotPassword.html'
})
export class ForgotPasswordStep1Component implements CognitoCallback {
  phone_number:string;

  constructor(public nav:NavController, public alertCtrl:AlertController, public userService:UserLoginService) {
  }

  onNext() {
    this.userService.forgotPassword(this.phone_number, this);
  }

  cognitoCallback(message:string, result:any) {
    if (message == null && result == null) { 
      this.nav.push(ForgotPasswordStep2Component, {'phone_number': this.phone_number})
    }
  }

  navToRegister() {
    this.nav.push(RegisterComponent);
  }

  navToLogin() {
    this.nav.push(LoginComponent);
  }

  doAlert(title:string, message:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}