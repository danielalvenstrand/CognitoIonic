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

import { LoginComponent, RegisterComponent } from '../';


@Component({
  templateUrl: 'forgotPasswordStep2.html'
})
export class ForgotPasswordStep2Component implements CognitoCallback {

  verificationCode:string;
  phone_number:string;
  password:string;

  constructor(public nav:NavController, public navParam:NavParams, public alertCtrl:AlertController, public userService:UserLoginService) {
    this.phone_number = navParam.get("phone_number");
  }

  onNext() {
    this.userService.confirmNewPassword(this.phone_number, this.verificationCode, this.password, this);
  }

  cognitoCallback(message:string) {
    if (message != null) { 
      this.doAlert("Verification Code", message);
    } else { 
      this.nav.push(LoginComponent);
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
