import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLivenessComponent } from './view-liveness.component';

describe('ViewLivenessComponent', () => {
  let component: ViewLivenessComponent;
  let fixture: ComponentFixture<ViewLivenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLivenessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLivenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
