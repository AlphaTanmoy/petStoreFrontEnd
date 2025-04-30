import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApiAccessLogsComponent } from './admin-api-access-logs.component';

describe('AdminApiAccessLogsComponent', () => {
  let component: AdminApiAccessLogsComponent;
  let fixture: ComponentFixture<AdminApiAccessLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminApiAccessLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminApiAccessLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
