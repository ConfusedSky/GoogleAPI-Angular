import { Component, OnInit, ApplicationRef } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';

import { API_KEY } from "./info";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import GoogleAuth = gapi.auth2.GoogleAuth;

const baseTitle : string = 'google'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title : string = baseTitle;
  signedIn: boolean = false;
  auth : GoogleAuth = undefined;

  img : string = "";
  name : string = "";
  email : string = "";

  constructor(private gapiAuth: GoogleAuthService,
              private app: ApplicationRef,
              private http: HttpClient){
  }

  makeApiCall() : void {
    var params = {
      // The spreadsheet to request.
      spreadsheetId: '1-GOGwk4F1mrVciAK3Qvu3Ol6Wu_OvXBqoT2btq6XUlo',  // TODO: Update placeholder value.
        
      // The ranges to retrieve from the spreadsheet.
      range: 'B2',  // TODO: Update placeholder value.
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'ROWS'
    }

    var url : string = `https://content-sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${params.range}`+
                       `?valueRenderOption=${params.valueRenderOption}`+
                       `&dateTimeRenderOption=${params.dateTimeRenderOption}` +
                       `&majorDimension=${params.majorDimension}`+
                       `&key=${API_KEY}`

    this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization' : 'Bearer ' + this.auth.currentUser.get().getAuthResponse().access_token
      })
    }).pipe(
      catchError(
        (err: any) : Observable<any> => {
          console.error(err);
          return of([] as any)
        }
      )
    ).subscribe(result => {
      this.title = `${baseTitle}: ${result.values[0]}`;
      this.app.tick();
    });
  }

  handleSignInClick() : void {
    if(this.auth)
    {
      this.auth.signIn();
      this.app.tick();
    }
  }

  actualSignIn(value : boolean) {
    if(value)
    {
      this.name = this.auth.currentUser.get().getBasicProfile().getName();
      this.img = this.auth.currentUser.get().getBasicProfile().getImageUrl();
      this.email = this.auth.currentUser.get().getBasicProfile().getEmail();
    }
    this.signedIn = value;
    this.app.tick();
  }

  handleSignOutClick() : void {
    if(this.auth)
    {
      this.auth.signOut();
      this.signedIn = false;
      this.app.tick();
    }
  }

  ngOnInit() {
    this.gapiAuth.getAuth().subscribe((auth) => 
    {
      this.auth = auth;
      this.actualSignIn(auth.isSignedIn.get());
      auth.isSignedIn.listen((val) => this.actualSignIn(val));
      this.app.tick();
    })
  }
}
