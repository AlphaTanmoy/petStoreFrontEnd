import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewS3Component } from './view-s3.component';

describe('ViewS3Component', () => {
  let component: ViewS3Component;
  let fixture: ComponentFixture<ViewS3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewS3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
