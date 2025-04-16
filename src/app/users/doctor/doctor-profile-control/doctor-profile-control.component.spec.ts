import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorProfileControlComponent } from './doctor-profile-control.component';

describe('DoctorProfileControlComponent', () => {
  let component: DoctorProfileControlComponent;
  let fixture: ComponentFixture<DoctorProfileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorProfileControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorProfileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
