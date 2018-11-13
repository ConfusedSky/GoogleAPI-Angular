import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { 
  trigger,
  state, 
  style, 
  animate, 
  transition 
} from "@angular/animations";
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('profile', [
      state('invisible', style({
        //opacity: 0,
        left: '100%'
      })),
      state('visible', style({
        //opacity: 1,
        left: '80%'
      })),
      transition('invisible => visible', [
        animate('.5s')
      ]),
      transition('visible => invisible',[
        animate('.2s')
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  img : string = "";
  name : string = "";
  email : string = "";
  animate : boolean = false;

  imgLoaded() : void {
    this.animate = true;
  }

  constructor(private auth : AuthenticationService) { }

  ngOnInit() {
    this.auth.getStateChanged().subscribe((value) => {
      if(value){
        this.img = this.auth.getImg();
        this.name = this.auth.getName();
        this.email = this.auth.getEmail();
      }
      else{
        this.animate = false;
        this.img = ""
      }
    });
  }
}
