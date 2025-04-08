import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionActionsComponent } from './sanction-actions.component';

describe('SanctionActionsComponent', () => {
  let component: SanctionActionsComponent;
  let fixture: ComponentFixture<SanctionActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SanctionActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
