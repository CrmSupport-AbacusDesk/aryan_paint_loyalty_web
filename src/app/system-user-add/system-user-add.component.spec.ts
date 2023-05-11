import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUserAddComponent } from './system-user-add.component';

describe('SystemUserAddComponent', () => {
  let component: SystemUserAddComponent;
  let fixture: ComponentFixture<SystemUserAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUserAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
