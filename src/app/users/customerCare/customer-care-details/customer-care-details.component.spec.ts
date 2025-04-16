import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCareDetailsComponent } from './customer-care-details.component';

describe('CustomerCareDetailsComponent', () => {
  let component: CustomerCareDetailsComponent;
  let fixture: ComponentFixture<CustomerCareDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerCareDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCareDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
