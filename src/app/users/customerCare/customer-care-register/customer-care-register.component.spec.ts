import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCareRegisterComponent } from './customer-care-register.component';

describe('CustomerCareRegisterComponent', () => {
  let component: CustomerCareRegisterComponent;
  let fixture: ComponentFixture<CustomerCareRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerCareRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCareRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
