import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileControlForAdminComponent } from './profile-control-for-admin.component';

describe('ProfileControlForAdminComponent', () => {
  let component: ProfileControlForAdminComponent;
  let fixture: ComponentFixture<ProfileControlForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileControlForAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileControlForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
