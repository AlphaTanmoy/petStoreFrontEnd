import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSellesComponent } from './view-selles.component';

describe('ViewSellesComponent', () => {
  let component: ViewSellesComponent;
  let fixture: ComponentFixture<ViewSellesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSellesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
