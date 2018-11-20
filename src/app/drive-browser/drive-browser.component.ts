import { Component, OnInit, ApplicationRef } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { File } from '../file';
import { DriveService } from '../drive.service';

import "rxjs/Rx";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-drive-browser',
  templateUrl: './drive-browser.component.html',
  styleUrls: ['./drive-browser.component.css']
})
export class DriveBrowserComponent implements OnInit {
  files: File[];
  selectedFile: File;
  folder: string = "root";
  content: string = "about:blank";

  constructor(public auth : AuthenticationService,
              private app : ApplicationRef,
              private drive : DriveService,
              private sanitizer: DomSanitizer) {
    auth.getStateChanged().subscribe((value)=>{
      if(!value) this.files=[]
    })

    gapi.load("client",() =>{
      auth.getStateChanged().subscribe((value) => this.generateFiles(value));
      this.generateFiles(this.auth.isSignedIn());
    })
  }

  ngOnInit() {
  }

  handleClick() {
    this.selectedFile = undefined;
    this.content = "about:blank";
    this.app.tick();
  }

  sanitzeUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.content);
  }

  onSelect(file: File) {
    if(this.selectedFile===file.id)
    {
    }
    else
    {
      this.selectedFile = file;
      this.drive.downloadFile(this.selectedFile).then(x => {
        const blob = new Blob([x], {type: 'text/html'});
        const url = window.URL.createObjectURL(blob);
        this.content = url;
        this.app.tick();
      }, (reason) => {
        this.content = reason;
        this.app.tick();
      });
      this.app.tick();
    }
  }

  generateFiles(signIn : boolean) : void {
    if(signIn) {
      this.drive.getFiles(this.folder).then((x) => {
        this.files = x
        this.app.tick();
      });
    } else {
      this.files = [];
      this.content = "about:blank";
    }
  }
}
