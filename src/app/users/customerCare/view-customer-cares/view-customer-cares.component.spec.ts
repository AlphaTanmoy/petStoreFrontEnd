import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerCaresComponent } from './view-customer-cares.component';

describe('ViewCustomerCaresComponent', () => {
  let component: ViewCustomerCaresComponent;
  let fixture: ComponentFixture<ViewCustomerCaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCustomerCaresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCustomerCaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
