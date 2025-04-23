import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDev } from './about-dev.component';

describe('AboutDev', () => {
  let component: AboutDev;
  let fixture: ComponentFixture<AboutDev>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutDev]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutDev);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
