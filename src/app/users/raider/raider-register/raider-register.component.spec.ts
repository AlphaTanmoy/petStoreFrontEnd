import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiderRegisterComponent } from './raider-register.component';

describe('RaiderRegisterComponent', () => {
  let component: RaiderRegisterComponent;
  let fixture: ComponentFixture<RaiderRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiderRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiderRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
