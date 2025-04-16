import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProfileControlComponent } from './seller-profile-control.component';

describe('SellerProfileControlComponent', () => {
  let component: SellerProfileControlComponent;
  let fixture: ComponentFixture<SellerProfileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProfileControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProfileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
