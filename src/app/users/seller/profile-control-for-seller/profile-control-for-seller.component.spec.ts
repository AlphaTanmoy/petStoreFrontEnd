import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileControlForSellerComponent } from './profile-control-for-seller.component';

describe('ProfileControlForSellerComponent', () => {
  let component: ProfileControlForSellerComponent;
  let fixture: ComponentFixture<ProfileControlForSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileControlForSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileControlForSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
