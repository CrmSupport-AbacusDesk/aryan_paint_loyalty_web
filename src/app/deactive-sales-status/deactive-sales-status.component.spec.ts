import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactiveSalesStatusComponent } from './deactive-sales-status.component';

describe('DeactiveSalesStatusComponent', () => {
  let component: DeactiveSalesStatusComponent;
  let fixture: ComponentFixture<DeactiveSalesStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactiveSalesStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactiveSalesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
