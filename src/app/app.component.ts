import { Component, ApplicationRef, NgZone } from '@angular/core';
import { AuthenticationService } from './authentication.service';

import { HttpClient } from "@angular/common/http";

import { File } from "./file";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  files : File[] = [];

  constructor(public auth: AuthenticationService,
              private http: HttpClient,
              private app: ApplicationRef,
              private zone: NgZone){
    auth.getStateChanged().subscribe((value) => this.generateFiles(value));
    this.generateFiles(this.auth.isSignedIn());
  }

  generateFiles(signIn : boolean) : void {
    if(signIn) {
      const fileID = "0B0PlDrzQdktcY2FWYmlpZVN5YkE";
      this.zone.run(()=>{
        gapi.load("client",() =>{
          gapi.client.load("drive", "v2").then(() => {
            gapi.client.drive.children.list({
              'folderId': "root",
              'orderBy': 'folder,title'
            }).execute((resp) => {
              console.log(resp);
              this.files = resp.items.map(x=>{
                return {id: x.id};
              });

              var batch = new gapi.client.newBatch();
              for(let i = 0; i < this.files.length; i++) {
                batch.add(gapi.client.drive.files.get({
                  'fileId': this.files[i].id,
                  'fields': "title, modifiedDate",
                }), {
                  id: String(i),
                  callback: null
                })
              }
              batch.execute((respMap, raw) =>{
                console.log(respMap);
                for(let i = 0; i < this.files.length; i++)
                {
                  if(respMap[String(i)].error)
                  {
                    this.files[i].name = "Error";
                    continue;
                  }
                  this.files[i].name = respMap[String(i)].result.title;
                  this.files[i].modifiedDate = respMap[String(i)].result.modifiedDate;
                }
                this.app.tick();
              });
            });
          });
        });
      });
    } else {
      this.files = [];
    }
  }
}
