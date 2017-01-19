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

import { RegisterComponent, LoginComponent } from '../';

@Component({
  templateUrl: 'confirmRegistration.html'
})
export class ConfirmRegistrationComponent {
  confirmationCode:string;

  constructor(public nav:NavController, public userRegistration:UserRegistrationService, public navParam:NavParams, public alertCtrl:AlertController) {
    console.log("Entered ConfirmRegistrationComponent");
    console.log("nav param username: " + this.navParam.get("username"))
  }

  ionViewLoaded() {
    console.log("Entered ionViewDidEnter");
    console.log("username: " + this.navParam.get("username"));
  }

  onConfirmRegistration() {
    console.log("Confirming registration");
    this.userRegistration.confirmRegistration(this.navParam.get("username"), this.confirmationCode, this);
  }

  cognitoCallback(message:string, result:any) {
    if (message != null) { 
      this.doAlert("Confirmation", message);
    } else { 
      console.log("Entered ConfirmRegistrationComponent");
      let phone = this.navParam.get("phone");

      if (phone != null)
        this.nav.push(LoginComponent, {
          'phone': phone
        });
      else
        this.nav.push(LoginComponent);
    }
  }

  /*navToResendCode() {
    this.nav.push(ResendCodeComponent);
  }*/

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
