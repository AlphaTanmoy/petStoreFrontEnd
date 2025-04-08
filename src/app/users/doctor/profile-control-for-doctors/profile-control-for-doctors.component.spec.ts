import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileControlForDoctorsComponent } from './profile-control-for-doctors.component';

describe('ProfileControlForDoctorsComponent', () => {
  let component: ProfileControlForDoctorsComponent;
  let fixture: ComponentFixture<ProfileControlForDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileControlForDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileControlForDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
