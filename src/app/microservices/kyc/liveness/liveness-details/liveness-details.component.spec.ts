import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivenessDetailsComponent } from './liveness-details.component';

describe('LivenessDetailsComponent', () => {
  let component: LivenessDetailsComponent;
  let fixture: ComponentFixture<LivenessDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivenessDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivenessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
