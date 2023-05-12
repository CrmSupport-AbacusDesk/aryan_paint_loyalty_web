import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCouponDetailComponent } from './add-coupon-detail.component';

describe('AddCouponDetailComponent', () => {
  let component: AddCouponDetailComponent;
  let fixture: ComponentFixture<AddCouponDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCouponDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCouponDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
