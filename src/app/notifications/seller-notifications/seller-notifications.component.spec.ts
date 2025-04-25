import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerNotificationsComponent } from './seller-notifications.component';

describe('SellerNotificationsComponent', () => {
  let component: SellerNotificationsComponent;
  let fixture: ComponentFixture<SellerNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
