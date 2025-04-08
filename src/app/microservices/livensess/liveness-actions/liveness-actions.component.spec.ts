import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivenessActionsComponent } from './liveness-actions.component';

describe('LivenessActionsComponent', () => {
  let component: LivenessActionsComponent;
  let fixture: ComponentFixture<LivenessActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivenessActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivenessActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
