import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactiveStatusGiftComponent } from './deactive-status-gift.component';

describe('DeactiveStatusGiftComponent', () => {
  let component: DeactiveStatusGiftComponent;
  let fixture: ComponentFixture<DeactiveStatusGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactiveStatusGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactiveStatusGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
