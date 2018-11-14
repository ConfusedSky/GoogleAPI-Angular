import { Component, OnInit, NgZone, ApplicationRef } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { File } from '../file';

@Component({
  selector: 'app-drive-browser',
  templateUrl: './drive-browser.component.html',
  styleUrls: ['./drive-browser.component.css']
})
export class DriveBrowserComponent implements OnInit {
  files: File[];

  constructor(public auth : AuthenticationService,
              private zone : NgZone,
              private app : ApplicationRef) { }

  //auth.getStateChanged().subscribe((value) => this.generateFiles(value));
  //this.generateFiles(this.auth.isSignedIn());

  ngOnInit() {
  }
  generateFiles(signIn : boolean) : void {
    if(signIn) {
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
