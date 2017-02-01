import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {_POOL_DATA} from "./properties";
import {EventsService} from "./events-service";

declare let AWS:any;
declare let AWSCognito:any;

/*
  Generated class for the CognitoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
    */

  export class RegistrationUser {
    phone_number: string;
  }

  export interface CognitoCallback {
    cognitoCallback(message:string, result:any):void;
  }

  export interface LoggedInCallback {
    isLoggedInCallback(message:string, loggedIn:boolean):void;
  }

  export interface Callback {
    callback():void;
    callbackWithParam(result:any):void;
  }

  @Injectable()
  export class CognitoUtil {

    constructor() {
      console.log("CognitoUtil constructor");
    }

    getUserPool() {
      return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_POOL_DATA);
    }

    getCurrentUser() {
      return this.getUserPool().getCurrentUser();
    }


    getCognitoIdentity():string {
      return AWS.config.credentials.identityId;
    }

    getAccessToken(callback:Callback):void {
      if (callback == null) {
        throw("callback in getAccessToken is null...returning");
      }
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          console.log("Can't set the credentials:" + err);
          callback.callbackWithParam(null);
        }

        else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getAccessToken().getJwtToken());
          }
        }
      });
    }

    getIdToken(callback:Callback):void {
      if (callback == null) {
        throw("callback in getIdToken is null...returning");
      }
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          console.log("Can't set the credentials:" + err);
          callback.callbackWithParam(null);
        }
        else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getIdToken().getJwtToken());
          } else {
            console.log("Got the id token, but the session isn't valid");
          }
        }
      });
    }

    getRefreshToken(callback:Callback):void {
      if (callback == null) {
        throw("callback in getRefreshToken is null...returning");
      }
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          console.log("Can't set the credentials:" + err);
          callback.callbackWithParam(null);
        }

        else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getRefreshToken());
          }
        }
      });
    }
  }

  @Injectable()
  export class UserRegistrationService {
    constructor(public cUtil:CognitoUtil) {
    }

    register(user:RegistrationUser, callback:CognitoCallback):void {
      console.log("user: ", user);

      let attributeList = [];

      let dataPhone = {
        Name: 'phone_number',
        Value: user.phone_number
      };
      attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhone));

      this.cUtil.getUserPool().signUp(user.phone_number, user.phone_number, attributeList, null, function (err, result) {
        if (err) {
          callback.cognitoCallback(err.message, null);
        } else {
          console.dir(result);
          console.dir(result.user.getUsername());
          callback.cognitoCallback(null, result);
        }
      });

    }

    confirmRegistration(phone_number:string, confirmationCode:string, callback:CognitoCallback):void {

      let userData = {
        Username: phone_number,
        Pool: this.cUtil.getUserPool()
      };

      console.log("UserData: ", userData)

      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

      console.log("Cognito user: ",cognitoUser)

      cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
        if (err) {
          callback.cognitoCallback(err.message, null);
        } else {
          callback.cognitoCallback(null, result);
        }
      });
    }

    resendCode(phone_number:string, callback:CognitoCallback):void {
      let userData = {
        Username: phone_number,
        Pool: this.cUtil.getUserPool()
      };

      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

      cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
          callback.cognitoCallback(err.message, null);
        } else {
          callback.cognitoCallback(null, result);
        }
      });
    }

  }

  @Injectable()
  export class UserLoginService {

    constructor(public cUtil:CognitoUtil, public eventService:EventsService) {
      console.log("eventservice1: " + eventService);
    }

    authenticate(phone_number:string, callback:CognitoCallback) {
      let mythis = this;

      // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
      AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})

      let authenticationData = {
        Username: phone_number,
        Password: phone_number,
      };
      let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

      let userData = {
        Username: phone_number,
        Pool: this.cUtil.getUserPool()
      };

      console.log("Authenticating the user");
      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          callback.cognitoCallback(null, result);
          mythis.eventService.sendLoggedInEvent();
        },
        onFailure: function (err) {
          callback.cognitoCallback(err.message, null);
        },
      });
    }

    forgotPassword(phone_number:string, callback:CognitoCallback) {
      let userData = {
        Username: phone_number,
        Pool: this.cUtil.getUserPool()
      };

      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

      cognitoUser.forgotPassword({
        onSuccess: function (result) {

        },
        onFailure: function (err) {
          callback.cognitoCallback(err.message, null);
        },
        inputVerificationCode() {
          callback.cognitoCallback(null, null);
        }
      });
    }

    confirmNewPassword(phone_number:string, verificationCode:string, password:string, callback:CognitoCallback) {
      let userData = {
        Username: phone_number,
        Pool: this.cUtil.getUserPool()
      };

      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: function (result) {
          callback.cognitoCallback(null, result);
        },
        onFailure: function (err) {
          callback.cognitoCallback(err.message, null);
        }
      });
    }

    logout() {
      console.log("Logging out");
      this.cUtil.getCurrentUser().signOut();
      this.eventService.sendLogoutEvent();
    }

    isAuthenticated(callback:LoggedInCallback) {
      if (callback == null)
        throw("Callback in isAuthenticated() cannot be null");

      console.log("Getting the current user");
      let cognitoUser = this.cUtil.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
          if (err) {
            console.log("Couldn't get the session: " + err, err.stack);
            callback.isLoggedInCallback(err, false);
          }
          else {
            console.log("Session is valid: " + session.isValid());
            callback.isLoggedInCallback(err, session.isValid());
          }
        });
      } else {
        callback.isLoggedInCallback("Can't retrieve the CurrentUser", false);
      }
    }

  }

  @Injectable()
  export class UserParametersService {

    constructor(public cUtil:CognitoUtil) {

    }

    getParameters(callback:Callback) {
      let cognitoUser = this.cUtil.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
          if (err)
            console.log("Couldn't retrieve the user");
          else {
            cognitoUser.getUserAttributes(function (err, result) {
              if (err) {
                console.log("in getParameters: " + err);
              } else {
                callback.callbackWithParam(result);
              }
            });
          }

        });
      } else {
        callback.callbackWithParam(null);
      }


    }

    getParameter(name:string, callback:Callback) {

    }

  }