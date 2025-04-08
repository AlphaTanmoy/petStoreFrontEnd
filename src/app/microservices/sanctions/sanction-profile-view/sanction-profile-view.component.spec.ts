import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionProfileViewComponent } from './sanction-profile-view.component';

describe('SanctionProfileViewComponent', () => {
  let component: SanctionProfileViewComponent;
  let fixture: ComponentFixture<SanctionProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SanctionProfileViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
