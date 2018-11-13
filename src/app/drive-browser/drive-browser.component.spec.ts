import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveBrowserComponent } from './drive-browser.component';

describe('DriveBrowserComponent', () => {
  let component: DriveBrowserComponent;
  let fixture: ComponentFixture<DriveBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriveBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
