import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { GoogleApiModule, NgGapiClientConfig, NG_GAPI_CONFIG } from "ng-gapi";
import { HttpClientModule } from '@angular/common/http';

import { clientID } from "./info";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';

export let gapiClientConfig: NgGapiClientConfig = {
  discoveryDocs: [], 
  scope: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
  ].join(" "),
  client_id: clientID,
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
