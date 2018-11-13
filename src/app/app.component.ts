import { Component, ApplicationRef } from '@angular/core';
import { AuthenticationService } from './authentication.service';

import { HttpClient } from "@angular/common/http";

import { catchError } from "rxjs/operators";
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title : string = "google";
  files : string[] = [];
  url = "https://www.googleapis.com/drive/v2/files";
  batchUrl = "https://www.googleapis.com/batch/drive/v2";

  constructor(public auth: AuthenticationService,
              public http: HttpClient,
              public app: ApplicationRef){
    auth.getStateChanged().subscribe((value) => this.generateFiles(value));
    this.generateFiles(this.auth.isSignedIn());
  }

  generateFiles(signIn : boolean) : void {
    if(signIn) {
      this.http.get(`${this.url}/0B0PlDrzQdktcb3BsZDdnOHFTSWc/children?orderBy=modifiedDate`, this.auth.getOptions()).pipe(
        catchError((err: any) : Observable<any> => {
          console.error(err);
          return of([] as any);
        })
      ).subscribe(result => {
        this.files = result.items.map(x=>`${this.url}/${x.id}?fields=title`);
        //var x = this.files[0];
        //this.app.tick();

        for (let i = 0; i < this.files.length; i++) {
          const x = this.files[i];

          this.http.get(x, this.auth.getOptions()).pipe(
            catchError((err: any) : Observable<any> => {
              console.error(err);
              return of([] as any);
            })
          ).subscribe(result => {
            this.files[i] = result.title;
            this.app.tick();
          })
        }
      })
    } else {
      this.files = [];
    }
  }
}
