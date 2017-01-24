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

import { LoginComponent, ConfirmRegistrationComponent } from '../';

@Component({

  templateUrl: 'registration.html'
})
export class RegisterComponent implements CognitoCallback {
  registrationUser:RegistrationUser;

  constructor(public nav:NavController,
              public userRegistration:UserRegistrationService,
              public alertCtrl:AlertController) {
    this.registrationUser = new RegistrationUser();
  }

  ionViewDidLoad() {

  }

  onRegister() {
    this.userRegistration.register(this.registrationUser, this);
  }

  cognitoCallback(message:string, result:any) {
    if (message != null) { 
      this.doAlert("Registration", message);
    } else { 
      console.log("in callback...result: " + result);
      this.nav.push(ConfirmRegistrationComponent, {
        'username': result.user.username,
        'email': this.registrationUser.email
      });
    }
  }

  /*navToResendCode() {
    this.nav.push(ResendCodeComponent);
  }*/

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