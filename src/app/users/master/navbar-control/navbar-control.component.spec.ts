import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarControlComponent } from './navbar-control.component';

describe('NavbarControlComponent', () => {
  let component: NavbarControlComponent;
  let fixture: ComponentFixture<NavbarControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
