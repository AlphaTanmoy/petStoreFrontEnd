import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CutomerCareLoginComponent } from './cutomer-care-login.component';

describe('CutomerCareLoginComponent', () => {
  let component: CutomerCareLoginComponent;
  let fixture: ComponentFixture<CutomerCareLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CutomerCareLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CutomerCareLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
