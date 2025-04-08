import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileControlForUserComponent } from './profile-control-for-user.component';

describe('ProfileControlForUserComponent', () => {
  let component: ProfileControlForUserComponent;
  let fixture: ComponentFixture<ProfileControlForUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileControlForUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileControlForUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
