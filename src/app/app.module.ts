import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import {
  HomePage,
  LoginComponent,
  ConfirmRegistrationComponent,
  RegisterComponent,
  ForgotPasswordStep1Component,
  ForgotPasswordStep2Component,
  DetailsPage
} from '../pages';
import {
  CognitoUtil,
  UserLoginService,
  UserParametersService,
  UserRegistrationService
} from '../providers/cognito-service';
import { AwsUtil } from '../providers/aws-service';
import { EventsService } from '../providers/events-service';
import { AnimationController } from '../providers/animations';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginComponent,
    ConfirmRegistrationComponent,
    RegisterComponent,
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component,
    DetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginComponent,
    ConfirmRegistrationComponent,
    RegisterComponent,
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component,
    DetailsPage
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  UserLoginService,
  UserRegistrationService,
  UserParametersService,
  CognitoUtil,
  EventsService,
  AwsUtil,
  AnimationController,
  Storage
  ]
})
export class AppModule {}
