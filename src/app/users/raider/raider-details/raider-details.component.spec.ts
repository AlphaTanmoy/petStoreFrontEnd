import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiderDetailsComponent } from './raider-details.component';

describe('RaiderDetailsComponent', () => {
  let component: RaiderDetailsComponent;
  let fixture: ComponentFixture<RaiderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
