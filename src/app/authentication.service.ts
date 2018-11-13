import { Injectable, ApplicationRef, EventEmitter } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';

import GoogleAuth = gapi.auth2.GoogleAuth;
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private signedIn: boolean = false;
  private auth : GoogleAuth = undefined;

  private img : string = "";
  private name : string = "";
  private email : string = "";

  isSignedIn() : boolean { return this.signedIn; }

  getImg() : string { return this.img; }
  getName() : string { return this.name; }
  getEmail() : string { return this.email; }

  private stateChanged : EventEmitter<boolean> = new EventEmitter<boolean>();

  getStateChanged() : Observable<boolean> {
    return this.stateChanged.asObservable();
  }

  getOptions() : {headers: HttpHeaders} {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization' : 'Bearer ' + this.auth.currentUser.get().getAuthResponse().access_token
      })
    }
  } 

  signIn() : void {
    if(this.auth)
    {
      this.auth.signIn();
      this.app.tick();
    }
  }

  private actualSignIn(value : boolean) {
    if(value)
    {
      this.name = this.auth.currentUser.get().getBasicProfile().getName();
      this.img = this.auth.currentUser.get().getBasicProfile().getImageUrl();
      this.email = this.auth.currentUser.get().getBasicProfile().getEmail();
    }
    this.signedIn = value;
    this.stateChanged.emit(value);
    this.app.tick();
  }

  signOut() : void {
    if(this.auth)
    {
      this.auth.signOut();
      this.signedIn = false;
      this.app.tick();
    }
  }

  constructor(private gapiAuth: GoogleAuthService,
              private app: ApplicationRef) {
    this.gapiAuth.getAuth().subscribe((auth) => 
    {
      this.auth = auth;
      this.actualSignIn(auth.isSignedIn.get());
      auth.isSignedIn.listen((val) => this.actualSignIn(val));
      this.app.tick();
    })
  }
}
