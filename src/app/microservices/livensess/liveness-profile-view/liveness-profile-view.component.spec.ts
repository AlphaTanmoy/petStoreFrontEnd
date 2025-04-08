import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivenessProfileViewComponent } from './liveness-profile-view.component';

describe('LivenessProfileViewComponent', () => {
  let component: LivenessProfileViewComponent;
  let fixture: ComponentFixture<LivenessProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivenessProfileViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivenessProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
