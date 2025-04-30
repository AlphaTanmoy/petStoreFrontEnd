import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPaginatedRecordsComponent } from './app-paginated-records.component';

describe('AppPaginatedRecordsComponent', () => {
  let component: AppPaginatedRecordsComponent;
  let fixture: ComponentFixture<AppPaginatedRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPaginatedRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPaginatedRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
