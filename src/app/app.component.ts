import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen, Push, LocalNotifications } from 'ionic-native';

import { HomePage, LoginComponent, DetailsPage } from '../pages';
import { AwsUtil } from '../providers/aws-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = LoginComponent;

  constructor(platform: Platform, public alertCtrl: AlertController, public awsUtil: AwsUtil) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.awsUtil.initAwsService();
      StatusBar.styleDefault();
      Splashscreen.hide();

      /**
      * Push start
      */
      let push = Push.init({
        android: {
          senderID: "943131006719"
        },
        ios: {
          alert: "true",
          badge: false,
          sound: "true"
        },
        windows: {}
      });

      push.on('registration', (data) => {
        console.log("device token ->", data.registrationId);
        this.awsUtil.initSNSService(data.registrationId);
        //TODO - send device token to server
        });
      push.on('notification', (data) => {
        console.log('message', data.message);
        let self = this;
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: 'New Notification',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                //TODO: Your logic here
                self.nav.push(DetailsPage, {message: data.message});
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          /*LocalNotifications.schedule({
            id: 1,
            title: 'CognitoIonic Push notification',
            text: data.message,
            data: { message: data.message }
          });*/
          self.nav.push(DetailsPage, {message: data.message});
          console.log("Push notification clicked");
        }
      });
      push.on('error', (e) => {
        console.log(e.message);
      });
    })

  }

}
