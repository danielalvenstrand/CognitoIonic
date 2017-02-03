import {Component} from "@angular/core";
import {NavController, NavParams, AlertController, Platform} from "ionic-angular";
import { Sim } from 'ionic-native';
import {
  UserRegistrationService,
  CognitoCallback,
  UserLoginService,
  LoggedInCallback,
  RegistrationUser
} from "../../providers/cognito-service";
import {HomePage} from "../";
import {EventsService} from "../../providers/events-service";

import { RegisterComponent,ForgotPasswordStep1Component } from '../';

@Component({
  templateUrl: 'login.html'
})
export class LoginComponent implements CognitoCallback, LoggedInCallback {
  phone_number:string;
  phone: string;

  constructor(public nav:NavController,
    public navParam:NavParams,
    public alertCtrl:AlertController,
    public userService:UserLoginService,
    public eventService:EventsService,
    platform: Platform) {
    console.log("LoginComponent constructor");
    if (navParam != null && navParam.get("phone_number") != null)
      {
        this.phone_number = navParam.get("phone_number");
        this.signMeIn();
      }
    platform.ready().then(()=>{
      Sim.getSimInfo().then((result) => {
        console.log(result);
        this.phone = JSON.stringify(result);
      });
    });
  }

  ionViewDidLoad() {
    console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
    this.userService.isAuthenticated(this);
  }

  signMeIn() {
    console.log("in onLogin");
    if (this.phone_number == null) {
      this.doAlert("Error", "All fields are required");
      return;
    }
    this.userService.authenticate(this.phone_number, this);
  }

  cognitoCallback(message:string, result:any) {
    if (message != null) { 
      this.doAlert("Error", message);
      console.log("result: " + message);
    } else { 
      console.log("Redirect to ControlPanelComponent");
      this.nav.setRoot(HomePage);
    }
  }

  isLoggedInCallback(message:string, isLoggedIn:boolean) {
    console.log("The user is logged in: " + isLoggedIn);
    if (isLoggedIn) {
      this.eventService.sendLoggedInEvent();
      this.nav.setRoot(HomePage);
    }
  }

  navToRegister() {
    this.nav.push(RegisterComponent);
  }

  navToForgotPassword() {
    this.nav.push(ForgotPasswordStep1Component);
  }

  doAlert(title:string, message:string) {

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  gotoHome(): void {
    console.log("TEST")
    this.nav.setRoot(HomePage);
  }

}
