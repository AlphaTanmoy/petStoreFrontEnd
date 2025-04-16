import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRaidersComponent } from './view-raiders.component';

describe('ViewRaidersComponent', () => {
  let component: ViewRaidersComponent;
  let fixture: ComponentFixture<ViewRaidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRaidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRaidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
