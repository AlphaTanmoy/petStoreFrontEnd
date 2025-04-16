import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JwtLogsComponent } from './jwt-logs.component';

describe('JwtLogsComponent', () => {
  let component: JwtLogsComponent;
  let fixture: ComponentFixture<JwtLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JwtLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JwtLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
