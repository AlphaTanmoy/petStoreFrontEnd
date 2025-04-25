import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCareNotificationComponent } from './customer-care-notification.component';

describe('CustomerCareNotificationComponent', () => {
  let component: CustomerCareNotificationComponent;
  let fixture: ComponentFixture<CustomerCareNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerCareNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCareNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
