import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCareProfileControlComponent } from './customer-care-profile-control.component';

describe('CustomerCareProfileControlComponent', () => {
  let component: CustomerCareProfileControlComponent;
  let fixture: ComponentFixture<CustomerCareProfileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerCareProfileControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCareProfileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
