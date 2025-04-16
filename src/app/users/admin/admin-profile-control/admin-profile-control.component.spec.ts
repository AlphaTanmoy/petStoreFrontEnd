import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileControlComponent } from './admin-profile-control.component';

describe('AdminProfileControlComponent', () => {
  let component: AdminProfileControlComponent;
  let fixture: ComponentFixture<AdminProfileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProfileControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
