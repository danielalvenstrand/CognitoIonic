import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CognitoUtil, UserLoginService} from "./cognito-service";
import {_REGION, _IDENTITY_POOL_ID, _USER_POOL_ID, _MOBILE_ANALYTICS_APP_ID, _SNS_ARN, _TOPIC_ARN} from "./properties";

declare var AWS;
declare var AWSCognito:any;
declare var AMA:any;

/*
  Generated class for the AwsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
    */

  export class Stuff {
    public type:string;
    public date:string;
  }

  @Injectable()
  export class AwsUtil {
    public static firstLogin:boolean = false;

    constructor(public userLogin:UserLoginService, public cUtil:CognitoUtil) {

    }

  /**
   * This is the method that needs to be called in order to init the aws global creds
   */
   initAwsService() {
     console.log("Running initAwsService()");
     AWSCognito.config.region = _REGION;
     AWS.config.region = _REGION;

     var options = {
       appId : _MOBILE_ANALYTICS_APP_ID, //Amazon Mobile Analytics App ID
     };

     var mobileAnalyticsClient = new AMA.Manager(options);
     mobileAnalyticsClient.submitEvents();

     // First check if the user is authenticated already
     let mythis = this;
     this.userLogin.isAuthenticated({
       isLoggedInCallback(message:string, loggedIn:boolean) {
         mythis.setupAWS(loggedIn);
       }
     });
   }

   initSNSService(TOKEN: string) {
     let sns = new AWS.SNS();

     sns.createPlatformEndpoint({
       PlatformApplicationArn: _SNS_ARN,
       Token: TOKEN
     }, function(err, data) {
       if (err) {
         console.log(err.stack);
         return;
       }

       let endpointArn = data.EndpointArn;

       sns.subscribe({
         Protocol: 'application',
         TopicArn: _TOPIC_ARN,
         Endpoint: endpointArn
       }, (err, data) => {
         if (err) {
           console.log(err.stack)
           return
         }
       });
      /*
       let payload = {
         default: 'Hello World',
         APNS: {
           aps: {
             alert: 'Hello World',
             sound: 'default',
             badge: 1
           }
         }
       };

       // first have to stringify the inner APNS object...
       payload.APNS = JSON.stringify(payload.APNS);
       // then have to stringify the entire message payload
       payload = JSON.stringify(payload);

       console.log('sending push');
       sns.publish({
         Message: payload,
         MessageStructure: 'json',
         TargetArn: endpointArn
       }, function(err, data) {
         if (err) {
           console.log(err.stack);
           return;
         }

         console.log('push sent');
         console.log(data);
       });
     }*/

   });
   }


  /**
   * Sets up the AWS global params
   *
   * @param isLoggedIn
   * @param callback
   */
   setupAWS(isLoggedIn:boolean):void {
     console.log("in setupAWS()");
     let mythis = this;
     if (isLoggedIn) {
       console.log("User is logged in");
       this.cUtil.getIdToken({
         callback() {
         },
         callbackWithParam(idToken:any) {
           console.log("idJWT Token: " + idToken);
           mythis.addCognitoCredentials(idToken);
         }
       });
       console.log("Retrieving the id token");
     }
     else {
       console.log("User is not logged in. ");
       AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
         IdentityPoolId: _IDENTITY_POOL_ID
       });
     }
   }

   addCognitoCredentials(idTokenJwt:string):void {
     console.log("in addCognitoCredentials");
     let params = this.getCognitoParametersForIdConsolidation(idTokenJwt);

     AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
     AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials(params);

     console.log("Getting the credentials class");
     // AWS.config.credentials.get(function (err) {
       //   if (!err) {
         //
         //   }
         // });
       }

       getCognitoParametersForIdConsolidation(idTokenJwt:string):{} {
         console.log("enter getCognitoParametersForIdConsolidation()");
         let url = 'cognito-idp.' + _REGION.toLowerCase() + '.amazonaws.com/' + _USER_POOL_ID;
         console.log("ur: " + url);
         let logins:Array<string> = [];
         logins[url] = idTokenJwt;
         let params = {
           IdentityPoolId: _IDENTITY_POOL_ID, /* required */
           Logins: logins
         };

         return params;
       }

     }

