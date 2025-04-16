import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfileControlComponent } from './cutomer-profile-control.component';

describe('CutomerProfileControlComponent', () => {
  let component: CustomerProfileControlComponent;
  let fixture: ComponentFixture<CustomerProfileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProfileControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerProfileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
