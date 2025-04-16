import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiderProfileControlComponent } from './raider-profile-control.component';

describe('RaiderProfileControlComponent', () => {
  let component: RaiderProfileControlComponent;
  let fixture: ComponentFixture<RaiderProfileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiderProfileControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiderProfileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
