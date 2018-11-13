import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { 
  trigger,
  state, 
  style, 
  animate, 
  transition 
} from "@angular/animations";

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
export class ProfileComponent implements OnInit, OnChanges {
  @Input() img : string = "";
  @Input() name : string = "";
  @Input() email : string = "";
  @Input() visible : boolean = false;

  animate : boolean = false;

  loaded : boolean = false;

  firstLoad = true;

  imgLoaded() : void {
    if(this.firstLoad)
    {
      this.animate = true;
    }

    this.loaded = true;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.img)
    {
      this.loaded = false;
    }
    if(changes.loaded || changes.visible)
    {
      this.animate = this.visible && this.loaded;
    }
  }

}
